import PropTypes from "prop-types";
import React from "react";

const shapes = {
  round: "rounded-lg",
};
const variants = {
  fill: {
    white_A700: "bg-white-A700 text-blue_gray-700",
    gray_50_01: "bg-gray-50_01",
    gray_100_01: "bg-gray-100_01 text-light_blue-A700",
  },
};
const sizes = {
  sm: "h-[32px] text-sm",
  xs: "h-[27px] text-sm",
  xl: "h-[48px] text-base",
  md: "h-[40px] text-sm",
  lg: "h-[44px] text-base",
};

const Input = React.forwardRef(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      children,
      label = "",
      prefix,
      suffix,
      onChange,
      shape,
      variant = "fill",
      size = "sm",
      color = "",
      ignoreSuffixClick,
      textarea,
      ...restProps
    },
    ref
  ) => {
    const handleChange = (e) => {
      if (onChange) onChange(e?.target?.value);
    };
    console.log(restProps.value);

    return (
      <>
        <label
          className={`${className} p-0 flex border border-[#D0D5DD] items-center justify-center cursor-text bg-white text-sm ${
            (shape && shapes[shape]) || ""
          } ${variants[variant]?.[color] || variants[variant] || ""} ${
            sizes[size] || ""
          }`}
          style={textarea ? { height: "auto" } : {}}
        >
          {!!label && label}
          {!!prefix && <div className="ml-3">{prefix}</div>}
          {textarea ? (
            <textarea
              ref={ref}
              name={name}
              onChange={handleChange}
              placeholder={placeholder}
              className="flex-1 h-full bg-transparent border-none rounded-lg outline-none focus:ring-0 text-sm"
              rows={4}
              {...restProps}
            />
          ) : (
            <input
              ref={ref}
              type={type}
              name={name}
              onChange={handleChange}
              placeholder={placeholder}
              className="flex-1 h-full bg-transparent border-none rounded-lg outline-none focus:ring-0 text-sm placeholder:text-xs"
              {...restProps}
            />
          )}
          {!!suffix && (
            <div
              className="mr-3 cursor-pointer"
              onClick={() => {
                if (ignoreSuffixClick) return;
                if (onChange) onChange("");
              }}
            >
              {suffix}
            </div>
          )}
        </label>
      </>
    );
  }
);

Input.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["sm", "xs", "xl", "md", "lg"]),
  variant: PropTypes.oneOf(["fill"]),
  color: PropTypes.oneOf(["white_A700", "gray_50_01", "gray_100_01"]),
};

export { Input };
