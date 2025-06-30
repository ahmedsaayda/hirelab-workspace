import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";



export function SearchBar({
  variant = "content",
  className = "",
}) {
  return (
    <Input
      prefix={<SearchOutlined className="text-gray-400" />}
      placeholder="Search"
      className={`${
        variant === "header" ? "bg-gray-50 border-0" : "bg-white"
      } rounded-md ${className}`}
      style={{
        height: "40px",
        fontSize: "14px",
      }}
    />
  );
}
