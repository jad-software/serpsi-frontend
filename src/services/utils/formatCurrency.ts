export const formatToCurrency = (value: string) => {
  if (!value) return "R$ 0,00";
  const numericValue = value.replace(/[^\d]/g, "");
  const num = parseFloat(numericValue) / 100;
  return `R$ ${num.toFixed(2).replace(".", ",")}`;
};

