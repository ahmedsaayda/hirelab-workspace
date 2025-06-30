import React from "react";

const sizes = {
  "5xl": "text-lg font-medium",
  xs: "text-[7px] font-normal",
  lg: "text-xs font-normal",
  "6xl": "text-[26px] font-normal mdx:text-2xl smx:text-[22px]",
  s: "text-[9px] font-normal",
  "2xl": "text-sm font-medium",
  "3xl": "text-base font-normal",
  "4xl": "text-[17px] font-normal",
  xl: "text-[13px] font-normal",
  md: "text-[10px] font-normal",
};

const Text = ({ children, className = "", as, size = "xl", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-gray-900_01 font-inter ${className} ${sizes[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
