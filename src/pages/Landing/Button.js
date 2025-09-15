import { Space, Spin } from "antd";
import clsx from "clsx";
import Link from "next/link";

const baseStyles = {
  solid:
    "group inline-flex items-center justify-center rounded-lg py-2.5 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
  outline:
    "group inline-flex ring-1 items-center justify-center rounded-lg py-2.5 px-4 text-sm focus:outline-none",
};

const variantStyles = {
  solid: {
    slate:
      "bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900",
    blue: "bg-indigo-600 text-white hover:text-blue-500 hover:bg-indigo-500 active:bg-indigo-800 active:text-blue-100 focus-visible:outline-blue-600",
    white:
      "bg-white dark:bg-gray-900 text-slate-900 hover:bg-indigo-50 active:bg-indigo-200 active:text-slate-600 focus-visible:outline-white",
  },
  outline: {
    slate:
      "ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300",
    white:
      "ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white",
  },
};

export function Button({ className, loading, ...props }) {
  props.variant ??= "solid";
  props.color ??= "slate";

  className = clsx(
    baseStyles[props.variant],
    props.variant === "outline"
      ? variantStyles.outline[props.color]
      : props.variant === "solid"
      ? variantStyles.solid[props.color]
      : undefined,
    className
  );

  const renderContent = () => {
    if (loading) {
      return <Spin>{props.children}</Spin>;
    }
    return props.children; // Render the button's children when not loading
  };

  return typeof props.to === "undefined" ? (
    <button className={className} {...props} disabled={loading}>
      {renderContent()}
    </button>
  ) : (
    <Link className={className} {...props} aria-disabled={loading}>
      {renderContent()}
    </Link>
  );
}
