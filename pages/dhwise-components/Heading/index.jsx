import React from "react";

const sizes = {
  "3xl": "text-2xl font-semibold mdx:text-[22px]",
  "2xl": "text-xl font-semibold",
  "5xl": "text-4xl font-semibold mdx:text-[34px] smx:text-[32px]",
  "4xl": "text-3xl font-semibold mdx:text-[28px] smx:text-[26px]",
  "7xl": "text-5xl font-semibold mdx:text-[44px] smx:text-[38px]",
  "6xl": "text-[46px] font-semibold mdx:text-[42px] smx:text-4xl",
  "9xl": "text-6xl font-bold mdx:text-[52px] smx:text-[46px]",
  "8xl": "text-[54px] font-bold mdx:text-[46px] smx:text-[40px]",
  xl: "text-lg font-semibold",
  s: "text-xs font-semibold",
  mdx: "text-smx font-semibold",
  xs: "text-[10px] font-bold",
  lg: "text-base font-semibold",
};

const Heading = ({
  children,
  className = "",
  size = "lg",
  as,
  ...restProps
}) => {
  const Component = as || "h6";

  return (
    <Component
      className={`text-gray-900 font-inter ${className} ${sizes[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Heading };
