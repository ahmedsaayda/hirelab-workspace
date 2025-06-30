import { Button, Popconfirm, Space, Tooltip, Modal } from "antd";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaGripVertical,
} from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { Trash2 } from "lucide-react";
import { Menu, MenuItem, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { brandColor } from "../../../../../../src/data/constants";
import { Heading, Img, Text } from "./..";
import { useHover } from "../../../../../../src/contexts/HoverContext";

// Custom Delete Confirmation Modal Component
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, sectionName }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closable={true}
      closeIcon={<span className="text-xl text-gray-500">&times;</span>}
      width={500}
      centered
      className="custom-delete-modal"
    >
      <div className="px-2 py-4">
        <Heading size="4xl" as="h1" className="mb-4 text-center">
          Delete
        </Heading>

        <Text as="p" className="mb-6 text-center">
          Are you sure you want to delete section <strong>{sectionName}</strong>
          ? This action cannot be undone.
        </Text>

        <div className="flex gap-4">
          <Button onClick={onClose} className="flex-1 h-10 rounded-md border">
            Back
          </Button>

          <Button
            onClick={onConfirm}
            className="flex-1 h-10 text-white bg-blue-600 rounded-md border !hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const menuItems = {
  flexaligntop: "/images/img_flex_align_top.svg",
  "form-editor": "/images/Frame (39).svg",
  buttonbase: "/images/img_button_base.svg",
  userone: "/images/img_user_01_blue_gray_500_01.svg",
  messagechat: "/images/img_message_chat_circle.svg",
  calendar: "/images/img_calendar.svg",
  briefcaseone: "/images/img_briefcase_01.svg",
  editfour: "/images/img_edit_04.svg",
  search: "/images/img_search.svg",
  flexalign: "/images/img_flex_align.svg",

  "Employee Testimonials": "/images/img_button_base.svg",
  "Company Facts": "/icons2/zap.svg",
  "Recruiter Contact": "/images/img_message_chat_circle.svg",
  "Leader Introduction": "/images/img_user_01_blue_gray_500_01.svg",
  Agenda: "/images/img_calendar.svg",
  "Job Specifications": "/images/img_briefcase_01.svg",
  "Job Description": "/images/img_edit_04.svg",
  "About The Company": "/icons2/intersect-circle.svg",
  "Growth Path": "/images/trend-up-01.svg",
  Video: "/images/video-recorder.svg",
  "Image Carousel": "/images/image-01.svg",
  "Text Box": "/images/type-square.svg",
  "Meet CEO": "/images/lets-icons_lamp.svg",
  "Candidate Process": "/icons2/list.svg",
  "EVP / Mission": "/images/lets-icons_lamp.svg",
};

// Map section keys to display names
const sectionDisplayNames = {
  flexaligntop: "Hero Section",
  search: "Footer",
  flexalign: "Footer",
  "form-editor": "Form Editor",
  // For other keys, use the key itself as the display name
};
export const sectionMap = {
  "About The Company": "about-company",
  "Leader Introduction": "leader-introduction",
  "Employee Testimonials": "employer-testimonial",
  "Company Facts": "company-facts",
  "Recruiter Contact": "recruiter-contact",
  "Job Description": "job-description",
  "Job Specifications": "job-specifications",
  "Growth Path": "growth-path",
  Video: "video",
  Agenda: "agenda",
  "Candidate Process": "candidate-process",
  "EVP / Mission": "evp-mission",
  "Text Box": "text-box",
  "Meet CEO": "meet-ceo",
  "Image Carousel": "image-carousel",
};

export default function Sidebar17({
  items,
  removeSection,
  handleUp,
  handleDown,
  activeIdx = -1,
  onReorder,
  ...props
}) {
  const [draggingIdx, setDraggingIdx] = useState(null);
  const { setScrollToSection,setLastScrollToSection } = useHover();
  const [isHovered, setIsHovered] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const allItems = [
      { key: "flexaligntop" },
      ...items,
      { key: "flexalign" },
      { key: "search" },
    ];

    const newAllItems = Array.from(allItems);
    const [reorderedItem] = newAllItems.splice(result.source.index, 1);
    newAllItems.splice(result.destination.index, 0, reorderedItem);

    // Filter out the fixed items to get the new order of draggable items
    const newItems = newAllItems.filter(
      (item) =>
        !["flexaligntop", "form-editor", "search", "flexalign"].includes(
          item.key
        )
    );

    onReorder(newItems);
    setDraggingIdx(null);
  };

  const handleSectionClick = (key) => {
    
    console.log("key", key);
    //hero-section ,
    if (key === "flexaligntop") {
      setScrollToSection("hero-section");
    }
    if (key === "search") {
      setScrollToSection("");
    }
    // footer
    if (key === "flexalign") {
      setScrollToSection("footer");
    }
    // Map section keys to scroll section names

    const section = sectionMap[key];
    console.log("section", section)
    if (section) {
      setScrollToSection(section);
    }
  };

  // Get display name for a section
  const getSectionDisplayName = (key) => {
    return sectionDisplayNames[key] || key;
  };

  const handleDeleteClick = (e, idx, key) => {
    e.preventDefault();
    e.stopPropagation();
    setSectionToDelete({ idx, name: getSectionDisplayName(key) });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sectionToDelete) {
      removeSection(sectionToDelete.idx);
      setDeleteModalOpen(false);
      setSectionToDelete(null);
    }
  };

  const allItems = [
    { key: "flexaligntop" },
    ...items,
    { key: "flexalign" },
    { key: "search" },
  ];

  return (
    <>
      <Sidebar
        {...props}
        width="80px !important"
        height="100%"
        collapsedWidth="60px !important"
        rootStyles={{
          transition: "width 0.3s ease",
          paddingBlock: "4px !important",
          paddingInline: "0px !important",
          background: "transparent !important",
        }}
        className={`${props.className} flex-shrink-0 min-w-[80px] flex flex-col justify-center items-left gap-[30px] top-0 border-blue_gray-50 border-r border-solid bg-transparent !sticky overflow-auto hover:!w-[120px]`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: "transparent !important",
        }}
      >
        <Heading
          size="2xl"
          as="h5"
          className="!text-black-900_01 text-left pl-2"
        >
          Sections
        </Heading>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <Menu
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  background: "transparent",
                }}
                menuItemStyles={{
                  button: {
                    padding: "11px",
                    borderRadius: "8px",
                    [`&:hover`]: { backgroundColor: "#eff8ff !important" },
                  },
                }}
                rootStyles={{ ["&>ul"]: { gap: "8px" } }}
                className="flex flex-col w-full !bg-transparent"
              >
                {allItems.map((item, idx) => (
                  <Draggable
                    key={item.key}
                    draggableId={item.key}
                    index={idx}
                    isDragDisabled={[
                      "flexaligntop",
                      "flexalign",
                      "search",
                    ].includes(item.key)}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: 1,
                          ...(snapshot.isDragging
                            ? {
                                padding: "8px",
                                background: "#ffffff",
                                borderRadius: "8px",
                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                                zIndex: 9999,
                                height: "auto !important",
                                width: "auto !important",
                                minWidth: "40px",
                                minHeight: "40px",
                                overflow: "visible",
                              }
                            : {}),
                        }}
                        className={snapshot.isDragging ? "dragging" : ""}
                      >
                        <MenuItem
                          className={`${
                            idx === activeIdx ? "active" : ""
                          } relative`}
                          onClick={() => {
                            if (props.onClickAdd)
                              props.onClickAdd(item.key, idx);
                            //setLastScrollToSection(""); and delay 2ms before calling handleSectionClick
                            // setLastScrollToSection(null);
                            // setTimeout(() => {
                            //   handleSectionClick(item.key);
                            // }, 2);
                            handleSectionClick(item.key);
                          }}
                        >
                          <div className="flex flex-shrink-0 gap-2 items-center"
                          onClick={()=>{
                            setLastScrollToSection(null);
                          }}
                          >
                            <Tooltip
                              title={getSectionDisplayName(item.key)}
                              placement="right"
                              className="flex-shrink-0"
                            >
                              <div
                                className="p-2 rounded-full transition-all focus:ring-2 focus:ring-blue-500"
                                style={
                                  activeIdx === idx
                                    ? {
                                        background: brandColor,
                                        opacity: 0.6,
                                      }
                                    : {}
                                }
                              >
                                <Img
                                  src={menuItems?.[item.key]}
                                  alt={item.key}
                                  className="h-[16px] w-[16px] transition-all"
                                  style={
                                    activeIdx === idx
                                      ? {
                                          filter: "brightness(0) invert(1)",
                                        }
                                      : {}
                                  }
                                />
                              </div>
                            </Tooltip>

                            {/* Always render the drag handle div, but control visibility with CSS */}
                            {!["flexaligntop", "flexalign", "search"].includes(
                              item.key
                            ) && (
                              <div
                                className={`flex gap-1 items-center transition-all duration-300 ${
                                  isHovered ? "opacity-100" : "opacity-0"
                                }`}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing"
                                >
                                  <FaGripVertical
                                    className="text-gray-400 hover:text-gray-600"
                                    size={14}
                                  />
                                </div>
                                <Img
                                  src="/images2/img_trash_01_red_700.svg"
                                  alt="trash-01"
                                  className="h-[18px] w-[18px] cursor-pointer ml-auto"
                                  onClick={(e) =>
                                    handleDeleteClick(e, idx, item.key)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </MenuItem>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Menu>
            )}
          </Droppable>
        </DragDropContext>
      </Sidebar>

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        sectionName={sectionToDelete?.name}
      />

      <style jsx>{`
        .dragging {
          cursor: grabbing !important;
        }

        /* Fix for react-beautiful-dnd clipping issues */
        .react-beautiful-dnd-draggable {
          overflow: visible !important;
        }

        /* This helps ensure the draggable content remains visible */
        [data-rbd-draggable-context-id] {
          overflow: visible !important;
        }

        /* Target the actual draggable ghost element */
        [data-rbd-drag-placeholder] {
          opacity: 0 !important;
        }
      `}</style>
    </>
  );
}
