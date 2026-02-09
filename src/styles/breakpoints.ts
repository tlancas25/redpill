export const breakpoints = {
  mobile: '320px',
  mobileMd: '375px',
  mobileLg: '414px',
  tablet: '768px',
  desktop: '1024px',
  large: '1440px',
};

export const media = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  mobileMd: `@media (min-width: ${breakpoints.mobileMd})`,
  mobileLg: `@media (min-width: ${breakpoints.mobileLg})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  large: `@media (min-width: ${breakpoints.large})`,
};
