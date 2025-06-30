import React from "react";

const sizes = {
  text_xl_regular: "text-[20px] font-normal not-italic",
  text_md_regular: "text-[16px] font-normal not-italic",
  texts: "text-[14px] font-normal not-italic",
  textxl: "text-[18px] font-normal",
  text2xl: "text-[20px] font-normal",
  text4xl: "text-[26px] font-normal mdx:text-[24px] sm:text-[22px]",
  text5xl: "text-[30px] font-normal mdx:text-[28px] sm:text-[26px]",
};

const Text = ({
  children,
  className = "",
  as,
  size = "texts",
  ...restProps
}) => {
  const Component = as || "p";

  return (
    <Component
      className={` font-['Inter'] ${className} ${sizes[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
