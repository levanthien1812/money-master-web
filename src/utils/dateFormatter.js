export const formatMonth = (month) => {
  if ((month + "").length === 1) {
    return "0" + month;
  }
  return month;
};
