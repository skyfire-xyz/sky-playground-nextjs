export const breakpoints = {
  "": 0,
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1000,
  xl: 1280,
  xxl: 1440,
  max: 1920,
} as const;

const screens = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  return { ...acc, [key]: `${value}px` };
}, {});

export default screens;
