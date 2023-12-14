export default function (monthIndex) {
  const date = new Date(0, monthIndex);

  return date.toLocaleString("default", { month: "long" });
}
