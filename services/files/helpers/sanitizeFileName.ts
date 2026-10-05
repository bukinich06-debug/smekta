export const sanitizeFileName = (name: string): string => {
  const base = name.replace(/[/\\?%*:|"<>]/g, '_').trim();
  return base.length > 0 ? base.slice(0, 200) : 'file';
};
