// Global function to safely destructure any object and provide default values
export const safeDestructure = (data, defaults) => {
    return { ...defaults, ...data };
  };
  
  // Global function to safely handle array destructuring with defaults
  export const safeArrayDestructure = (data, defaults) => {
    return Array.isArray(data) ? data : defaults;
  };
  
  export const getThemeData = (themeData) => {
    const { baseColors = {}, variants = {}, gradients = {}, textColors = {} } = safeDestructure(themeData, {});
  
    const { primary: basePrimary, secondary: baseSecondary, tertiary: baseTertiary } = baseColors;
  
    const { light: primaryLightVariants, dark: primaryDarkVariants } = variants?.primary || {};
    const { light: secondaryLightVariants, dark: secondaryDarkVariants } = variants?.secondary || {};
    const { light: tertiaryLightVariants, dark: tertiaryDarkVariants } = variants?.tertiary || {};
  
    const [variantPl1, variantPl2, variantPl3, variantPl4] = safeArrayDestructure(primaryLightVariants, []);
    const [variantPd1, variantPd2, variantPd3, variantPd4, variantPd5] = safeArrayDestructure(primaryDarkVariants, []);
    const [variantSl1, variantSl2, variantSl3, variantSl4] = safeArrayDestructure(secondaryLightVariants, []);
    const [variantSd1, variantSd2, variantSd3, variantSd4, variantSd5] = safeArrayDestructure(secondaryDarkVariants, []);
    const [variantTl1, variantTl2, variantTl3, variantTl4] = safeArrayDestructure(tertiaryLightVariants, []);
    const [variantTd1, variantTd2, variantTd3, variantTd4, variantTd5] = safeArrayDestructure(tertiaryDarkVariants, []);
  
    const { heading: textHeadingColor, subHeading: textSubHeadingColor } = textColors;
  
    return {
      basePrimary,
      baseSecondary,
      baseTertiary,

      variantPl1,
      variantPl2,
      variantPl3,
      variantPl4,

      variantPd1,
      variantPd2,
      variantPd3,
      variantPd4,
      variantPd5,

      variantSl1,
      variantSl2,
      variantSl3,
      variantSl4,
      
      variantSd1,
      variantSd2,
      variantSd3,
      variantSd4,
      variantSd5,

      variantTl1,
      variantTl2,
      variantTl3,
      variantTl4,

      variantTd1,
      variantTd2,
      variantTd3,
      variantTd4,
      variantTd5,

      textHeadingColor,
      textSubHeadingColor
    };
  };
  