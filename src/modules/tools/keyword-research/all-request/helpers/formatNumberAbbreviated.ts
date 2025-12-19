export const formatNumberAbbreviated = (num: number) => {
  const number = Number(num);
  if (isNaN(number) || number === 0) {
    return '0';
  }

  const suffixes = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

  const sign = Math.sign(number);
  const absNumber = Math.abs(number);
  const signPrefix = sign > 0 && absNumber >= 1000 ? '+' : '';

  for (let i = 0; i < suffixes.length; i++) {
    const { value, symbol } = suffixes[i];

    if (absNumber >= value) {
      const formatted = (absNumber / value).toFixed(1).replace(/\.0$/, '');

      return `${signPrefix}${formatted}${symbol}`;
    }
  }

  return number.toLocaleString('es-ES', { maximumFractionDigits: 0 });
};
