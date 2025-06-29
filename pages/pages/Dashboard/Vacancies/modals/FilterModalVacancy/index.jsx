import React, { useState } from "react";
import {
  Modal,
  Select,
  Slider,
  Space,
  DatePicker,
  Typography,
  Divider,
  Button,
} from "antd";
import {
  departments,
  skills,
  jobTypes,
  experienceLevels,
  educationLevels,
  languages,
  industries,
  companySizes,
} from "./data/filterData.js";

const { Option } = Select;
const { Title } = Typography;

import { CircleX, ChevronDown, ChevronUp, Search } from "lucide-react";
import dayjs from "dayjs";

const FilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  filters,
  setFilters,
  getFilterlocations,
}) => {
  // -	Filter based on department
  // - location -done
  // - department
  // - tags
  // - Date created
  // - Date unpublished
  // - + search on name

  console.log("filtersFilterModal", filters);

  // State to track which dropdowns are open
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateChange = (date, dateString) => {
    console.log("dataDateSTring-createdAt", { date, dateString });
    handleChange("createdAt", dateString); // Store selected date in filters
  };
  const handleUnpublishDateChange = (date, dateString) => {
    console.log("dataDateSTring-unpublishedAt", { date, dateString });
    handleChange("unpublishedAt", dateString); // Store selected date in filters
  };
  const handlePublishedDate = (date, dateString) => {
    console.log("dataDateSTring-publishedAt", { date, dateString });
    handleChange("publishedAt", dateString); // Store selected date in filters
  };

  const handleApply = () => {
    console.log("filtersfilters", filters);
    onApplyFilters(filters);
    onClose();
  };

  // Handle dropdown open state
  const handleLocationDropdownVisibleChange = (open) => {
    setLocationDropdownOpen(open);
  };

  const handleDepartmentDropdownVisibleChange = (open) => {
    setDepartmentDropdownOpen(open);
  };

  return (
    <Modal
      title={<Title level={4}>Filter Jobs</Title>}
      open={isOpen}
      onCancel={onClose}
      onOk={handleApply}
      width={800}
      okText="Apply Filters"
      cancelText="Cancel"
      footer={[
        <div key="footer" className="flex gap-3 justify-center mt-4 ">
          <Button
            type="text"
            key="cancel"
            onClick={onClose}
            className="w-1/2 text-gray-700 rounded-md border border-gray-300 transition duration-300 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            key="ok"
            type="primary"
            className="w-1/2 custom-button"
            onClick={handleApply}
          >
            Apply Filter
          </Button>
        </div>,
      ]}
    >
      <div className="flex flex-col gap-2" direction="vertical" size="middle" style={{ width: "100%",marginBottom: 16 }}>
        {/* Locations */}
        <div>
          <Typography.Text strong>Locations</Typography.Text>
          <div className="relative mb-2" >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select locations"
              value={filters.location}
              onChange={(value) => handleChange("location", value)}
              maxTagCount={5}
              onDropdownVisibleChange={handleLocationDropdownVisibleChange}
              suffixIcon={
                locationDropdownOpen ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )
              }
            >
              {getFilterlocations &&
                getFilterlocations.map((location) => (
                  <Option key={location} value={location}>
                    {location}
                  </Option>
                ))}
            </Select>
          </div>
        </div>

        {/* Salary Range */}
        {/* <div>
          <Typography.Text strong>Salary Range (USD)</Typography.Text>
          <Slider
            range
            min={0}
            max={200000}
            step={5000}
            value={filters.salaryRange}
            onChange={(value) => handleChange('salaryRange', value)}
            marks={{
              0: '0',
              50000: '50k',
              100000: '100k',
              150000: '150k',
              200000: '200k'
            }}
          />
        </div> */}
        {/* <hr /> */}
        {/* <Divider /> */}

        {/* Department */}
        <div>
          <Typography.Text strong>Department</Typography.Text>
          <div className="relative">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select departments"
              value={filters.department}
              onChange={(value) => handleChange("department", value)}
              maxTagCount={3}
              onDropdownVisibleChange={handleDepartmentDropdownVisibleChange}
              suffixIcon={
                departmentDropdownOpen ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )
              }
            >
              {departments.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Date Created Filter */}
        <div>
          <Typography.Text strong>Date Created</Typography.Text>
          <DatePicker
            style={{ width: "100%" }}
            onChange={handleDateChange}
            value={filters.createdAt ? dayjs(filters.createdAt) : null}
            format="YYYY-MM-DD"
            placeholder="Select created date"
          />
        </div>
        {/* Date Created Filter */}
        <div className="flex gap-2 justify-center my-1">
          <div className="w-1/2">
            <Typography.Text strong>Date Published</Typography.Text>
            <DatePicker
              style={{ width: "100%" }}
              onChange={handlePublishedDate}
              value={filters.publishedAt ? dayjs(filters.publishedAt) : null}
              format="YYYY-MM-DD"
              placeholder="Select published date"
            />
          </div>
          <div className="w-1/2">
            <Typography.Text strong>Date Unpublished</Typography.Text>
            <DatePicker
              style={{ width: "100%" }}
              onChange={handleUnpublishDateChange}
              value={
                filters.unpublishedAt ? dayjs(filters.unpublishedAt) : null
              }
              format="YYYY-MM-DD"
              placeholder="Select unpublished date"
            />
          </div>
        </div>

        {/* Skills */}
        {/* <div>
          <Typography.Text strong>Skills</Typography.Text>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select skills"
            value={filters.skills}
            onChange={(value) => handleChange('skills', value)}
            maxTagCount={3}
          >
            {skills.map(skill => (
              <Option key={skill} value={skill}>{skill}</Option>
            ))}
          </Select>
        </div> */}

        {/* Job Type */}
        {/* <div>
          <Typography.Text strong>Job Type</Typography.Text>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select job types"
            value={filters.jobTypes}
            onChange={(value) => handleChange('jobTypes', value)}
          >
            {jobTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </div> */}

        {/* <Divider /> */}

        {/* Experience */}
        {/* <div>
          <Typography.Text strong>Experience Level</Typography.Text>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select experience levels"
            value={filters.experience}
            onChange={(value) => handleChange('experience', value)}
          >
            {experienceLevels.map(level => (
              <Option key={level} value={level}>{level}</Option>
            ))}
          </Select>
        </div> */}

        {/* Education */}
        {/* <div>
          <Typography.Text strong>Education</Typography.Text>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select education levels"
            value={filters.education}
            onChange={(value) => handleChange('education', value)}
          >
            {educationLevels.map(level => (
              <Option key={level} value={level}>{level}</Option>
            ))}
          </Select>
        </div> */}

        {/* Languages */}
        {/* <div>
          <Typography.Text strong>Languages</Typography.Text>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select languages"
            value={filters.languages}
            onChange={(value) => handleChange('languages', value)}
            maxTagCount={3}
          >
            {languages.map(language => (
              <Option key={language} value={language}>{language}</Option>
            ))}
          </Select>
        </div> */}

        {/* <Divider /> */}

        {/* Industry */}
        {/* <div>
          <Typography.Text strong>Industry</Typography.Text>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select industries"
            value={filters.industry}
            onChange={(value) => handleChange('industry', value)}
            maxTagCount={3}
          >
            {industries.map(industry => (
              <Option key={industry} value={industry}>{industry}</Option>
            ))}
          </Select>
        </div> */}

        {/* Company Size */}
        {/* <div>
          <Typography.Text strong>Company Size</Typography.Text>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select company sizes"
            value={filters.companySize}
            onChange={(value) => handleChange('companySize', value)}
          >
            {companySizes.map(size => (
              <Option key={size} value={size}>{size}</Option>
            ))}
          </Select>
        </div> */}
      </div>
    </Modal>
  );
};

export const FilterTags = ({ filters, setFilters }) => {
  const removeFilter = (category, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (updatedFilters[category]) {
        if (Array.isArray(updatedFilters[category])) {
          updatedFilters[category] = updatedFilters[category].filter(
            (item) => item !== value
          );

          if (updatedFilters[category].length === 0) {
            delete updatedFilters[category];
          }
        } else if (typeof updatedFilters[category] === "string") {
          if (updatedFilters[category] === value) {
            updatedFilters[category] = updatedFilters[category].replace(
              value,
              ""
            );
          }
          if (updatedFilters[category] === "") {
            delete updatedFilters[category];
          }
        }
      }

      return { ...updatedFilters };
    });
  };

  return (
    <div className="">
      {filters &&
        Object.values(filters).some((values) => values.length > 0) && (
          <div className="px-2 py-1 w-full bg-gray-100 rounded-lg shadow-md">
            {/* <h3 className="mb-2 text-sm font-semibold">Active Filters</h3> */}

            <div className="flex flex-wrap gap-0">
              {Object.entries(filters).map(
                ([category, values]) =>
                  (Array.isArray(values) ? values.length > 0 : values) && ( // Ensure both arrays and strings are handled
                    <div
                      key={category}
                      className="flex flex-wrap items-center p-1 px-2 bg-gray-50 rounded-full border shadow-sm"
                    >
                      <span className="mr-3 text-sm font-semibold text-gray-800">
                        {category.charAt(0).toUpperCase() + category.slice(1)}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(values) ? (
                          values.map((value) => (
                            <div
                              key={`${category}-${value}`}
                              className="flex items-center justify-between bg-blue-100 text-gray-900 border border-[#0091ff74] px-2 py-0 pe-[4px] rounded-full text-sm shadow-md transition hover:bg-gray-300"
                            >
                              <span className="mr-2">{value}</span>
                              <button
                                onClick={() => removeFilter(category, value)}
                                className="flex justify-center items-center text-gray-300 transition focus:outline-none"
                              >
                                <span>
                                  <CircleX size={18} fill={"#9fa3a7"} />
                                </span>
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-between bg-blue-100 text-gray-900 border border-[#0091ff74] px-2 py-0 pe-[4px] rounded-full text-sm shadow-md transition hover:bg-gray-300">
                            <span className="mr-2">{values}</span>
                            <button
                              onClick={() => removeFilter(category, values)}
                              className="flex justify-center items-center text-gray-300 transition focus:outline-none"
                            >
                              <span>
                                <CircleX size={18} fill={"#9fa3a7"} />
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default FilterModal;
