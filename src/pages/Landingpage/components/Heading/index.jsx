import React from "react";

const sizes = {
  display_md_semibold:
    "tracking-[-0.72px] text-[36px] font-semibold mdx:text-[34px] sm:text-[32px]",
  text_xs_semibold: "text-[12px] font-semibold",
  display_sm_semibold:
    "text-[30px] font-semibold mdx:text-[28px] sm:text-[26px]",
  display_xs_semibold: "text-[24px] font-semibold mdx:text-[22px]",
  text_lg_semibold: "text-[18px] font-semibold",
  textxs: "text-[12px] font-medium",
  textmdx: "text-[15px] font-medium",
  textlg: "text-[16px] font-medium",
  text3xl: "text-[24px] font-medium mdx:text-[22px]",
  text6xl: "text-[34px] font-medium mdx:text-[32px] sm:text-[30px]",
  text7xl: "text-[36px] font-medium mdx:text-[34px] sm:text-[32px]",
  text8xl: "text-[50px] font-medium mdx:text-[46px] sm:text-[40px]",
  text9xl: "text-[56px] font-medium mdx:text-[48px] sm:text-[42px]",
  text10xl: "text-[80px] font-medium mdx:text-[48px]",
  headingxs: "text-[14px] font-semibold",
  headings: "text-[16px] font-semibold",
  headingmdx: "text-[18px] font-semibold",
  headinglg: "text-[20px] font-semibold",
  headingxl: "text-[22px] font-semibold",
  heading2xl: "text-[24px] font-bold mdx:text-[22px]",
  heading3xl: "text-[26px] font-semibold mdx:text-[24px] sm:text-[22px]",
  heading4xl: "text-[28px] font-semibold mdx:text-[26px] sm:text-[24px]",
  heading5xl: "text-[36px] font-semibold mdx:text-[34px] sm:text-[32px]",
  heading6xl: "text-[50px] font-semibold mdx:text-[46px] sm:text-[40px]",
  heading7xl: "text-[56px] font-bold mdx:text-[48px] sm:text-[42px]",
  heading8xl: "text-[60px] font-semibold mdx:text-[52px] sm:text-[46px]",
  heading9xl: "text-[100px] font-bold mdx:text-[48px]",
};

const Heading = ({
  children,
  className = "",
  size = "display_md_semibold",
  as,
  ...restProps
}) => {
  const Component = as || "h6";

  return (
    <Component
      className={`text-[#0f1728] font-['Inter'] ${className} ${sizes[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Heading };
