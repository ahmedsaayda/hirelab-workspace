import PropTypes from "prop-types";
import React from "react";

const shapes = {
  square: "rounded-[0px]",
  circle: "rounded-[50%]",
  round: "rounded-lg",
};
const variants = {
  fill: {
    light_blue_A700: "bg-light_blue-A700 shadow-xs text-white-A700",
    indigo: "bg-indigo-500 shadow-xs text-white-A700",
    gray_100_02: "bg-gray-100_02",
    white_A700: "bg-white-A700 text-blue_gray-800",
    white_A700_e5: "bg-white-A700_e5",
    pink_50: "bg-pink-50 text-red-A200",
  },
  outline: {
    light_blue_A700: "border-light_blue-A700 border border-dashed",
    indigo: "border-indigo-500 border border-dashed",
  },
};
const sizes = {
  "5xl": "h-[60px] px-7 text-lg",
  "6xl": "h-[80px]",
  "4xl": "h-[56px] px-4",
  smx: "h-[30px] px-[5px]",
  mdx: "h-[40px] px-3",
  xl: "h-[44px] px-[18px] text-base",
  "3xl": "h-[48px] px-5 text-base",
  xs: "h-[28px] px-3 text-smx",
  lg: "h-[40px] px-4 text-smx",
  "2xl": "h-[48px] px-3",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "2xl",
  color = "white_A700",
  ...restProps
}) => {
  if (restProps.href)
    return (
      <a
        href={restProps.href}
        className={`${className} flex items-center justify-center text-center cursor-pointer ${
          (shape && shapes[shape]) || ""
        } ${(size && sizes[size]) || ""} ${
          (variant && variants[variant]?.[color]) || ""
        }`}
        {...restProps}
      >
        {!!leftIcon && leftIcon}
        {children}
        {!!rightIcon && rightIcon}
      </a>
    );
  return (
    <button
      className={`${className} flex items-center justify-center text-center cursor-pointer ${
        (shape && shapes[shape]) || ""
      } ${(size && sizes[size]) || ""} ${
        (variant && variants[variant]?.[color]) || ""
      }`}
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
  shape: PropTypes.oneOf(["square", "circle", "round"]),
  size: PropTypes.oneOf([
    "5xl",
    "6xl",
    "4xl",
    "smx",
    "mdx",
    "xl",
    "3xl",
    "xs",
    "lg",
    "2xl",
  ]),
  variant: PropTypes.oneOf(["fill", "outline"]),
  color: PropTypes.oneOf([
    "light_blue_A700",
    "gray_100_02",
    "white_A700",
    "white_A700_e5",
    "pink_50",
    "indigo",
    "",
  ]),
};

export { Button };
