import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-lg",
};
const variants = {
  tarBaseWhite: "!border-blue_gray-100 border border-solid bg-white-A700",
};
const sizes = {
  sm: "h-[96px] p-[13px] text-base",
  md: "h-[120px] p-[13px] text-base",
  xs: "h-[72px] p-[13px] text-base",
};

const TextArea = React.forwardRef(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      shape,
      size = "xs",
      variant = "tarBaseWhite",
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const handleChange = (e) => {
      if (onChange) onChange(e?.target?.value);
    };

    return (
      <textarea
        ref={ref}
        className={`${className} ${(shape && shapes[shape]) || ""} ${sizes[size] || ""} ${variants[variant] || ""}`}
        name={name}
        onChange={handleChange}
        placeholder={placeholder}
        {...restProps}
      />
    );
  },
);

TextArea.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["sm", "md", "xs"]),
  variant: PropTypes.oneOf(["tarBaseWhite"]),
};

export { TextArea };
