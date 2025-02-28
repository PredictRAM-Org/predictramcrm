export const paisaToRupees = (paisa) => `₹ ${paisa / 100}/-`;
export const truncateText = (text = '', maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
