import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeUpdater = ({ children }) => {
  const { baseColors, variants, gradients } = useSelector((state) => state.theme);

  useEffect(() => {

      Object.keys(baseColors).forEach(key => {
        document.documentElement.style.setProperty(`--${key}-color`, baseColors[key]);
      });

      // Loop through variants and set light and dark colors for primary, secondary, and tertiary
      Object.keys(variants).forEach(variant => {
        Object.keys(variants[variant]).forEach(lightDark => {
          variants[variant][lightDark].forEach((color, index) => {
            document.documentElement.style.setProperty(`--${variant}-${lightDark}-${index + 1}`, color);
          });
        });
      });

      // Set gradients
      Object.keys(gradients).forEach(gradient => {
        document.documentElement.style.setProperty(`--${gradient}-gradient`, gradients[gradient]);
      });
  }, [baseColors, variants, gradients]);

  return children;
};

export default ThemeUpdater;
