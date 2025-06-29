import React, { useState, useEffect } from "react";
import { Modal, Select, Button } from "antd";


export function FilterModal({
  open,
  onCancel,
  onApply,
  currentFilters,
}) {
  const [filters, setFilters] = useState(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) =>
      prev.some((filter) => filter.type === type)
        ? prev.map((filter) =>
            filter.type === type ? { ...filter, value } : filter
          )
        : [...prev, { type, value }]
    );
  };

  return (
    <Modal
      title="Filters"
      open={open}
      onCancel={onCancel}
      footer={[
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="w-full h-10" key="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="w-full h-10 custom-button"
            key="apply"
            type="primary"
            onClick={() => onApply(filters)}
          >
            Apply
          </Button>
        </div>,
      ]}
      width={400}
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Location
          </label>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select location(s)"
            value={
              filters.find((f) => f.type === "location")?.value || []
            }
            onChange={(value) => handleFilterChange("location", value)}
            allowClear
          >
            <Select.Option value="Berlin, Germany">
              Berlin, Germany
            </Select.Option>
            <Select.Option value="New York, USA">New York, USA</Select.Option>
            <Select.Option value="London, UK">London, UK</Select.Option>
          </Select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Department
          </label>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select department(s)"
            value={
              filters.find((f) => f.type === "department")?.value || []
            }
            onChange={(value) => handleFilterChange("department", value)}
            allowClear
          >
            <Select.Option value="IT">IT</Select.Option>
            <Select.Option value="Finance">Finance</Select.Option>
            <Select.Option value="Marketing">Marketing</Select.Option>
            <Select.Option value="Human Resources">
              Human Resources
            </Select.Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
