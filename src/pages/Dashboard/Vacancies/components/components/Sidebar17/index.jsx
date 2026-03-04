import { Button, Popconfirm, Space, Tooltip, Modal } from "antd";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaGripVertical,
} from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Menu, MenuItem } from "react-pro-sidebar";
import { brandColor, currencies } from "../../../../../../data/constants";
import { Heading, Img, Text } from "..";
import { useHover } from "../../../../../../contexts/HoverContext";

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
  "Linked Jobs": "/images/img_briefcase_01.svg",
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
  "About The Company": "about-the-company",  // Fixed: was "about-company"
  "Leader Introduction": "leader-introduction",
  "Employee Testimonials": "employee-testimonials",  // Fixed: was "employer-testimonial"
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
  "Linked Jobs": "linked-jobs",
};

// Helper to extract base key from duplicate section keys (e.g., "Text Box_2" -> "Text Box")
const getBaseKey = (key) => {
  if (!key) return key;
  const match = key.match(/^(.+?)_\d+$/);
  return match ? match[1] : key;
};

// Get icon for a section key (handles duplicate sections)
const getMenuItemIcon = (key) => {
  const baseKey = getBaseKey(key);
  return menuItems[baseKey] || menuItems[key];
};

export default function Sidebar17({
  items,
  removeSection,
  handleUp,
  handleDown,
  activeKey,
  activeIdx = -1,
  onReorder,
  onSectionVisibilityUpdate,
  ...props
}) {
  const [draggingIdx, setDraggingIdx] = useState(null);
  const { setScrollToSection, setLastScrollToSection } = useHover();
  const [isHovered, setIsHovered] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const scrollRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const up = el.scrollTop > 0;
    const down = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    setCanScrollUp(up);
    setCanScrollDown(down);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollArrows();
    const ro = new ResizeObserver(updateScrollArrows);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollArrows, items.length]);

  const handleScroll = useCallback(() => {
    updateScrollArrows();
  }, [updateScrollArrows]);

  const scrollBy = useCallback((delta) => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ top: delta, behavior: "smooth" });
      setTimeout(updateScrollArrows, 150);
    }
  }, [updateScrollArrows]);

  const handleWheel = useCallback((e) => {
    const el = scrollRef.current;
    if (!el || el.scrollHeight <= el.clientHeight) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const canScrollUp = scrollTop > 0;
    const canScrollDown = scrollTop + clientHeight < scrollHeight;
    const scrollingDown = e.deltaY > 0;
    const scrollingUp = e.deltaY < 0;
    if ((scrollingDown && canScrollDown) || (scrollingUp && canScrollUp)) {
      e.preventDefault();
      el.scrollTop += e.deltaY;
    }
  }, []);

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
    console.log("key!!", key);
    console.log("key", key);

    // Call the parent's setActiveKey function
    if (props.setActiveKey) {
      props.setActiveKey(key);
    }

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
    // Map section keys to scroll section names (use base key for duplicate sections)
    const baseKey = getBaseKey(key);
    const section = sectionMap[baseKey] || sectionMap[key];
    console.log("section!!", section)
    if (section) {
      setScrollToSection(section);
    }
  };

  // Get display name for a section (handles duplicate sections like "Text Box_2")
  const getSectionDisplayName = (key) => {
    const baseKey = getBaseKey(key);
    // Check if it's a duplicate section
    const match = key.match(/^(.+?)_(\d+)$/);
    if (match) {
      const baseName = sectionDisplayNames[baseKey] || baseKey;
      return `${baseName} ${match[2]}`;
    }
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
      <div
        {...props}
        className={`${props.className ?? ""} flex-shrink-0 min-w-[90px] w-[90px] flex flex-col gap-3 top-0 border-blue_gray-50 border-r border-solid bg-transparent sticky overflow-hidden transition-[width] duration-300 ${isHovered ? "!w-[140px]" : ""}`}
        style={{
          height: "calc(100vh - 110px)",
          maxHeight: "calc(100vh - 110px)",
          padding: "4px 0 4px 4px",
          background: "transparent",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Heading
          size="2xl"
          as="h5"
          className="!text-[#000000]_01 text-left pl-2 flex-shrink-0"
        >
          Sections
        </Heading>
        <div className="flex-1 min-h-0 relative flex flex-col">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={(el) => {
                    scrollRef.current = el;
                    if (provided.innerRef) {
                      if (typeof provided.innerRef === "function") {
                        provided.innerRef(el);
                      } else {
                        provided.innerRef.current = el;
                      }
                    }
                  }}
                  className="sidebar-scroll pr-1 flex flex-col gap-2 w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
                  onScroll={handleScroll}
                  onWheel={handleWheel}
                >
                <Menu
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
                  className="flex flex-col w-full !bg-transparent !flex-none"
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
                            className={`${item.key === activeKey ? "active" : ""
                              } relative`}
                            onClick={() => {
                              if (props.onClickAdd)
                                props.onClickAdd(item.key, idx);
                              handleSectionClick(item.key);
                            }}
                          >
                            <div className="flex flex-shrink-0 gap-2 items-center"
                              onClick={() => {
                                setLastScrollToSection(null);
                              }}
                            >
                              <Tooltip
                                title={getSectionDisplayName(item.key)}
                                placement="bottom"
                                mouseEnterDelay={0.5}
                                mouseLeaveDelay={0.1}
                                className="flex-shrink-0"
                              >
                                <div
                                  className="p-2 rounded-full transition-all focus:ring-2 focus:ring-blue-500"
                                  style={
                                    item.key === activeKey
                                      ? {
                                        background: brandColor,
                                        opacity: 0.6,
                                      }
                                      : {}
                                  }
                                >
                                  <Img
                                    src={getMenuItemIcon(item.key)}
                                    alt={item.key}
                                    className="h-[16px] w-[16px] transition-all"
                                    style={
                                      item.key === activeKey
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
                                  className={`flex gap-1 items-center transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"
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
                                  {/* Visibility Toggle */}
                                  {onSectionVisibilityUpdate && (
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onSectionVisibilityUpdate(item.key, !(item.visible !== false));
                                      }}
                                      className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
                                      title={`${item.visible !== false ? 'Hide' : 'Show'} section for end users`}
                                    >
                                      {item.visible !== false ? (
                                        <svg className="w-4 h-4 text-gray-600 hover:text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                      )}
                                    </div>
                                  )}
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
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {/* Scroll arrows - only visible when scrollable */}
          {canScrollUp && (
            <button
              type="button"
              onClick={() => scrollBy(-120)}
              className="sidebar-scroll-arrow sidebar-scroll-arrow-up"
              aria-label="Scroll up"
            >
              <ChevronUp size={14} strokeWidth={2.5} />
            </button>
          )}
          {canScrollDown && (
            <button
              type="button"
              onClick={() => scrollBy(120)}
              className="sidebar-scroll-arrow sidebar-scroll-arrow-down"
              aria-label="Scroll down"
            >
              <ChevronDown size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

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

        .sidebar-scroll {
          flex: 1 1 0;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .sidebar-scroll::-webkit-scrollbar {
          display: none;
        }
        .sidebar-scroll-arrow {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 50%;
          background: rgba(241, 245, 249, 0.9);
          color: rgba(100, 116, 139, 0.7);
          cursor: pointer;
          z-index: 5;
          transition: background 0.15s, color 0.15s;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        }
        .sidebar-scroll-arrow:hover {
          background: rgba(226, 232, 240, 0.95);
          color: rgba(71, 85, 105, 0.9);
        }
        .sidebar-scroll-arrow-up {
          top: 4px;
        }
        .sidebar-scroll-arrow-down {
          bottom: 4px;
        }

        /* Fix for @hello-pangea/dnd clipping issues */
        .hello-pangea-dnd-draggable {
          overflow: visible !important;
        }
        [data-rbd-draggable-context-id] {
          overflow: visible !important;
        }
        [data-rbd-drag-placeholder] {
          opacity: 0 !important;
        }
      `}</style>
    </>
  );
}
