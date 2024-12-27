export const getTextWidth = (txt, fontSize = 12, fontWeight = 400) => {
  const element = document.createElement("canvas");
  const context = element.getContext("2d");
  context.font = `${fontWeight} ${fontSize}px SFProDisplay`;
  return Math.ceil(context.measureText(txt).width);
};