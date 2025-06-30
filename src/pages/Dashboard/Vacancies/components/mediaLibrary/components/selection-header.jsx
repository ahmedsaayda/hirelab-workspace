//hirelab-frontend\src\components\mediaLibrary\components\selection-header.jsx
import React from "react";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";



export function SelectionHeader({
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onUseSelected,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <CloseOutlined className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
          </span>
        </div>
        <Button
          type="text"
          className="text-red-500 hover:text-red-600"
          onClick={onDeselectAll}
        >
          Deselect all
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button type="text" onClick={onSelectAll}>
          Select all
        </Button>
        <Button type="primary" onClick={onUseSelected}>
          Use selected
        </Button>
      </div>
    </div>
  );
}
