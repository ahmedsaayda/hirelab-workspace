import PropTypes from "prop-types";
import React from "react";

const shapes = {
  square: "rounded-[0px]",
  round: "rounded-lg",
  circle: "rounded-[50%]",
};
const variants = {
  fill: {
    yellow_800: "bg-[#fdb022] text-[#ffffff]",
    red_400: "bg-[#f54b4b] text-[#ffffff]",
    orange_A200: "bg-[#f98f39] text-[#ffffff]",
    indigo_A700: "bg-[#473bf0] text-[#ffffff]",
    green_300: "bg-[#68d585] text-[#ffffff]",
    purple_A100: "bg-[#eea0f5] text-[#222222]",
    light_blue_A700:
      "bg-[#5207CD] shadow-[0_1px_2px_0_#1018280c] text-[#ffffff]",
    deep_purple_A400: "bg-[#5925db] text-[#ffffff]",
    black_900_99: "bg-[#00000099] text-[#ffffff]",
    gray_10101: "bg-[#f6f6f6] text-[#344054]",
    white_A700_e5: "bg-[#ffffffe5]",
    base_white: "bg-[#ffffff]",
    blue_100: "bg-[#cae3fc]",
    gray_50_01: "bg-[#f9f9f9] text-[#222222]",
    white_A700_19: "bg-[#ffffff19]",
    blue_gray_900: "bg-[#213326] text-[#ffffff]",
    green_50: "bg-[#dbf9e6]",
  },
  outline: {
    gray_300: "border-[#cfd4dc] border border-solid text-[#ffffff]",
    light_blue_A700_7f: "border-[#5207CD7f] border border-solid",
  },
};
const sizes = {
  mdx: "h-[40px] px-2.5",
  "3xl": "h-[54px] px-[34px] text-[18px]",
  "6xl": "h-[64px] px-4",
  "7xl": "h-[72px] px-7 text-[36px]",
  "5xl": "h-[60px] px-[34px] text-[26px]",
  lg: "h-[44px] px-[34px] text-[16px]",
  xl: "h-[48px] px-3",
  "4xl": "h-[56px] px-4",
  "2xl": "h-[48px] px-[34px] text-[16px]",
  sm: "h-[28px] px-2.5 text-[14px]",
  xs: "h-[28px] px-1.5",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "xs",
  color = "base_white",
  ...restProps
}) => {
  if (restProps.href)
    return (
      <a
        className={`${className} flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap ${
          shape && shapes[shape]
        } ${size && sizes[size]} ${variant && variants[variant]?.[color]}`}
        {...restProps}
      >
        {!!leftIcon && leftIcon}
        {children}
        {!!rightIcon && rightIcon}
      </a>
    );
  return (
    <button
      className={`${className} flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap ${
        shape && shapes[shape]
      } ${size && sizes[size]} ${variant && variants[variant]?.[color]}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["square", "round", "circle"]),
  size: PropTypes.oneOf([
    "md",
    "3xl",
    "6xl",
    "7xl",
    "5xl",
    "lg",
    "xl",
    "4xl",
    "2xl",
    "sm",
    "xs",
  ]),
  variant: PropTypes.oneOf(["fill", "outline"]),
  color: PropTypes.oneOf([
    "yellow_800",
    "red_400",
    "orange_A200",
    "indigo_A700",
    "green_300",
    "purple_A100",
    "light_blue_A700",
    "deep_purple_A400",
    "black_900_99",
    "gray_10101",
    "white_A700_e5",
    "base_white",
    "blue_100",
    "gray_50_01",
    "white_A700_19",
    "blue_gray_900",
    "green_50",
    "gray_300",
    "light_blue_A700_7f",
  ]),
};

export { Button };
