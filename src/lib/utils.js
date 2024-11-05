import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

export const calculatePriceChange = (oldPrice, newPrice) => {
  const difference = newPrice - oldPrice;
  const percentageChange = (difference / oldPrice) * 100;
  return {
    difference,
    percentageChange
  };
};