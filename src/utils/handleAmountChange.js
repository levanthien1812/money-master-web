export default function (value, setAmount, setFormattedAmount, setErrors) {
  setErrors((prev) => {
    if (prev && prev.amount) delete prev.amount;
    return prev;
  });

  const cleanAmount = value.replace(/[^0-9]/g, "");

  if (value.length > 0 && isNaN(parseInt(value))) {
    setErrors((prev) => {
      return { ...prev, amount: "Invalid amount!" };
    });
  } else {
    setFormattedAmount(cleanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    setAmount(parseInt(cleanAmount));
  }
}
