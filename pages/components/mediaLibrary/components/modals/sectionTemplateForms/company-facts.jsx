import React, { useState } from "react";
import { Input, Button, Collapse, Popconfirm, message } from "antd";
import IconsSelector, {
  IconRenderer,
} from "../../../../../pages/LandingpageEdit/IconsSelector";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

const { Panel } = Collapse;



const CompanyFactsForm = ({
  initialData,
  onSave,
  isSaving,
}) => {
  const [showIconsSelector, setShowIconsSelector] = useState(false);
  const [selectedFactIndex, setSelectedFactIndex] = useState(
    null
  );

  const [formData, setFormData] = useState({
    companyFactsTitle: initialData?.companyFactsTitle || "Company Facts",
    companyFactsDescription: initialData?.companyFactsDescription || "",
    companyFacts: initialData?.companyFacts || [
      { headingText: "", descriptionText: "", icon: "Star" },
    ],
    type: "companyFacts",
  });
  const [activeKeys, setActiveKeys] = useState([]);

  const togglePanel = (index) => {
    setActiveKeys((prevKeys) =>
      prevKeys.includes(index.toString())
        ? prevKeys.filter((key) => key !== index.toString())
        : [...prevKeys, index.toString()]
    );
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFactChange = (index, field, value) => {
    const updatedFacts = [...formData.companyFacts];
    updatedFacts[index][field] = value;
    handleChange("companyFacts", updatedFacts);
  };

  const addFact = () => {
    handleChange("companyFacts", [
      ...formData.companyFacts,
      { headingText: "", descriptionText: "", icon: "Star" },
    ]);
  };

  const removeFact = (index) => {
    handleChange(
      "companyFacts",
      formData.companyFacts.filter((_, i) => i !== index)
    );
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Company facts saved successfully");
    } catch (error) {
      message.error("Failed to save company facts");
      console.error("Error saving company facts:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.companyFactsTitle.length}/40</p>
      </div>
      <Input
        value={formData.companyFactsTitle}
        className="w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 rounded-md"
        onChange={(e) => handleChange("companyFactsTitle", e.target.value)}
        maxLength={40}
      />
      <div className="flex justify-between items-center">
        <p>Description</p>
        <p>{formData.companyFactsDescription.length}/120</p>
      </div>
      <Input
        value={formData.companyFactsDescription}
        className="w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 rounded-md"
        onChange={(e) =>
          handleChange("companyFactsDescription", e.target.value)
        }
        maxLength={120}
      />

      <span>Facts</span>
      <Collapse
        size="small"
        ghost
        bordered={false}
        className=" !pb-0 w-full "
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(keys)}
      >
        {formData.companyFacts.map((fact, index) => (
          <Panel
            key={index}
            showArrow={false}
            className="border-none"
            header={
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => togglePanel(index)}
              >
                <span className="flex gap-1 items-center">
                  {fact.headingText || `Fact ${index + 1}`}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`size-3 transition-transform duration-200 ${
                      activeKeys.includes(index.toString()) ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
                <Popconfirm
                  title="Delete this fact?"
                  onConfirm={() => removeFact(index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <button
                    // onClick={() => removeBulletPoint(idx, a.key)}
                    className="p-2 text-red-500"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Popconfirm>
              </div>
            }
          >
            <div className="flex flex-col gap-4 p-4 border rounded-lg">
              <div className="flex items-center gap-4 justify-between">
                <span>Icon</span>
                <div
                  className="flex gap-1 items-center text-gray-400"
                  onClick={() => {
                    setSelectedFactIndex(index);
                    setShowIconsSelector(true);
                  }}
                >
                  <div>Select Icon </div>
                  <div className="p-1 border-2 rounded-sm text-[#0E87FE] border-[#0E87FE]">
                    <IconRenderer icon={fact.icon} className={""} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p>Heading</p>
                  <p>{fact.headingText.length}/25</p>
                </div>
                <Input
                  value={fact.headingText}
                  className="w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 rounded-md"
                  onChange={(e) =>
                    handleFactChange(index, "headingText", e.target.value)
                  }
                  maxLength={25}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p>Description</p>
                  <p>{fact.descriptionText.length}/80</p>
                </div>
                <Input.TextArea
                  value={fact.descriptionText}
                  onChange={(e) =>
                    handleFactChange(index, "descriptionText", e.target.value)
                  }
                  rows={3}
                  maxLength={80}
                />
              </div>
            </div>
          </Panel>
        ))}
      </Collapse>
      <Button className="mr-auto" onClick={addFact} icon={<PlusOutlined />}>
        Add Fact
      </Button>
      <Button onClick={handleSave} loading={isSaving}>
        Save Facts
      </Button>
      {showIconsSelector && selectedFactIndex !== null && (
        <IconsSelector
          visible={showIconsSelector}
          onCancel={() => setShowIconsSelector(false)}
          onSelect={(icon) => {
            handleFactChange(selectedFactIndex, "icon", icon);
            setShowIconsSelector(false);
          }}
        />
      )}
    </div>
  );
};

export default CompanyFactsForm;
