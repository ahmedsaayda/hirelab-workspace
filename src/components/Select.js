import { useEffect, useState } from "react";

export default function Select({ options, value, onChange }) {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);
  useEffect(() => {
    onChange(selected);
  }, [selected]);

  return (
    <select
      id="location"
      name="location"
      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-gray-400  ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900  min-w-[75px]"
      value={selected}
      onChange={(e) => {
        setSelected(e.target.value);
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option?.label ?? ""}
        </option>
      ))}
    </select>
  );
}
