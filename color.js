export const DEFAULT_COLORS = [
  "#00A8F1",
  "#2350BD",
  "#A0D606",
  "#9950FE",
  "#7ED2F2",
  "#F45F5F",
  "#FFD130",
  "#563CF6",
  "#2BD99F",
  "#C036A9",
  "#E6E6E6",
  "#06A192",
  "#218BFF",
  "#8C959F",
  "#A475F9",
  "#BF8700",
  "#E16F24",
  "#E85AAD",
  "#EC6547",
  "#FA4549",
  "#5FE2BE",
  "#FFABA8",
  "#EAC54F",
  "#80CCFF",
  "#FFB4A1",
  "#D8B9FF",
  "#D0D7DE",
  "#FFADDA",
  "#FFB77C",
  "#7E7E7E",
];

// Random color
const COLOR_LETTERS = "0123456789ABCDEF";
const THRESHOLD = 25;

const generateColor = () => {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += COLOR_LETTERS[Math.floor(Math.random() * 16)];
  }
  return color;
};
const getRGB = (hexa) => {
  return {
    r: parseInt(hexa.substring(1, 3), 16),
    g: parseInt(hexa.substring(3, 5), 16),
    b: parseInt(hexa.substring(5, 7), 16),
  };
};
const checkSafeDistance = (color1, color2, threshold = THRESHOLD) => {
  const { r: r1, g: g1, b: b1 } = getRGB(color1);
  const { r: r2, g: g2, b: b2 } = getRGB(color2);
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2 >= threshold ** 2;
};
const checkSafeDistanceMultiple = (color, colorArray, threshold) => {
  return colorArray.every((colorItem) =>
    checkSafeDistance(color, colorItem, threshold)
  );
};

export const randomOneColor = ({
  ignoreColors = [],
  threshold = THRESHOLD,
}) => {
  const color = generateColor();

  if (ignoreColors.length) {
    if (checkSafeDistanceMultiple(color, ignoreColors, threshold)) {
      return color;
    } else {
      return randomOneColor({ ignoreColors, threshold });
    }
  }

  return color;
};

export const randomMultipleColor = ({
  ignoreColors = [],
  count,
  threshold = THRESHOLD,
}) => {
  const result = [];

  for (let i = 0; i < count; i++) {
    const color = randomOneColor({
      ignoreColors: [...ignoreColors, ...result],
      threshold,
    });
    result.push(color);
  }

  return result;
};
