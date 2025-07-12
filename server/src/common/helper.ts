export const setTokenExpiry = (day: number) => {
  const now = new Date();
  now.setDate(now.getDate() + day);
  return now;
};
