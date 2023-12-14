export default function getDaysInMonth(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const daysInMonth = [];
  const currentDate = startDate;

  while (currentDate <= endDate) {
    daysInMonth.push(currentDate.getDate());
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return daysInMonth;
}
