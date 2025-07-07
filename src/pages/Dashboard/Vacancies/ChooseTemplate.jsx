import React, { useState } from "react";
import { Button, Heading, Img } from "./components/components/index.jsx";
import { PlusOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
function ChooseTemplate({ onChooseTemplate, selectedTemplate }) {

  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  // Handle template click for preview
  const handleTemplateClick = (templateId) => {
    setPreviewTemplate(templateId);
    setPreviewModalVisible(true);
  };

  return (
    <div className="rounded-[12px] bg-white-A700">
      <div className="rounded-[12px] py-8 pl-6 pr-[23px] smx:p-5">
        <div className="flex flex-col gap-[29px]">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-6 justify-center mdx:grid-cols-2">
              {new Array(3).fill(0).map((a, i) => (
                <div
                  key={i}
                  className={`flex w-full flex-col items-start gap-5 rounded-lg border px-3.5 py-4 cursor-pointer ${
                    selectedTemplate === i + 1
                      ? "border-solid border-light_blue-A700 bg-gray-100_01"
                      : ""
                  }`}
                  onClick={() => {
                    // setSelectedTemplate(i);
                    onChooseTemplate(i + 1);
                  }}
                >
                  {/* <Img
                    src={ `/images/template-thumbnails/TemplateHero${i +1}.png`}
                    alt="Template Hero 1"
                    className="h-[125px] w-full rounded-md object-cover mdx:h-auto"
                  /> */}

                  <div className="relative w-full group">
                    <div className="overflow-hidden rounded-md">
                      <Img
                        src={`/images/template-thumbnails/TemplateHero${
                          i + 1
                        }.png`}
                        alt={`Template Hero ${i + 1}`}
                        className="h-[125px] w-full object-cover mdx:h-auto transition-all duration-300 group-hover:brightness-50 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {/* Template Preview Trigger */}
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      onClick={() => handleTemplateClick(i + 1)} // Open preview modal
                    >
                      <div className="p-2 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                        <EyeOutlined className="text-transparent group-hover:text-white text-3xl transition-all duration-300" />
                      </div>
                    </div>
                  </div>

                  <Heading
                    size="2xl"
                    as="h2"
                    className="!text-gray-900 whitespace-nowrap"
                  >
                    Template {i + 1}
                  </Heading>
                  <div className="flex flex-col gap-3 self-stretch">
                    <Button
                      {...({} )}
                      onClick={() => onChooseTemplate(i + 1)}
                      size="2xl"
                      shape="round"
                      disabled={i !== 0}
                      className={`${
                        selectedTemplate === i + 1
                          ? "bg-[#0E87FE] text-[#FFFFFF]"
                          : "bg-[#EFF8FF] text-[#0E87FE]"
                      } w-full font-semibold smx:px-5 whitespace-nowrap`}
                    >
                      {/* Choose template */}
                      {i === 0 ? "Select Template" : "Coming Soon"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Template Preview"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        width={previewMode === "desktop" ? 1000 : 400}
        className="template-preview-modal"
        style={{
          top: 20,
          marginTop: 0,
          maxHeight: "98vh",
          overflowY: "auto",
        }}
      >
        {previewTemplate && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-100 p-1 rounded-full flex items-center">
                <button
                  className={`px-4 py-2 rounded-full font-medium text-sm ${
                    previewMode === "desktop"
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500"
                  }`}
                  onClick={() => setPreviewMode("desktop")}
                >
                  Desktop
                </button>
                <button
                  className={`px-4 py-2 rounded-full font-medium text-sm ${
                    previewMode === "mobile"
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500"
                  }`}
                  onClick={() => setPreviewMode("mobile")}
                >
                  Mobile
                </button>
              </div>
            </div>

            {previewMode === "desktop" ? (
              <div className="flex justify-center transition-all duration-300 fade-in">
                <div className="relative w-[900px] h-[600px] border-8 border-gray-800 rounded-[20px] overflow-auto shadow-xl">
                  <div className="h-full overflow-y-auto">
                    <Img
                      src={`/images/template-thumbnails/TemplateDesktop${previewTemplate}.png`}
                      alt={`Template Desktop ${previewTemplate}`}
                      className="w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center transition-all duration-300 fade-in">
                <div className="relative w-[400px] h-[667px] border-8 border-gray-800 rounded-[40px] overflow-auto shadow-xl">
                  <div className="h-full overflow-y-auto">
                    <Img
                      src={`/images/template-thumbnails/TemplateMobile${previewTemplate}.png`}
                      alt={`Template Mobile ${previewTemplate}`}
                      className="w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ChooseTemplate;
