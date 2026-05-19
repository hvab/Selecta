export function normalizeFolderName(folderName) {
  return folderName.trim();
}

export function suggestFolderName(displayName) {
  return displayName
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll("'", '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
