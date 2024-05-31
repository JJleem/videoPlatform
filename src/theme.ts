import { DefaultTheme } from "styled-components";

const size = {
  mini: "376px",
  xs: "430px",
  sm: "576px",
  md: "768px",
  lg: "1199px",
  xl: "1200px",
};

export const theme: DefaultTheme = {
  red: "#e51013",
  black: {
    veryDark: "#141414",
    darker: "#181818",
    lighter: "#2f2f2f",
  },
  white: {
    lighter: "#fff",
    darker: "#e5e5e5",
  },
  xs: `(max-width: ${size.xs})`,
  sm: `(max-width: ${size.sm})`,
  md: `(max-width: ${size.md})`,
  lg: `(max-width: ${size.lg})`,
  xl: `(min-width: ${size.xl})`,
};
