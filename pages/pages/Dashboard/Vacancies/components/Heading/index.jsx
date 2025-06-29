import React from "react";

const sizes = {
  "3xl": "text-sm font-semibold",
  "2xl": "text-[13px] font-bold",
  "5xl": "text-[17px] font-bold",
  "4xl": "text-base font-semibold",
  "7xl": "text-xl font-semibold",
  "6xl": "text-lg font-bold",
  "9xl": "text-[22px] font-black",
  "8xl": "text-[21px] font-bold",
  xl: "text-xs font-bold",
  md: "text-[9px] font-bold",
  s: "text-[7px] font-bold",
  "12xl": "text-[55px] font-black mdx:text-[47px] smx:text-[41px]",
  xs: "text-[5px] font-bold",
  lg: "text-[10px] font-bold",
  "11xl": "text-3xl font-semibold mdx:text-[28px] smx:text-[26px]",
  "10xl": "text-2xl font-black mdx:text-[22px]",
};

const Heading = ({
  children,
  className = "",
  size = "xl",
  as,
  ...restProps
}) => {
  const Component = as || "h6";

  return (
    <Component
      className={`text-gray-900_01 font-satoshi ${className} ${sizes[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Heading };
