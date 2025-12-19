import { colors } from "./colorsPallette";

export const getColorByValue = (value: number, min: number, max: number) => {
  if (min === max) {
    return colors[Math.floor(colors.length / 2)];
  }

  const ratio = (value - min) / (max - min);
  const index = Math.round(ratio * (colors.length - 1));

  return colors[index];
};
