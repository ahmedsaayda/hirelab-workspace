import React from "react";
import PropTypes from "prop-types";

const shapes = {
  circle: "rounded-[50%]",
  square: "rounded-[0px]",
  round: "rounded-lg",
};
const variants = {
  outline: {
    white_A700: "border-white-A700 border border-solid text-white-A700",
    gray_900_01: "border-gray-900_01 border border-solid text-gray-900_01",
    blue_gray_100: "border-blue_gray-100 border border-solid text-blue_gray-800_01",
  },
  fill: {
    red_A200_01: "bg-red-A200_01 text-white-A700",
    red_A200: "bg-red-A200 text-white-A700",
    gray_50: "bg-gray-50 text-deep_purple-400",
    pink_50: "bg-pink-50 text-red-A200",
    white_A700: "bg-white-A700 text-blue_gray-800",
    gray_100_01: "bg-gray-100_01 text-light_blue-A700",
    light_blue_A700: "bg-light_blue-A700 shadow-sm text-white-A700",
    blue_700_01: "bg-blue-700_01 text-white-A700",
  },
};
const sizes = {
  xs: "h-[24px] px-[9px] text-sm",
  xl: "h-[30px] px-[5px]",
  "6xl": "h-[44px] px-[35px] text-sm",
  md: "h-[29px] px-4 text-[9px]",
  "2xl": "h-[34px] px-[7px]",
  "4xl": "h-[40px] px-2.5",
  "3xl": "h-[36px] px-[35px] text-sm",
  "7xl": "h-[50px] px-[35px] text-base",
  lg: "h-[29px] px-[5px] text-lg",
  sm: "h-[28px] px-3 text-xs",
  "5xl": "h-[40px] px-[35px] text-sm",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "3xl",
  color = "",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex flex-row items-center justify-center text-center cursor-pointer ${(shape && shapes[shape]) || ""} ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
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
  shape: PropTypes.oneOf(["circle", "square", "round"]),
  size: PropTypes.oneOf(["xs", "xl", "6xl", "md", "2xl", "4xl", "3xl", "7xl", "lg", "sm", "5xl"]),
  variant: PropTypes.oneOf(["outline", "fill"]),
  color: PropTypes.oneOf([
    "white_A700",
    "gray_900_01",
    "blue_gray_100",
    "red_A200_01",
    "red_A200",
    "gray_50",
    "pink_50",
    "gray_100_01",
    "light_blue_A700",
    "blue_700_01",
  ]),
};

export { Button };
