// src\redux\landingPage\themeReducer.js
import { SET_BASE_COLORS, SET_TEXT_COLORS } from './themeTypes';
import { generateVariants, generateGradient } from './themeUtils';
import { darken } from 'polished';
const initialState = {

  baseColors: {
    primary: '#236EFF',
    secondary: '#A811FF',
    tertiary: '#f4f8fb'
  },
  textColors: {
    heading: "#000",
    subHeading: "#000",
  },
  variants: {
    primary: {
      light: ['#5690ff', '#89b1ff', '#bcd3ff', '#eff4ff'],
      dark: ['#0051ef', '#0040bc', '#002f89', '#001d56', '#000c23']
    },
    secondary: {
      light: ['#b4f', '#cd77ff', '#e0aaff', '#f3ddff'],
      dark: ['#8c00dd', '#6c00aa', '#4b0077', '#2b0044', '#0b0011']
    },
    tertiary: {
      light: ['#fff', '#fff', '#fff', '#fff'],
      dark: ['#cfe0ed', '#a9c8e0', '#84b1d2', '#5e99c5', '#4080b0']
    }
  },
  gradients: {
    primary: 'linear-gradient(45deg, #5690ff, #0051ef)',
    secondary: 'linear-gradient(45deg, #b4f, #8c00dd)',
    tertiary: 'linear-gradient(45deg, #fff, #cfe0ed)'
  }

};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BASE_COLORS:
      const { primary, secondary, tertiary } = action.payload;
      console.log("theme-reducer", { primary, secondary, tertiary },)
      // Generate variants and gradients for each base color
      const primaryVariants = generateVariants(primary);
      const secondaryVariants = generateVariants(secondary);
      const tertiaryVariants = generateVariants(tertiary);

      return {
        ...state,
        baseColors: { primary, secondary, tertiary },
        textColors: {
          heading: state?.textColors?.heading || darken(0.2, primary),   // e.g., 20% darker for headings
          subHeading: state?.textColors?.subHeading || darken(0.15, primary), // e.g., 15% darker for subheadings
        },
        variants: {
          primary: primaryVariants,
          secondary: secondaryVariants,
          tertiary: tertiaryVariants,
        },
        gradients: {
          primary: generateGradient(primary),
          secondary: generateGradient(secondary),
          tertiary: generateGradient(tertiary),
        },
      };
    case SET_TEXT_COLORS:
      return {
        ...state,
        textColors: {
          heading: action?.payload?.heading,
          subHeading: action?.payload?.subHeading
        }
      };
    default:
      return state;
  }
};

export default themeReducer;
