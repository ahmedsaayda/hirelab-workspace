import React from "react";
import { Button, Tag } from "antd";
import {
  FilterOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { SearchBar } from "./search-bar.jsx";


export function FiltersSection({
  filters,
  onRemoveFilter,
  onShowMoreFilters,
  onSelectAll,
}) {
  return (
    <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
      {filters.map((filter, index) => (
        <Tag
          key={index}
          closable
          closeIcon={<CloseOutlined className="text-gray-400" />}
          onClose={() => onRemoveFilter(filter)}
          className="!m-0 !px-3 !py-1.5 rounded-md bg-gray-50 border border-gray-200 flex items-center gap-1"
        >
          <span className="text-sm text-gray-700">{filter.value}</span>
        </Tag>
      ))}
      <Button
        type="text"
        icon={<FilterOutlined className="text-gray-600" />}
        onClick={onShowMoreFilters}
        className="!flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        More filters
      </Button>
      <div className="flex-1">
        <SearchBar />
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
