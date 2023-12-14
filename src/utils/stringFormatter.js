export const shorten = (str, length) => {
  if (str && str.length > length) {
    return str.slice(0, length) + "...";
  } else {
    return str || "";
  }
};
