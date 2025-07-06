"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Form, Input, Modal, Radio, Skeleton, Switch, message, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import CrudService from "../../services/CrudService";
import PublicService from "../../services/PublicService";
import { changeIndigoShades, generateTailwindPalette } from "../Dashboard";
import { Button, Heading, Img, Text } from "../Dashboard/Vacancies/components/components";
import Header from "../Dashboard/Vacancies/components/components/Header";
import ApplicationformAddQuestions, {
  formItems,
} from "../Dashboard/Vacancies/modals/ApplicationformAddQuestions";
import FormE from "../Landingpage/Form";
import EditorRender from "../LandingpageEdit/EditorRender";
import {FaGripVertical,FaTrash} from "react-icons/fa6";
import { DragDropContext as BeautifulDragDropContext, Droppable as BeautifulDroppable, Draggable as BeautifulDraggable } from "@hello-pangea/dnd";
import {PlusOutlined} from "@ant-design/icons";
const { TextArea } = Input;

export default function FormEdit({paramsId}) {
  const router = useRouter();
  const lpId = paramsId;
  const [landingPageData, setLandingPageData] = useState(null);
  const [questionModal, setQuestionModal] = useState(false);
  const [formSections, setFormSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isEditingForm, setIsEditingForm] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [device, setDevice] = useState('desktop');
  

  console.log("formSections", formSections);

  const fetchData = useCallback(() => {
    if (lpId) {
      CrudService.getSingle("LandingPageData", lpId).then((res) => {
        if (res.data) {
          setLandingPageData(res.data);
          // Ensure all fields have visible: true if not set
          const fields = (res.data?.form?.fields || []).map(field => ({
            ...field,
            visible: field.visible === undefined ? true : field.visible
          }));
          setFormSections(fields);
        }
      });
      PublicService.getLPBrand(lpId).then((res) => {
        // if (res.data?.color) {
        //   changeIndigoShades(generateTailwindPalette(res.data?.color));
        // }
      });
    }
  }, [lpId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    // Build a list with header, formSections, footer
    const allItems = [
      { id: "flexaligntop", type: "header" },
      ...formSections,
      { id: "flexalign", type: "footer" },
    ];
    const newAllItems = Array.from(allItems);
    const [reorderedItem] = newAllItems.splice(result.source.index, 1);
    newAllItems.splice(result.destination.index, 0, reorderedItem);

    // Only update formSections (exclude header/footer)
    const newSections = newAllItems.filter(
      (item) => item.type !== "header" && item.type !== "footer"
    );
    setFormSections(newSections);
    updateFormData(newSections);
  };

  const updateFormData = async (fields) => {
    console.log("updateFormData", fields);
    const updatedData = {
      ...landingPageData,
      form: {
        ...landingPageData.form,
        fields,
      },
      _id: undefined,
    };
    setLandingPageData(updatedData);
    await CrudService.update("LandingPageData", lpId, updatedData);
  };

  const handleAddSection = (type) => {
    console.log("type", type);

    const typeExist = formSections.find((section) => section.id === type);
    if (typeExist) {
      message.error("This section already exists");
      return;
    }
    const newSection = {
      id: type,
      type,
      label: formItems.find((item) => item.type === type)?.text || "",
      placeholder: "",
      required: ["email", "contact", "phone"].includes(type) ? true : false,
      visible: true, // default visible
      ...(type === "multichoice"
        ? { options: [{ text: "Option 1", isNegative: false }] }
        : {}),
      ...(type === "number" ? { min: 0, max: 100 } : {}),
      ...(type === "contact"
        ? {
            firstName: { visible: true, required: true },
            lastName: { visible: true, required: true },
          }
        : {}),
    };
    const updatedSections = [...formSections, newSection];
    setFormSections(updatedSections);
    updateFormData(updatedSections);
    setQuestionModal(false);
  };

  const handleRemoveSection = (sectionId) => {
    const updatedSections = formSections.filter(
      (section) => section.id !== sectionId
    );
    setFormSections(updatedSections);
    updateFormData(updatedSections);
    if (selectedSection?.id === sectionId) {
      setSelectedSection(null);
      setIsEditingForm(true);
    }
  };

  const handleUpdateSection = (sectionId, updates) => {
    const updatedSections = formSections.map((section) => {
      if (section.id !== sectionId) return section;
      // If updating visible and setting to false, also set required to false
      if (updates.hasOwnProperty('visible') && updates.visible === false) {
        return { ...section, ...updates, required: false };
      }
      // Special handling for contact section subfields
      if (updates.firstName && updates.firstName.visible === false) {
        return {
          ...section,
          firstName: { ...section.firstName, ...updates.firstName, required: false },
          ...(updates.lastName ? { lastName: { ...section.lastName, ...updates.lastName } } : {})
        };
      }
      if (updates.lastName && updates.lastName.visible === false) {
        return {
          ...section,
          lastName: { ...section.lastName, ...updates.lastName, required: false },
          ...(updates.firstName ? { firstName: { ...section.firstName, ...updates.firstName } } : {})
        };
      }
      return { ...section, ...updates };
    });
    setFormSections(updatedSections);
    updateFormData(updatedSections);

    // Update the selectedSection state
    if (selectedSection && selectedSection.id === sectionId) {
      setSelectedSection({ ...selectedSection, ...updates });
    }
  };

  const handleFieldUpdate = (updatedField) => {
    const updatedSections = formSections.map((section) =>
      section.id === updatedField.id ? updatedField : section
    );
    setFormSections(updatedSections);
    updateFormData(updatedSections);
  };

  const renderFieldEditor = () => {
    if (!selectedSection) return null;

    // Find the current section from formSections
    const currentSection = formSections.find(
      (section) => section.id === selectedSection.id
    );

    if (!currentSection) return null;

    return (
      <Form layout="vertical" className="space-y-4">
      <Form.Item label={<span className="font-bold text-[14px] text-[#475647]">Field Label</span>}>

          <Input
            value={currentSection.label}
            onChange={(e) =>
              handleUpdateSection(currentSection.id, { label: e.target.value })
            }
            className="rounded-lg"
          />
        </Form.Item>

        {/* <Form.Item label="Placeholder"> */}
      <Form.Item label={<span className="font-bold text-[14px] text-[#475647]">Placeholder</span>}>

          <Input
            value={currentSection.placeholder}
            onChange={(e) =>
              handleUpdateSection(currentSection.id, {
                placeholder: e.target.value,
              })
            }
            className="rounded-lg"
          />
        </Form.Item>

        {currentSection.type === "number" && (
          <div className="flex gap-4">
            <Form.Item label="Min Value" className="flex-1">
              <Input
                type="number"
                value={currentSection.min}
                onChange={(e) =>
                  handleUpdateSection(currentSection.id, {
                    min: e.target.value,
                  })
                }
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item label="Max Value" className="flex-1">
              <Input
                type="number"
                value={currentSection.max}
                placeholder="Enter Answers"
                onChange={(e) =>
                  handleUpdateSection(currentSection.id, {
                    max: e.target.value,
                  })
                }
                className="rounded-lg"
              />
            </Form.Item>
          </div>
        )}

        {/* Multichoice, Dropdown, Multiselect Option Editors */}
        {(currentSection.type === "multichoice" || currentSection.type === "dropdown" || currentSection.type === "multiselect") && (
          <Form.Item label={<span className="font-bold text-[16px] text-[#475647]">Options</span>}>
            <div className="space-y-2">
              {currentSection.options?.map((option, index) => (
                <div key={index} className="relative flex items-center w-full mb-2">
                  <Input
                    value={option.text}
                    onChange={(e) => {
                      const newOptions = [...currentSection.options];
                      newOptions[index] = { ...option, text: e.target.value };
                      handleUpdateSection(currentSection.id, {
                        options: newOptions,
                      });
                    }}
                    className="rounded-lg  w-full mt-2"
                    placeholder="Enter Option"
                  />
                  <Button
                    size="xl"
                    onClick={() => {
                      const newOptions = currentSection.options.filter(
                        (_, i) => i !== index
                      );
                      handleUpdateSection(currentSection.id, {
                        options: newOptions,
                      });
                    }}
                    className="!absolute right-2 top-1/2 -translate-y-1/2 p-0  bg-transparent border-none shadow-none"
                    style={{ lineHeight: 0, minWidth: 0 }}
                    type="text"
                  >
                    <img
                      src="/images2/img_trash_01_red_700.svg"
                      alt="trash-01"
                      className="h-[20px] w-[20px] cursor-pointer mt-2"
                    />
                  </Button>
                </div>
              ))}
              <Button
                size="xl"
                onClick={() => {
                  const newOptions = [
                    ...(currentSection.options || []),
                    { text: "", isNegative: false },
                  ];
                  handleUpdateSection(currentSection.id, {
                    options: newOptions,
                  });
                }}
                className="mt-2 text-[14px] text-[#475647] font-bold"
              >
                <PlusOutlined /> Add More
              </Button>
            </div>
          </Form.Item>
        )}

        {/* Date Field Editor */}
        {currentSection.type === "date" && (
          <div className="flex gap-4">
            <Form.Item label="Date Format" className="flex-1">
              <select
                value={currentSection.dateFormat || "MMDDYYYY"}
                onChange={e => handleUpdateSection(currentSection.id, { dateFormat: e.target.value })}
                className="rounded-lg w-full border pl-2 py-1"
              >
                <option value="MMDDYYYY">MM/DD/YYYY</option>
                <option value="DDMMYYYY">DD/MM/YYYY</option>
                <option value="YYYYMMDD">YYYY/MM/DD</option>
                
              </select>
            </Form.Item>
            <Form.Item label="Separator" className="flex-1">
              <select
                value={currentSection.dateSeparator || "/"}
                onChange={e => handleUpdateSection(currentSection.id, { dateSeparator: e.target.value })}
                className="rounded-lg w-16 border pl-4 py-1"
              >
                <option value="/">/</option>
                <option value="-">-</option>
                <option value=".">.</option>
              </select>
            </Form.Item>
          </div>
        )}


      </Form>
    );
  };

  if (!landingPageData) return <Skeleton active />;     

  return (
    <div className="">
      <div className="w-full bg-gray-50_01">
        <div className="flex flex-col  pt-6 smx:pt-5 overflow-hidden ">
          <Header
            className="p-[20px] mdx:w-full mdx:p-5"
            landingPageData={landingPageData}
            setPublished={(e) => {
              CrudService.update("LandingPageData", lpId, {
                published: e,
              });
              setLandingPageData((d) => ({
                ...d,
                published: e,
              }));
              if (e) message.success("Funnel is live!");
            }}
          />
          <div className=" smx:pb-5">
            <div className="flex gap-4 justify-center items-start p-3 container-sm mdx:flex-col">
              <div className="w-full">
                <div className="flex rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 mdx:flex-col">
                  {/* Left Sidebar */}
                  <div className="flex flex-col items-center justify-between border-r border-solid border-blue_gray-50  pl-2 py-[10px] mdx:p-5 mdx:pb-5 smx:py-5 W-[140px] mdx:w-full group sidebar-transition" style={{ transition: 'width 0.3s', width: '100px' }}
                    onMouseEnter={e => e.currentTarget.style.width = '140px'}
                    onMouseLeave={e => e.currentTarget.style.width = '100px'}
                  >
                    <div className="flex flex-col items-center gap-[10px] w-full h-full">
                      <Heading
                        size="5xl"
                        as="h3"
                        className="!text-black-900_01 group-hover:!text-lg"
                      >
                        Questions
                      </Heading>
                      <BeautifulDragDropContext onDragEnd={handleDragEnd}>
                        <BeautifulDroppable droppableId="sections">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="w-full flex flex-col gap-4 max-h-[90vh] overflow-y-auto overflow-x-hidden p-1"
                            >
                              {/* Header (not draggable) */}
                              <div
                                className="flex items-center justify-start rounded-lg select-none cursor-pointer"
                                onClick={() => {
                                  setSelectedSection({ id: 'flexaligntop', type: 'header' });
                                  setIsEditingForm(true);
                                }}
                              >
                                <div className="flex-1 flex items-center group-hover:justify-start p-2">
                                  <img src="/images/img_flex_align_top.svg" alt="flexaligntop" className="w-5 h-5" />
                                </div>
                              </div>
                              {/* Draggable form sections */}
                              {formSections.map((section, index) => (
                                <BeautifulDraggable
                                  key={section.id}
                                  draggableId={section.id}
                                  index={index + 1} // +1 because header is at index 0
                                >
                                  {(provided, snapshot) => {
                                    const isActive = selectedSection?.id === section.id;
                                    const isDragging = snapshot.isDragging;
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={{
                                          ...provided.draggableProps.style,
                                          opacity: 1,
                                          width: '140px', // Match sidebar width
                                          ...(isDragging
                                            ? {
                                                padding: "8px",
                                                background: "#f5faff",
                                                borderRadius: "8px",
                                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                                                zIndex: 9999,
                                                height: "auto !important",
                                                minWidth: "40px",
                                                minHeight: "40px",
                                                overflow: "visible",
                                                border: "1.5px solid #e0e7ef",
                                              }
                                            : {}),
                                        }}
                                        className={`w-full flex items-center gap-0.5 p-2 rounded-lg cursor-pointer relative sidebar-item ${isActive ? "bg-gray-50" : ""} group${isDragging ? " dragging" : ""}`}
                                        onClick={() => {
                                          setSelectedSection(section);
                                          setIsEditingForm(false);
                                        }}
                                      >
                                        {/* Icon area only, no label */}
                                        <div className="flex-1 flex items-center justify-start group-hover:justify-start transition-all pr-2" style={{width: '140px'}}>
                                          <div className={isActive ? "bg-[#0E87FE] rounded-full p-1" : ""}>
                                            <img
                                              src={
                                                formItems.find(item => item.type === section.type)?.icon
                                                  ? `/icons/${formItems.find(item => item.type === section.type)?.icon}`
                                                  : "/images/default-icon.svg"
                                              }
                                              alt={`${section.type} icon`}
                                              className={`w-5 h-5 transition-all duration-200 ease-in-out ${isActive ? "brightness-0 invert" : ""}`}
                                            />
                                          </div>
                                        </div>
                                        {/* Action buttons area */}
                                        <div className={`flex gap-[0.9rem] items-center transition-all duration-300 absolute right-5 top-1/2 -translate-y-1/2 ${isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                          <div
                                            {...provided.dragHandleProps}
                                            className="py-1 rounded text-xs cursor-grab select-none"
                                            onClick={e => e.stopPropagation()}
                                            tabIndex={0}
                                            role="button"
                                            style={{ userSelect: 'none' }}
                                          >
                                            <FaGripVertical className="text-gray-600" />
                                          </div>
                                          <button
                                            onClick={e => {
                                              e.stopPropagation();
                                              handleRemoveSection(section.id);
                                            }}
                                            className="px-2 py-1 rounded text-xs hover:bg-red-200"
                                          >
                                            <img
                                              src="/images2/img_trash_01_red_700.svg"
                                              alt="trash-01"
                                              className="h-[20px] w-[20px] cursor-pointer"
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  }}
                                </BeautifulDraggable>
                              ))}
                              {provided.placeholder}
                              {/* Footer (not draggable) */}
                              <div
                                className="flex items-center  rounded-lg select-none mt-2 cursor-pointer"
                                onClick={() => {
                                  setSelectedSection({ id: 'flexalign', type: 'footer' });
                                  setIsEditingForm(false);
                                }}
                              >
                                <div className="flex-1 flex group-hover:justify-start items-center p-2">
                                  <img src="/images/img_flex_align.svg" alt="flexalign" className="w-5 h-5" />
                                </div>
                              </div>
                            </div>
                          )}
                        </BeautifulDroppable>
                      </BeautifulDragDropContext>
                    </div>
                    <img
                      src="/images/img_search.svg"
                      alt="search"
                      className="h-[20px] rounded-lg cursor-pointer mt-4"
                      onClick={() => setQuestionModal(true)}
                    />
                  </div>

                  {/* Middle Section */}
                  <div className="flex flex-col gap-3 border-r border-solid border-blue_gray-50 p-8 mdx:self-stretch mdx:p-5 justify-between w-[560px] h-[100vh] overflow-y-scroll ">
                    <div className="flex flex-col gap-[30px]">
                      <div className="flex gap-5 justify-between items-center">
                        <Heading
                          size="7xl"
                          as="h4"
                          className="!text-black-900_01"
                        >
                          {isEditingForm
                            ? "Customize your application form"
                            : `Edit ${selectedSection?.label || "field"}`}
                        </Heading>
                        <img
                          src="/images/img_arrow_right_blue_gray_400.svg"
                          alt="arrowright"
                          className="h-[24px] w-[24px] self-start cursor-pointer"
                          onClick={() => {
                            setSelectedSection(null);
                            setIsEditingForm(true);
                          }}
                        />
                      </div>

                      {isEditingForm ? (
                        <>
                          <EditorRender
                            lpId={lpId}
                            landingPageData={landingPageData?.form}
                            setLandingPageData={(e) => {
                              const newForm = e(landingPageData?.form);
                              setLandingPageData((prev) => ({
                                ...prev,
                                form: newForm,
                              }));
                            }}
                            items={[
                              {
                                key: "title",
                                label: "Title",
                                max: 100,
                                textarea: true,
                              },
                              {
                                key: "description",
                                label: "Description",
                                max: 150,
                              },
                            ]}
                            hideFooter
                          />
                          {/* Fields List Table */}
                          <div className="mt-8 pl-[1.5rem]">
                            <div className="grid grid-cols-3 gap-4 font-semibold text-gray-700 border-b pb-2 mb-2">
                              <div>Field</div>
                              <div>Visible</div>
                              <div>Required</div>
                            </div>
                            {formSections.map((section) => {
                              const formItem = formItems.find(item => item.type === section.type);
                              if (section.type === "contact") {
                                return [
                                  <div key={section.id + "-firstName"} className="grid grid-cols-3 gap-4 items-center py-2 border-b">
                                    <div className="flex items-center gap-2 text-[#656d79]">
                                      <span>First Name</span>
                                    </div>
                                    <div>
                                      <Switch
                                        checked={section.firstName?.visible}
                                        onChange={checked => handleUpdateSection(section.id, { firstName: { ...section.firstName, visible: checked } })}
                                        style={{backgroundColor: section.firstName?.visible ? '#0E87FE' : '#f2f4f7'}}
                                      />
                                    </div>
                                    <div>
                                      <Switch
                                        checked={section.firstName?.required}
                                        onChange={checked => handleUpdateSection(section.id, { firstName: { ...section.firstName, required: checked } })}
                                        style={{backgroundColor: section.firstName?.required ? '#0E87FE' : '#f2f4f7'}}
                                      />
                                    </div>
                                  </div>,
                                  <div key={section.id + "-lastName"} className="grid grid-cols-3 gap-4 items-center py-2 border-b last:border-b-0">
                                    <div className="flex items-center gap-2 text-[#656d79]">
                                      <span>Last Name</span>
                                    </div>
                                    <div>
                                      <Switch
                                        checked={section.lastName?.visible}
                                        onChange={checked => handleUpdateSection(section.id, { lastName: { ...section.lastName, visible: checked } })}
                                        style={{backgroundColor: section.lastName?.visible ? '#0E87FE' : '#f2f4f7'}}
                                      />
                                    </div>
                                    <div>
                                      <Switch
                                        checked={section.lastName?.required}
                                        onChange={checked => handleUpdateSection(section.id, { lastName: { ...section.lastName, required: checked } })}
                                        style={{backgroundColor: section.lastName?.required ? '#0E87FE' : '#f2f4f7'}}
                                      />
                                    </div>
                                  </div>
                                ];
                              }
                              return (
                                <div key={section.id} className="grid grid-cols-3 gap-4 items-center py-2 border-b last:border-b-0">
                                  <div className="flex items-center gap-2 text-[#656d79]">
                                    <span>{section.label || formItem?.text || section.type}</span>
                                  </div>
                                  <div>
                                    <Switch
                                      checked={section.visible}
                                      onChange={checked => handleUpdateSection(section.id, { visible: checked })}
                                      style={{backgroundColor: section.visible ? '#0E87FE' : '#f2f4f7'}}
                                    />
                                  </div>
                                  <div>
                                    <Switch
                                      checked={section.required}
                                      onChange={checked => handleUpdateSection(section.id, { required: checked })}
                                      style={{backgroundColor: section.required ? '#0E87FE' : '#f2f4f7'}}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        renderFieldEditor()
                      )}

                      <div className="h-px bg-blue_gray-50" />
                    </div>
                  </div>

                  <div
                    className="flex flex-1 flex-col gap-[10px] border-r border-solid border-blue_gray-50 px-[15px] pb-[3px] pt-[15px] mdx:w-full mdx:p-5"
                    style={fullscreen ? {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '125vw',
                      height: '125vh',
                      zIndex: 9999,
                      background: 'white',
                      overflow: 'auto',
                      padding: 32,
                      display: 'flex',
                      flexDirection: 'column',
                    } : { maxHeight: '125vh', overflow: 'auto' }}
                  >
                    <div className="flex gap-4 justify-between items-center mb-2">
                      <Heading
                        size="7xl"
                        as="h5"
                        className="!text-black-900_01"
                      >
                        Preview
                      </Heading>
                      {/* Centered Device Toggle */}
                      <div className="flex-1 flex justify-center">
                        <div className="flex p-1 rounded-lg">
                          <button
                            onClick={() => setDevice("mobile")}
                            className={`h-[24px]  px-2 rounded-md flex items-center justify-center font-medium transition ${
                              device === "mobile"
                                ? "bg-[#0E87FE] text-[#EFF8FF]"
                                : "text-[#0E87FE]"
                            }`}
                          >
                            Mobile
                          </button>
                          <button
                            onClick={() => setDevice("desktop")}
                            className={`h-[24px] px-2 rounded-md flex items-center justify-center font-medium transition ${
                              device === "desktop"
                                ? "bg-[#0E87FE] text-[#EFF8FF]"
                                : "text-[#0E87FE]"
                            }`}
                          >
                            Desktop
                          </button>
                        </div>
                      </div>
                      {/* Expand/Collapse Button */}
                      <button
                        className="h-[28px] w-[28px] flex items-center justify-center rounded hover:bg-gray-100"
                        onClick={() => setFullscreen(f => !f)}
                        style={{ marginLeft: 8 }}
                      >
                        <img
                          src="/images/expand-06.svg"
                          alt={fullscreen ? "collapse" : "expand"}
                          className="h-[20px] w-[20px]"
                        />
                      </button>
                    </div>
                    <div
                      className="flex flex-col items-start justify-center gap-[2px] mdx:pb"
                      style={
                        device === "mobile"
                          ? { width: 390, minHeight: 700, background: "white", margin: "0 auto", borderRadius: 12, boxShadow: "0 2px 12px #0001" }
                          : { width: "100%" }
                      }
                    >
                      {formSections.length > 0 ? (
                        <div className="w-full ">
                          <FormE
                            showFormEditor={false}
                            setShowFormEditor={() => {}}
                            landingPageData={landingPageData}
                            noModal
                            maxH="90vh"
                            onFieldUpdate={handleFieldUpdate}
                          />
                        </div>
                      ) : (
                        <div className="self-stretch py-6 smx:py-5">
                          <div className="flex flex-col gap-4 items-center">
                            <img
                              src="/images/img_illustration_empty_content.png"
                              alt="illustration"
                              className="h-[135px] w-[180px] object-cover"
                            />
                            <div className="flex flex-col items-center gap-[7px]">
                              <Heading
                                size="4xl"
                                as="h6"
                                className="!text-gray-900"
                              >
                                Please add questions
                              </Heading>
                              <Text
                                as="p"
                                className="!font-normal !text-blue_gray-500"
                              >
                                No data found, please select blocks.
                              </Text>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={questionModal}
        footer={null}
        onCancel={() => setQuestionModal(false)}
        closable={false}
        destroyOnClose
      >
        <ApplicationformAddQuestions
          onClickAdd={handleAddSection}
          onClose={() => setQuestionModal(false)}
          disabledTypes={formSections.map(section => section.type)}
        />
      </Modal>

      <style jsx>{`
        .hello-pangea-dnd-draggable {
          transition: transform 0.2s ease;
        }
        [data-rbd-draggable-context-id] {
          outline: none;
        }
      `}</style>
    </div>
  );
}
