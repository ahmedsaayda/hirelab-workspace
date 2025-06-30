import React from "react";

const sizes = {
  xs: "text-xs font-normal",
  s: "text-sm font-medium",
  md: "text-base font-medium",
};

const Text = ({ children, className = "", as, size = "s", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-blue_gray-700 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
