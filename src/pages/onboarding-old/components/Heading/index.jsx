import React from "react";

const sizes = {
  s: "text-sm font-semibold",
  md: "text-xl font-semibold",
  xs: "text-[10px] font-bold",
  lg: "text-3xl font-semibold mdx:text-[28px] smx:text-[26px]",
};

const Heading = ({
  children,
  className = "",
  size = "s",
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
