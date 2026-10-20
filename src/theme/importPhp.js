const supportedKeys = ['display_name', 'supports_dark_mode', 'use_likely_light', 'colors'];
const closingTokens = { '[': ']', '(': ')', '{': '}' };
const doubleQuotedEscapes = { n: '\n', r: '\r', t: '\t', v: '\v', e: '\x1b', f: '\f' };

function readString(source, start) {
  const quote = source[start];
  let value = '';
  let literal = true;
  let index = start + 1;

  while (index < source.length) {
    const character = source[index++];

    if (character === quote) return { index, token: { kind: 'string', value, literal } };
    if (quote === '"' && character === '$') literal = false;
    // Braced interpolation can contain its own quoted expressions.
    if (quote === '"' && character === '{' && source[index] === '$') {
      throw new Error('Unsupported interpolation');
    }
    if (quote === '"' && character === '$' && source[index] === '{') {
      throw new Error('Unsupported interpolation');
    }

    if (character !== '\\') {
      value += character;
      continue;
    }

    const escaped = source[index++];

    if (escaped === quote || escaped === '\\') {
      value += escaped;
    } else if (quote === "'") {
      value += `\\${escaped}`;
    } else if (escaped === '$') {
      value += '$';
    } else if (Object.hasOwn(doubleQuotedEscapes, escaped)) {
      value += doubleQuotedEscapes[escaped];
    } else if (escaped === 'x' && /^[\da-f]/i.test(source[index] ?? '')) {
      const digits = source.slice(index).match(/^[\da-f]{1,2}/i)[0];
      value += String.fromCharCode(Number.parseInt(digits, 16));
      index += digits.length;
    } else if (/[0-7]/.test(escaped ?? '')) {
      const digits = `${escaped}${source.slice(index).match(/^[0-7]{0,2}/)[0]}`;
      value += String.fromCharCode(Number.parseInt(digits, 8) % 256);
      index += digits.length - 1;
    } else if (escaped === 'u' && source[index] === '{') {
      literal = false;
    } else {
      value += `\\${escaped}`;
    }
  }

  throw new Error('Unterminated string');
}

function tokenize(source) {
  const tokens = [];
  let index = source.match(/^\uFEFF?\s*<\?php\b/i)?.[0].length;

  if (index === undefined) return null;

  while (index < source.length) {
    const rest = source.slice(index);

    if (/^\s/.test(rest)) {
      index += rest.match(/^\s+/)[0].length;
    } else if (rest.startsWith('/*')) {
      const end = source.indexOf('*/', index + 2);
      if (end === -1) throw new Error('Unterminated comment');
      index = end + 2;
    } else if (rest.startsWith('//') || (rest[0] === '#' && rest[1] !== '[')) {
      index += rest.search(/[\r\n]|\?>/) === -1 ? rest.length : rest.search(/[\r\n]|\?>/);
    } else if (rest.startsWith('?>')) {
      if (source.slice(index + 2).trim()) throw new Error('Unsupported trailing content');
      break;
    } else if (rest[0] === "'" || rest[0] === '"') {
      const string = readString(source, index);
      tokens.push(string.token);
      index = string.index;
    } else if (rest[0] === '`' || rest.startsWith('<<<') || rest.startsWith('<?')) {
      throw new Error('Unsupported PHP syntax');
    } else if (rest.startsWith('=>')) {
      tokens.push({ kind: '=>' });
      index += 2;
    } else if (/^[a-z_]/i.test(rest)) {
      const word = rest.match(/^[a-z_][a-z_\d]*/i)[0];
      tokens.push({ kind: word.toLowerCase() });
      index += word.length;
    } else {
      tokens.push({ kind: rest[0] });
      index += 1;
    }
  }

  return tokens;
}

function parseValue(tokens) {
  if (tokens.length === 1) {
    if (tokens[0].kind === 'string' && tokens[0].literal) return tokens[0].value;
    if (tokens[0].kind === 'true') return true;
    if (tokens[0].kind === 'false') return false;
  }

  const start = tokens[0]?.kind === '[' ? 1 : tokens[0]?.kind === 'array' && tokens[1]?.kind === '(' ? 2 : 0;

  if (!start || tokens.at(-1)?.kind !== (start === 1 ? ']' : ')')) return undefined;

  const entries = [];
  const stack = [];
  let entryStart = start;

  for (let index = start; index < tokens.length; index += 1) {
    const kind = tokens[index].kind;

    if (!stack.length && (kind === ',' || index === tokens.length - 1)) {
      const entry = tokens.slice(entryStart, index);

      if (entry[0]?.kind === 'string' && entry[0].literal && entry[1]?.kind === '=>') {
        entries.push([entry[0].value, parseValue(entry.slice(2))]);
      }
      entryStart = index + 1;
    } else if (Object.hasOwn(closingTokens, kind)) {
      stack.push(closingTokens[kind]);
    } else if (Object.values(closingTokens).includes(kind) && stack.pop() !== kind) {
      throw new Error('Unbalanced expression');
    }
  }

  if (stack.length) throw new Error('Unbalanced expression');

  return Object.fromEntries(entries);
}

export function parseThemeInfo(source) {
  if (typeof source !== 'string') return null;

  try {
    const tokens = tokenize(source);

    if (tokens?.[0]?.kind !== 'return') return null;
    if (tokens.at(-1)?.kind === ';') tokens.pop();

    const result = parseValue(tokens.slice(1));

    if (!result || typeof result !== 'object') return null;

    return Object.fromEntries(
      supportedKeys.filter((key) => Object.hasOwn(result, key)).map((key) => [key, result[key]])
    );
  } catch {
    return null;
  }
}
