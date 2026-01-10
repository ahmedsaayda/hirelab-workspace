


import React, { useState } from "react";
import { Modal, Select, Typography, Button } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";

import { CircleX } from "lucide-react";

const { Option } = Select;
const { Title } = Typography;

// Orientation filter options with icons
const orientationOptions = [
  { value: "all", label: "All", icon: null },
  {
    value: "landscape",
    label: "Horizontal",
    icon: (
      <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
        <rect x="0.5" y="0.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    )
  },
  {
    value: "portrait",
    label: "Vertical",
    icon: (
      <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
        <rect x="0.5" y="0.5" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    )
  },
  {
    value: "squarish",
    label: "Square",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <rect x="0.5" y="0.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    )
  },
];

const MediaFilterMedia = ({
  isOpen,
  onClose,
  onApply,
  filterOptions,
  initialFilters = {},
}) => {
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [dropdownOpenKey, setDropdownOpenKey] = useState(null);

  const handleChange = (key, values) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: values }));
  };

  const handleOrientationChange = (value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      orientation: value === "all" ? undefined : value
    }));
  };

  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };

  return (
    <Modal
      title={<Title level={4}>Filter Media</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <div className="flex flex-col gap-2 sm:flex-row" key="footer">
          <Button className="w-full border border-[#D0D5DD] text-[#344054]" onClick={onClose} type="text">Cancel</Button>
          <Button className="w-full custom-button" type="primary" onClick={handleApply}>Apply Filters</Button>
        </div>,
      ]}
    >
      {/* Orientation Filter */}
      <div style={{ marginBottom: 16 }}>
        <Typography.Text strong>Orientation</Typography.Text>
        <div className="flex flex-wrap gap-2 mt-2">
          {orientationOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleOrientationChange(opt.value)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors flex items-center gap-1.5 ${(selectedFilters.orientation === opt.value) ||
                  (opt.value === "all" && !selectedFilters.orientation)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(filterOptions).map(([key, options]) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <Typography.Text strong>{key.charAt(0).toUpperCase() + key.slice(1)}</Typography.Text>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder={`Select ${key}`}
            value={selectedFilters[key] || []}
            onChange={(values) => handleChange(key, values)}
            onDropdownVisibleChange={(open) => setDropdownOpenKey(open ? key : null)}
            suffixIcon={
              dropdownOpenKey === key ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )
            }
          >
            {options.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
      ))}
    </Modal>
  );
};

export default MediaFilterMedia;



// Map orientation values to display labels
const orientationLabels = {
  landscape: "Horizontal",
  portrait: "Vertical",
  squarish: "Square",
};

export const FilterTags = ({ filters, setFilters }) => {
  const removeFilter = (category, value) => {
    setFilters((prev) => {
      const updated = { ...prev };

      if (Array.isArray(updated[category])) {
        updated[category] = updated[category].filter((v) => v !== value);
        if (updated[category].length === 0) delete updated[category];
      } else {
        delete updated[category];
      }

      return updated;
    });
  };

  const formatKey = (key) =>
    key
      .replace(/([A-Z])/g, " $1") // Insert space before caps
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

  const formatValue = (key, value) => {
    // Special handling for orientation values
    if (key === "orientation" && orientationLabels[value]) {
      return orientationLabels[value];
    }
    return value;
  };

  const hasActiveFilters = Object.values(filters).some(
    (val) => Array.isArray(val) ? val.length > 0 : !!val
  );

  if (!hasActiveFilters) return null;

  return (
    <div className="w-full bg-gray-100 p-3 rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(filters).map(([key, val]) => {
          if (Array.isArray(val) && val.length > 0) {
            return val.map((value) => (
              <div
                key={`${key}-${value}`}
                className="flex items-center gap-1 bg-blue-100 text-gray-800 border border-blue-300 px-2 py-1 rounded-full text-sm"
              >
                <span className="font-semibold">{formatKey(key)}:</span>
                <span>{formatValue(key, value)}</span>
                <button
                  title='remove filter'
                  onClick={() => removeFilter(key, value)}
                  className="text-gray-500 hover:text-black"
                >
                  <CircleX size={16} />
                </button>
              </div>
            ));
          } else if (val) {
            return (
              <div
                key={`${key}-${val}`}
                className="flex items-center gap-1 bg-blue-100 text-gray-800 border border-blue-300 px-2 py-1 rounded-full text-sm"
              >
                <span className="font-semibold">{formatKey(key)}:</span>
                {/* @ts-ignore */}
                <span>{formatValue(key, val)}</span>
                <button
                  title="remove filter"
                  onClick={() => removeFilter(key, val)}
                  className="text-gray-500 hover:text-black"
                >
                  <CircleX size={16} />
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
