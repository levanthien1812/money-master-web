export default function () {
  const months = [];
  const date = new Date();

  for (let i = 0; i < 12; i++) {
    date.setMonth(i);
    const monthName = date.toLocaleString("default", { month: "short" });
    months.push({ id: i, name: monthName });
  }

  return months;
}
