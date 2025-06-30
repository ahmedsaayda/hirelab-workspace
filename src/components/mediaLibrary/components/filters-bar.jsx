import React from "react";
import { Button, Input } from "antd";
import {
  FilterOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";



export function FiltersBar({
  filters,
  onRemoveFilter,
  onShowMoreFilters,
  onSelectAll,
  selectedCount,
  onDeselectAll,
  onUseSelected,
}) {
  if (selectedCount && selectedCount > 0) {
    return (
      <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CloseOutlined className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
            </span>
          </div>
          <Button
            type="text"
            className="text-red-500 hover:text-red-600 px-0"
            onClick={onDeselectAll}
          >
            Deselect all
          </Button>
        </div>
        <Button type="primary" onClick={onUseSelected}>
          Use selected
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5">
      {filters.map((filter, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200"
        >
          <span className="text-sm text-gray-700">{filter.value}</span>
          <CloseOutlined
            className="text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={() => onRemoveFilter(filter)}
          />
        </div>
      ))}
      <Button
        type="text"
        icon={<FilterOutlined className="text-gray-600" />}
        onClick={onShowMoreFilters}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0"
      >
        More filters
      </Button>
      <div className="flex-1">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search"
          className="bg-gray-50 border-0"
        />
      </div>
      <Button
        type="text"
        onClick={onSelectAll}
        className="text-gray-600 hover:text-gray-800"
      >
        Select all
      </Button>
    </div>
  );
}
