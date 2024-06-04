export const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.3, type: "tween" },
    display: "block",
  },
};

export const rowVariants = {
  hidden: { x: window.outerWidth + 10 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 10 },
};

export const boxVariants = {
  normal: { scale: 1 },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -60,
    transition: { delay: 0.3, type: "tween" },
  },
};
