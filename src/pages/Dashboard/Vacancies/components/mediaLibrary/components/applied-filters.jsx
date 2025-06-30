import React from "react";
import { Button, Tag } from "antd";
import { FilterOutlined, CloseOutlined } from "@ant-design/icons";



export function AppliedFilters({
  filters,
  onRemoveFilter,
  onShowMoreFilters,
}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      {filters.map((filter, index) => (
        <Tag
          key={index}
          closable
          onClose={() => onRemoveFilter(filter)}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100"
        >
          {filter.value}
        </Tag>
      ))}
      <Button
        type="text"
        icon={<FilterOutlined />}
        onClick={onShowMoreFilters}
        className="text-gray-600"
      >
        More filters
      </Button>
    </div>
  );
}
