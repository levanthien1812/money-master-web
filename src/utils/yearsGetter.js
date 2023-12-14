export default function (quantity) {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (
    let i = currentYear - quantity / 2;
    i <= currentYear + quantity / 2;
    i++
  ) {
    years.push({ id: i, name: i });
  }

  return years;
}
