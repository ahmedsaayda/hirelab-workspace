import clsx from "clsx";
import { useId } from "react";

const formClasses =
  "block w-full appearance-none rounded-md border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-400  placeholder-gray-400 focus:border-[#5207CD] focus:bg-white dark:bg-gray-900 focus:outline-none focus:shadow-custom focus:ring-[#5207CD] sm:text-sm dark:bg-gray-900";

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="mb-3 block text-sm font-medium text-[#475467] dark:text-gray-300 "
    >
      {children}
    </label>
  );
}

export function TextField({ label, type = "text", className, ...props }) {
  let id = useId();

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  );
}

export function SelectField({ label, className, ...props }) {
  let id = useId();

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, "pr-8")} />
    </div>
  );
}
