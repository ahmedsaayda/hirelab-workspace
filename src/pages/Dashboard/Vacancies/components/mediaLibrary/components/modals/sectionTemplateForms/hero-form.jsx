// hirelab-frontend\src\components\mediaLibrary\components\modals\sectionTemplateForms\hero-form.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Collapse, Switch, Select, Input, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
// import ImageUploader from "..."; const ImageUploader = () => <div>Image Uploader Placeholder</div>;
import { currencies } from "../../../../../../../../data/currencies.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../../../../redux/auth/selectors.js";
import { HoverProvider } from "../../../../../../../../contexts/HoverContext.js";
import {message } from 'antd'
const { Panel } = Collapse;
const { TextArea } = Input;

const timeOptions = [
  { label: "Monthly", value: "Month" },
  { label: "Annual", value: "Year" },
];

const hoursUnitOptions = [
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
];


const HeroForm = ({initialData, onSave, isSaving}) => {
  const isEditing = !!initialData; 
  const user = useSelector(selectUser);
  const [allAddresses, setAllAddresses] = useState(user?.allAddresses || []);
  const [isRemote, setIsRemote] = useState(false);
  const [isHybrid, setIsHybrid] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);
  const { setHoveredField } = useHover();

    // Main form state initialized with initialData
    const [formData, setFormData] = useState({
        vacancyTitle: initialData?.vacancyTitle || "",
        heroDescription: initialData?.heroDescription || "",
        salaryRange: initialData?.salaryRange || false,
        salaryMin: initialData?.salaryMin || "",
        salaryMax: initialData?.salaryMax || "",
        salaryCurrency: initialData?.salaryCurrency || "EUR",
        salaryTime: initialData?.salaryTime || "Month",
        hoursRange: initialData?.hoursRange || false,
        hoursMin: initialData?.hoursMin || "",
        hoursMax: initialData?.hoursMax || "",
        hoursUnit: initialData?.hoursUnit || "Daily",
        location: initialData?.location || [],
        heroImage: initialData?.heroImage || "",
        type:'hero'
      });
    
      // Initialize remote/hybrid states based on initial location
      useEffect(() => {
        if (initialData?.location) {
          const hasRemote = initialData.location.includes("Remote");
          const hasHybrid = initialData.location.includes("Hybrid");
          setIsRemote(hasRemote);
          setIsHybrid(hasHybrid);
        }
      }, [initialData]);

  // Location management
  const [searchText, setSearchText] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [isCustomLocationDeleted, setIsCustomLocationDeleted] = useState(false);

  const generateLocationOptions = useCallback(() => {
    const options = allAddresses?.map?.((address) => ({
      label: address.city,
      value: address.city,
    })) ?? [];

    if (
      searchText &&
      !options.some(
        (opt) => opt.value.toLowerCase() === searchText.toLowerCase()
      )
    ) {
      options.unshift({
        label: `Create "${searchText}"`,
        value: searchText,
        isNew: true,
      });
    }

    return options;
  }, [allAddresses, searchText]);

  useEffect(() => {
    if (!isCustomLocationDeleted) {
      setLocationOptions(generateLocationOptions());
    }
  }, [
    allAddresses,
    searchText,
    generateLocationOptions,
    isCustomLocationDeleted,
  ]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = async (values) => {
    const lastValue = values[values.length - 1];
    const isNewLocation = locationOptions.find(
      (opt) => opt.value === lastValue && opt.isNew
    );

    if (isNewLocation) {
      const newLocation = {
        country: lastValue,
        city: lastValue,
        officeName: "",
        yourLocation: "",
        street: "namename",
        address: "",
        addressType: "",
        CustomLocation: true,
      };

      setAllAddresses((prev) => [...prev, newLocation]);
      // Add actual API call here
    }

    handleChange("location", values);
  };

  const dropdownRender = (menu) => (
    <div className="rounded-lg">
      {menu}
      <div className="px-2 py-1 text-xs text-gray-500">
        Type to search or create a new location
      </div>
    </div>
  );

  const optionRender = (option) => {
    const address = allAddresses.find((addr) => addr.city === option.value);
    return (
      <div className="flex justify-between items-center">
        <span>{option.label}</span>
        {address?.CustomLocation && (
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              setAllAddresses((prev) =>
                prev.filter((addr) => addr.city !== option.value)
              );
              setIsCustomLocationDeleted(true);
            }}
            className="p-1 text-red-300 rounded-full cursor-pointer hover:bg-red-400 hover:text-white"
          />
        )}
      </div>
    );
  };

  const handleRemoteChange = (checked) => {
    setIsRemote(checked);
    setIsHybrid(false);
    handleChange("location", checked ? ["Remote"] : []);
  };

  const handleHybridChange = (checked) => {
    setIsHybrid(checked);
    setIsRemote(false);
    handleChange("location", checked ? ["Hybrid"] : []);
  };
  const handleSave = ()=>{
    onSave(formData)
    console.log("formDataaaaa", formData)
  }


  const handleUpdateTemplate = async () => {
    try {
      await onSave(formData);
      message.success("Template updated successfully");
    } catch (error) {
      message.error("Failed to update template");
      console.error("Error updating template:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Job Title & Description */}

      <div className="flex justify-between items-center">
        <p className="pb-0">Job Title</p>
        <p>{formData.vacancyTitle.length}/40</p>
      </div>
      <Input
        placeholder="Job Title"
        value={formData.vacancyTitle}
        onChange={(e) => handleChange("vacancyTitle", e.target.value)}
        className="rounded-lg border border-solid border-blue_gray-100"
        maxLength={40}
      />
      <div className="flex justify-between">
        <p className="pb-0">Headline</p>
        <p>{formData.heroDescription.length}/120</p>
      </div>
      <TextArea
        placeholder="Headline"
        value={formData.heroDescription}
        onChange={(e) => handleChange("heroDescription", e.target.value)}
        rows={3}
        className="rounded-lg border border-solid border-blue_gray-100"
        maxLength={120}
      />

      {/* Salary Range Collapse */}
      <Collapse
        activeKey={activeKeys}
        // @ts-ignore
        onChange={setActiveKeys}
        className="!border-none"
        bordered={false}
        ghost
      >
        <Panel
          key="salaryRange"
          header={
            <div className="flex items-center gap-2">
              <span className=" font-medium text-sm">Salary Range</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-3 transition-transform duration-200 ${
                  activeKeys.includes("salaryRange") ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          }
          className="border-none"
          showArrow={false}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <Switch
                checked={formData.salaryRange}
                onChange={(checked) => handleChange("salaryRange", checked)}
              />
              <span className="text-sm">Enable Salary Range</span>
            </div>

            <div className="flex gap-4">
              <Input
                placeholder="Min"
                value={formData.salaryMin}
                onChange={(e) =>
                  handleChange(
                    "salaryMin",
                    e.target.value.replace(/[^0-9.]/g, "")
                  )
                }
                className="rounded-lg border border-solid border-blue_gray-100"
              />
              {formData.salaryRange && (
                <Input
                  placeholder="Max"
                  value={formData.salaryMax}
                  onChange={(e) =>
                    handleChange(
                      "salaryMax",
                      e.target.value.replace(/[^0-9.]/g, "")
                    )
                  }
                  className="rounded-lg border border-solid border-blue_gray-100"
                />
              )}
            </div>

            <div className="flex gap-4">
              <Select
                options={currencies.map((c) => ({
                  label: c.title,
                  value: c.iso,
                }))}
                value={formData.salaryCurrency}
                onChange={(v) => handleChange("salaryCurrency", v)}
                className="w-full rounded-lg"
              />
              <Select
                options={timeOptions}
                value={formData.salaryTime}
                onChange={(v) => handleChange("salaryTime", v)}
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </Panel>

        {/* Hours Range Collapse */}
        <Panel
          key="hoursRange"
          header={
            <div className="flex gap-2 items-center pb-0">
              <span className="font-inter  font-medium text-sm">
                Hours Range
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-3 transition-transform duration-200 ${
                  activeKeys.includes("hoursRange") ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          }
          className="border-none"
          showArrow={false}
        >
          <div className="flex flex-col col-span-2 gap-2  w-full pt-0">
            <div className="flex gap-5 justify-between items-center">
              <span className="self-end ">Hours</span>
              <div className="flex gap-2">
                <span className="!font-normal ">Range</span>
                <Switch
                  checked={formData.hoursRange}
                  onChange={(checked) => {
                    handleChange("hoursRange", checked);
                  }}
                />
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="flex gap-2 justify-between items-center w-full">
                <Input
                  placeholder="Min"
                  value={formData.hoursMin}
                  onChange={(e) =>
                    handleChange(
                      "hoursMin",
                      e.target.value.replace(/[^0-9.]/g, "")
                    )
                  }
                  className="!w-full border border-solid border-blue_gray-100 rounded-lg"
                  onMouseEnter={() => setHoveredField("hoursMin")}
                  onMouseLeave={() => setHoveredField(null)}
                />

                {formData.hoursRange && (
                  <Input
                    placeholder="Max"
                    value={formData.hoursMax}
                    onChange={(e) =>
                      handleChange(
                        "hoursMax",
                        e.target.value.replace(/[^0-9.]/g, "")
                      )
                    }
                    className="w-full border border-solid border-blue_gray-100 rounded-lg"
                    onMouseEnter={() => setHoveredField("hoursMax")}
                    onMouseLeave={() => setHoveredField(null)}
                  />
                )}
              </div>
              <Select
                options={hoursUnitOptions}
                value={formData.hoursUnit}
                onChange={(v) => handleChange("hoursUnit", v)}
                className="w-full border border-solid border-blue_gray-100 rounded-lg "
                onMouseEnter={() => setHoveredField("hoursUnit")}
                onMouseLeave={() => setHoveredField(null)}
              />
            </div>
          </div>
        </Panel>

        {/* Location Collapse */}
        <Panel
          key="location"
          header={
            <div className="flex items-center gap-2">
              <span className=" font-medium text-sm">Location Settings</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-3 transition-transform duration-200 ${
                  activeKeys.includes("location") ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          }
          className="border-none"
          showArrow={false}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Switch checked={isRemote} onChange={handleRemoteChange} />
              <span className="text-sm ">Remote</span>

              <Switch checked={isHybrid} onChange={handleHybridChange} />
              <span className="text-sm ">Hybrid</span>
            </div>

            {!isRemote && (
              <Select
                mode="multiple"
                showSearch
                options={locationOptions}
                value={formData.location}
                onChange={handleLocationChange}
                onSearch={setSearchText}
                dropdownRender={dropdownRender}
                optionRender={optionRender}
                className="w-full rounded-lg"
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase()) ??
                  false
                }
              />
            )}
          </div>
        </Panel>
      </Collapse>

      {/* Image Upload */}
      <div className="mt-4">
        <ImageUploader
          defaultImage={formData.heroImage}
          onImageUpload={(url) => handleChange("heroImage", url)}
        />
      </div>

      <Button
        // type="primary"
        onClick={handleSave} // Keep this as handleSave since it's the same action
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white !hover:border !hover:shadow-sm !border-none outline-none"
      >
        {isEditing ? "Update Template" : "Create Template"}
      </Button>
    </div>
  );
};

export default HeroForm;
