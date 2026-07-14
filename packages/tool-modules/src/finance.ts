export function formatCurrency(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function calculateEmi(
  principal: number,
  annualRate: number,
  months: number,
) {
  const rate = annualRate / 100 / 12;
  const monthlyPayment =
    rate > 0
      ? (principal * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1)
      : principal / months;
  return {
    emi: monthlyPayment,
    totalPayable: monthlyPayment * months,
    totalInterest: monthlyPayment * months - principal,
  };
}

export function calculateGst(amount: number, rate: number) {
  const tax = amount * (rate / 100);
  return {
    taxableAmount: amount,
    tax,
    total: amount + tax,
  };
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear = 1,
) {
  const ratePerPeriod = annualRate / 100 / compoundsPerYear;
  const periods = compoundsPerYear * years;
  const total = principal * Math.pow(1 + ratePerPeriod, periods);
  return {
    finalAmount: total,
    totalInterest: total - principal,
    periods,
    compoundsPerYear,
  };
}
