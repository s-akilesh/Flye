export const sanitizeSeoValue = (val) => {
  if (!val) return '';
  return val.replace(/["'<>]/g, '').trim();
};
