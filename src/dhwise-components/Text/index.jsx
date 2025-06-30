import React from "react";

const sizes = {
  "5xl": "text-4xl font-medium mdx:text-[34px] smx:text-[32px]",
  xs: "text-[9px] font-normal",
  lg: "text-smx font-normal",
  s: "text-[10px] font-normal",
  "2xl": "text-lg font-normal",
  "3xl": "text-xl font-normal",
  "4xl": "text-2xl font-medium mdx:text-[22px]",
  xl: "text-base font-normal",
  mdx: "text-xs font-normal",
};

const Text = ({ children, className = "", as, size = "lg", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-blue_gray-700_01 font-inter ${className} ${sizes[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
