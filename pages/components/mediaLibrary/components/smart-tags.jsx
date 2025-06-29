import React from "react";
import { Input, Tag } from "antd";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";



export function SmartTags({
  defaultValue = [],
  suggestions = [],
  onChange,
}) {
  const [tags, setTags] = useState(defaultValue);
  const [searchValue, setSearchValue] = useState("");

  const handleRemove = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleAdd = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);
      onChange?.(newTags);
    }
    setSearchValue("");
  };

  const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
      case "new york":
        return "bg-blue-50 text-blue-600";
      case "finance":
        return "bg-purple-50 text-purple-600";
      case "controller":
        return "bg-pink-50 text-pink-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag}
            closable
            onClose={() => handleRemove(tag)}
            className={`m-0 px-3 py-1 rounded-md border border-gray-200 ${getTagColor(
              tag
            )}`}
          >
            {tag}
          </Tag>
        ))}
      </div>
      <Input
        prefix={<SearchOutlined className="text-gray-400" />}
        placeholder="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onPressEnter={(e) => handleAdd(e.currentTarget.value)}
        className="bg-white"
      />
      {searchValue && (
        <div className="bg-white border rounded-md shadow-sm">
          {suggestions
            .filter(
              (s) =>
                s.toLowerCase().includes(searchValue.toLowerCase()) &&
                !tags.includes(s)
            )
            .map((suggestion) => (
              <div
                key={suggestion}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAdd(suggestion)}
              >
                {suggestion}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
