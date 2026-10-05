export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} Б`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb >= 100 ? 0 : 1)} КБ`;

  const mb = kb / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} МБ`;
};
