


import React, { useState } from "react";
import { Modal, Select, Typography, Button } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";

import { CircleX } from "lucide-react";

const { Option } = Select;
const { Title } = Typography;



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
                <span>{value}</span>
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
                <span>{val}</span>
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
