import React, { useEffect } from "react";
import { useState, useMemo } from "react";
import {
  Input,
  Button,
  Modal,
  Upload,
  Tag,
  Menu,
  Checkbox,
  Select,
  message,
  Tabs,
  notification,
  Pagination,
  Dropdown
} from "antd";
// hirelab-frontend\src\pages\Dashboard\Vacancies\index.jsx
// hirelab-frontend\src\components\mediaLibrary\index.jsx
import { FaSortAmountDownAlt } from "react-icons/fa";
// import { Button, Heading } from "..."; const Button = () => null; const Heading = () => null;
import MediaFilterMedia, { FilterTags } from "./components/modals/MediaFilterMedia.jsx";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  DownloadOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { MediaCard } from "./components/media-card.jsx";
import { SelectionHeader } from "./components/selection-header.jsx";
import { AppliedFilters } from "./components/applied-filters.jsx";
import { SearchBar } from "./components/search-bar.jsx";
import { FiltersSection } from "./components/filters-section.jsx";
import { FiltersBar } from "./components/filters-bar.jsx";
import { EditMediaModal } from "./components/modals/edit-media-modal.jsx";
import EditMediaModalNew from "./ImageModal/EditMediaModal.jsx";
import { AddMediaModal } from "./components/modals/add-media-modal.jsx";
import { SelectTemplateModal } from "./components/modals/select-template-modal.jsx";
import { FilterModal } from "./components/modals/filter-modal.jsx";
import { BulkEditModal } from "./components/modals/bulk-edit-modal.jsx";
import TabPane from "antd/es/tabs/TabPane";
import CrudService from "../../../../../services/CrudService.js";
import { MdEMobiledata } from "react-icons/md";
import SkeletonLoader from "../Skeleton/VacancyCard.js";
import { ArrowUpDown } from 'lucide-react';
// import {Draggable} from 'react-drag-reorder';
import debounce from "lodash/debounce";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, MoveDown, MoveUp, Trash2 } from "lucide-react";


import { selectUser } from "../../../../../redux/auth/selectors.js";
import { useSelector } from "react-redux";
import { getMediaDataFromTemplate } from "./utils/templateTransformers.js";
// import FilterModalVacancy from "..."; const FilterModalVacancy = () => null;


const smartTags = ["New York", "Finance", "Controller", "London", "Office"];




const TestimonialReorder = ({ testimonials, onReorder }) => {
  const [items, setItems] = useState(testimonials);

  useEffect(() => {
    setItems(testimonials);
  }, [testimonials]);

  // Handle drag & drop of avatars only
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const newItems = items.map((item) => ({ ...item }));
    [newItems[sourceIndex].avatar, newItems[destinationIndex].avatar] =
      [newItems[destinationIndex].avatar, newItems[sourceIndex].avatar];

    setItems(newItems);
    onReorder(newItems);
  };

  // Move avatar manually using buttons
  const moveAvatar = (index, direction) => {
    const newItems = items.map((item) => ({ ...item }));
    const targetIndex = direction === "up"
      ? (index === 0 ? newItems.length - 1 : index - 1)
      : (index === newItems.length - 1 ? 0 : index + 1);

    [newItems[index].avatar, newItems[targetIndex].avatar] =
      [newItems[targetIndex].avatar, newItems[index].avatar];

    setItems(newItems);
    onReorder(newItems);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Swap Testimonial Images</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="testimonials-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
              {items.map((testimonial, index) => (
                <div key={testimonial._id} className="bg-white border rounded-lg p-4 shadow-sm flex items-center gap-4">
                  {/* Drag Handle for Avatar Only */}
                  <Draggable draggableId={testimonial._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative group cursor-grab transition-all ${snapshot.isDragging ? "ring-2 ring-blue-500 bg-blue-50" : ""
                          }`}
                      >
                        {/* <img
                          src={testimonial.avatar || "/placeholder.png"}
                          className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 transition-all"
                          alt={testimonial.fullname}
                        /> */}
                        <img
                          alt="testimonialAvatar"
                          src={testimonial.avatar || "/placeholder.png"}
                          className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 
                                        transition-all group-hover:brightness-75"
                        />
                        <div
                          {...provided.dragHandleProps}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all"
                        >
                          <GripVertical className="text-white opacity-0 group-hover:opacity-100" size={20} />
                        </div>
                      </div>
                    )}
                  </Draggable>

                  {/* Testimonial Details */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-gray-800">{testimonial.fullname || "Anonymous"}</h3>
                    {testimonial.role && <p className="text-gray-600 text-sm">{testimonial.role}</p>}
                    <p className="mt-2 text-gray-700 line-clamp-2">
                      {testimonial?.comment?.length > 40 ? `${testimonial.comment.slice(0, 40)}...` : testimonial.comment}
                    </p>
                  </div>

                  {/* Move Avatar Up/Down Buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      title={"move up"}
                      onClick={() => moveAvatar(index, "up")}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    >
                      <MoveUp size={20} />
                    </button>
                    <button
                      title={"Move Down"}
                      onClick={() => moveAvatar(index, "down")}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    >
                      <MoveDown size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};




export default function MyMediaLibrary({ isAddSectionButtonVisible, getSelectedMedia, activeSection, setIsMediaLiOpen, mediaLimits, landingPageData, ImageModal ,allowedTabs =["all","image","video"]}) {
  console.log("activeSection", activeSection);
  const user = useSelector(selectUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [sorters, setSorters] = useState([]);
  const [activeSorter, setActiveSorter] = useState({ key: '', direction: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [closeMediaModalOpenSectionTemplate, setCloseMediaModalOpenSectionTemplate] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMultipleModalOpen, setIsAddMultipleModalOpen] = useState(false);
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
    useState(false);
  const [editItem, setEditItem] = useState(null);
  const hasLimits = activeSection && mediaLimits[activeSection];
  const [currentSectionLimits, setCurrentLimits] = useState(
    hasLimits ? mediaLimits[activeSection] : {}
  );

  const [selectedMedia, setSelectedMedia] = useState(null)

  const [renameModal, setRenameModal] = useState(false);
  const [isReorderImage, setIsReorderImage] = useState(false);
  const [orderedTestimonials, setOrderedTestimonials] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);

  const [mediaData, setMediaData] = useState([]);
  // const [filters, setFilters] = useState({ tags: [], sectionName: [] });
  const [filters, setFilters] = useState({});

  const [isMediaFilterOpen, setIsMediaFilterOpen] = useState(false);

  const [allMediaData, setAllMediaData] = useState([]);

  const [selectedTab, setSelectedTab] = useState(() => {
      if (ImageModal) return "2";                      // image section
      return "1";                                     // all section (default)
    });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProgrammaticTabChange, setIsProgrammaticTabChange] = useState(false);

  const isSortActive = activeSorter.key !== '' && activeSorter.direction !== '';



  // filter options 
  const filterOptions = {
    tags: [
      "New York", "Finance", "Controller", "Los Angeles", "Product",
      "Launch", "Chicago", "HR", "Event", "development"
    ],
    sectionName: [
      "Hero Section", "Leader Introduction", "Job Description", "Company Facts",
      "Recruiter Contact", "Candidate Process", "Image Carousel", "Video",
      "About The Company", "Job Specifications", "Agenda", "EVP /Mission",
      "Growth Path", "Text Box", "testimonial"
    ],
  };

 const sorterOptions = [
  { key: "createdAt", label: "Newest First", direction: "desc" },
  { key: "createdAt", label: "Oldest First", direction: "asc" },
  { key: "type", label: "Type (A-Z)", direction: "asc" },
  { key: "type", label: "Type (Z-A)", direction: "desc" },
  { key: "size", label: "Size (Largest First)", direction: "desc" },
  { key: "size", label: "Size (Smallest First)", direction: "asc" },
  { key: "resolution", label: "Resolution (High to Low)", direction: "desc" },
  { key: "title", label: "Title (A-Z)", direction: "asc" },
  { key: "title", label: "Title (Z-A)", direction: "desc" },
  { key: "updatedAt", label: "Recently Updated", direction: "desc" },
];


  useEffect(() => {
    if (closeMediaModalOpenSectionTemplate) {
      setIsCreateTemplateModalOpen(true);
      setCloseMediaModalOpenSectionTemplate(false); // reset flag so it can be triggered again
    }
  }, [closeMediaModalOpenSectionTemplate]);





  useEffect(() => {
    if (!activeSection || !mediaLimits) return;

   

  }, [activeSection, mediaLimits, allMediaData, searchValue, selectedTab]);



  const fetchMediaData = debounce(async ({
    user,
    searchValue,
    filters,
    sorters,
    activeSorter,
    currentPage,
    itemsPerPage,
  }) => {
    setLoading(true); // Start loading before fetching data
    try {

      const baseFilters = {
        user_id: user._id,
        ...filters,
      };

      // Only add media type filter if not on "All"
      if (selectedTab === '2') {
        baseFilters.type = 'image';
      } else if (selectedTab === '3') {
        baseFilters.type = 'video';
      }

      
    // Ensure activeSorter has a default value if empty
    const activeSorterKey = activeSorter && activeSorter.key || '';
    const activeSorterDirection = activeSorter && activeSorter.direction || '';

      const result = await CrudService.search("MediaLibrary", itemsPerPage, currentPage, {
        text: searchValue,
        user,
        filters: baseFilters,

          sort: activeSorterKey && activeSorterDirection ? { [activeSorterKey]: activeSorterDirection } : {},  // Add empty object if no sorter
      });

      
      setMediaData(result?.data?.items);
      setAllMediaData(result?.data?.items);
      setTotalItems(result.data.total);
      // Process tags (if necessary)
      const tagsSet = new Set();
      result?.data?.items?.forEach((item) => {
        if (item.tags) {
          if (Array.isArray(item.tags)) {
            item.tags.forEach((tag) => tagsSet.add(tag?.trim?.()));
          } else if (typeof item.tags === "string") {
            tagsSet.add(item.tags.trim());
          }
        }
      });

      const uniqueTags = Array.from(tagsSet)
        .filter((tag) => typeof tag === "string" && tag?.trim?.() !== "")
        .sort();

      // setMediaTagsOptions(uniqueTags); // Use this if you have a dropdown or options for tags
    } catch (error) {
      console.error("Error fetching media library:", error);
    } finally {
      setLoading(false); // Set loading to false after the fetch is done
    }
  }, 800);

  // useEffect(() => {
  //   fetchMediaData({user, searchValue, filters:{...filters}, currentPage ,itemsPerPage});
  // }, []);

  useEffect(() => {
    fetchMediaData({
      user,
      searchValue,
      filters,
      sorters,
      activeSorter,
      currentPage,
      itemsPerPage,
    });
  }, [user, searchValue, filters, sorters, currentPage, itemsPerPage, selectedTab,activeSorter,]); // Trigger when any of these change

  useEffect(() => {
    if (mediaLimits) {

      setCurrentLimits(mediaLimits[activeSection] || {});
    }
    setSelectedItems([]);
  }, [activeSection, mediaLimits]);



  const handleItemSelect = (id) => {
    const item = mediaData.find(itm => itm._id === id);
    if (!item) return;

    // Toggle selection
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      return;
    }

    // No special selection rules needed for images and videos

    // Enforce limits based on mediaType
    if (activeSection && currentSectionLimits) {
      const mediaType = currentSectionLimits.mediaType;
      const limit = mediaType === 'image' ? currentSectionLimits.images :
        mediaType === 'video' ? currentSectionLimits.videos :
          Infinity;

      // Count selected items of current media type
      const currentCount = selectedItems.filter(selectedId => {
        const selectedItem = mediaData.find(itm => itm._id === selectedId);
        return selectedItem && selectedItem.type === mediaType;
      }).length;
      // alert("limit" + limit)

      if (currentCount >= limit) {
        if (selectedTab === '4') return;
        const messageContent = limit > 0
          ? `You can select maximum ${limit} ${mediaType}${limit > 1 ? 's' : ''} for this section.`
          : `No ${mediaType}s can be selected for this section.`;

        message.open({
          type: 'warning',
          content: messageContent,
          duration: 3,
        });
        return;
      }
    }

    setSelectedItems(prev => [...prev, id]);
  };


  const handleEditItem = async (id, updatedData) => {

    if (updatedData) {
      // Handle template update
      try {
        if (!user || !user._id) {
          throw new Error('User not authenticated');

        }
        const existingItem = mediaData.find((media) => media._id.toString() === id);

        if (existingItem) {
          const updatedSectionData = getMediaDataFromTemplate(updatedData, user._id, existingItem);
          const { _id, user_id, createdAt, updatedAt, __v, ...cleanedPayload } = updatedSectionData;

          const response = await CrudService.update("MediaLibrary", id, cleanedPayload);

          // if (response.data) {
          // message.success(`${updatedData.type.charAt(0).toUpperCase() + updatedData.type.slice(1)} template updated successfully`);
          /*
              user,
  searchValue,
  filters,
  sorters,
  currentPage,
  itemsPerPage,
           */
          fetchMediaData({ user, searchValue, filters: { ...filters }, sorters,      activeSorter, currentPage, itemsPerPage });
          message.success(`Template updated successfully`);
          // }
        }
      } catch (error) {
        console.error("Template update error:", error);
        message.error(`Failed to update template: ${error.message}`);
      }
    } else {
      // Regular edit flow - open modal
      const item = mediaData.find((media) => media._id === id) || null;
      setEditItem(item);
      setIsEditModalOpen(true);
    }
  };


  const onRename = (id) => {
    const item = mediaData.find((media) => {
      return media && media._id && media._id.toString() === id; // Convert _id to a string for comparison
    }) || null;

    setSelectedMedia(item);
    setRenameModal(true);
  };

  const handleRename = async (updatedData) => {
    if (!selectedMedia) return;
    
    try {
      const { _id } = selectedMedia;
      await CrudService.update("MediaLibrary", _id, updatedData);
      message.success("Media updated successfully");
      setMediaData((prevData) =>
        prevData.map((media) =>
          media._id === _id ? { ...media, ...updatedData } : media
        )
      );
      setRenameModal(false);
      setSelectedMedia(null);
      // Refresh the data
      fetchMediaData({
        user,
        searchValue,
        filters,
        sorters,
        activeSorter,
        currentPage,
        itemsPerPage,
      });
    } catch (error) {
      console.error("Error updating media:", error);
      message.error("Failed to update media. Please try again.");
    }
  };


  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this media item? This action cannot be undone.");

    if (isConfirmed) {
      try {
        await CrudService.delete("MediaLibrary", id);
        setMediaData((prevData) => prevData.filter((media) => media._id !== id));
        message.success("Media item deleted successfully!");
      } catch (error) {
        console.error("Error deleting media item:", error);
        message.error("Failed to delete media item. Please try again.");
      }
    }
  };

  const handleBulkDelete = async () => {
    Modal.confirm({
      title: 'Delete Media',
      content: `Are you sure you want to delete ${selectedItems.length} media item${selectedItems.length !== 1 ? 's' : ''}? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          console.log('🗑️ Bulk deleting media items:', selectedItems);
          
          // Delete all selected items in parallel
          const deletePromises = selectedItems.map(itemId => 
            CrudService.delete('MediaLibrary', itemId)
          );
          
          await Promise.all(deletePromises);
          
          // Update local state
          setMediaData((prevData) => prevData.filter((media) => !selectedItems.includes(media._id)));
          
          message.success(`Successfully deleted ${selectedItems.length} media item${selectedItems.length !== 1 ? 's' : ''}`);
          
          // Clear selection
          setSelectedItems([]);
          
          // Refresh the data
          fetchMediaData({
            user,
            searchValue,
            filters,
            sorters,
            activeSorter,
            currentPage,
            itemsPerPage,
          });
          
        } catch (error) {
          console.error('❌ Error bulk deleting media items:', error);
          message.error('Failed to delete some media items. Please try again.');
        }
      }
    });
  };




  const handleCreateTemplate = () => {
    setIsCreateTemplateModalOpen(true);
  };

  const handleSelectAll = () => {
    const allIds = mediaData.map((item) => item._id);
    setSelectedItems(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleUseSelected = () => {
    // Filter the mediaData to return only items whose _id is in selectedItems
    let selectedMediaItems;

    if (activeSection === "Employee Testimonials") {
      selectedMediaItems = orderedTestimonials
    } else {
      selectedMediaItems = mediaData.filter((item) =>
        selectedItems.includes(item._id)
      );
    }
    getSelectedMedia(selectedMediaItems);
    setIsMediaLiOpen(false)
  };



  useEffect(() => {
    if (!landingPageData?.testimonials || !mediaData) return;

    // Find all testimonials
    const allTestimonials = landingPageData.testimonials;

    // Find testimonials that need images
    const testimonialsNeedingImages = allTestimonials.filter(
      (t) => !t.avatar || t.avatar === "/dhwise-images/placeholder.png"
    );

    // Get selected images from mediaData
    const selectedImages = mediaData.filter((m) => selectedItems.includes(m._id));


    // Map only missing testimonials to selected images
    const updatedTestimonials = testimonialsNeedingImages.map((testimonial, index) => ({
      ...testimonial,
      avatar: selectedImages[index]?.thumbnail || "/dhwise-images/placeholder.png", // Assign selected image or keep placeholder
    }));

    // Merge updated testimonials with the rest, ensuring all are retained
    const mergedTestimonials = allTestimonials.map((testimonial) => {
      const updatedTestimonial = updatedTestimonials.find((ut) => ut._id === testimonial._id);
      return updatedTestimonial ? updatedTestimonial : testimonial;
    });

    // Update state with all testimonials (old + updated ones)
    setOrderedTestimonials(mergedTestimonials);

  }, [landingPageData?.testimonials, mediaData, selectedItems]);


  // Function to show modal
  const showModal = () => {
    setIsReorderImage(true);
  };

  // Function to hide modal
  const handleCancel = () => {
    setIsReorderImage(false);
  };
  const handleAdd = () => {
    setIsReorderImage(false)
  }


  const handleSave = (newOrder) => {
    setOrderedTestimonials(newOrder);
  };

  // SEARCH FUNCTIONALITY 
  const handleSearch = (value) => {
    setSearchValue(value);
  };


  const handleApplyMediaFilters = (selectedFilters) => {
    setFilters(selectedFilters);
    setIsMediaFilterOpen(false);
  };

  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.filter(Boolean).length;
    } else if (value) {
      return count + 1;
    }
    return count;
  }, 0);




  // Fix 2: Modify handleTabChange
  const handleTabChange = (key) => {
    // Only update media data if change is user-initiated
    if (!isProgrammaticTabChange) {
      const onlyImages = allMediaData.filter(item => item.type === 'image');
      const onlyVideos = allMediaData.filter(item => item.type === 'video');

      if (key === '1') {
        setMediaData(filterWithSearch(allMediaData));
      } else if (key === '2') {
        setMediaData(filterWithSearch(onlyImages));
      } else if (key === '3') {
        setMediaData(filterWithSearch(onlyVideos));
      }
    }
    setSelectedTab(key);
    setIsProgrammaticTabChange(false); // Reset flag
  };

  // Fix 3: Add search-aware filter function
  const filterWithSearch = (data) => {
    return data.filter(item =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  };





  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  // Create Section Template 
  const handleSaveTemplate = async (templateData) => {
    try {
      if (!user || !user._id) {
        throw new Error('User not authenticated');
      }

      const mediaData = getMediaDataFromTemplate(templateData, user._id);
      const response = await CrudService.create("MediaLibrary", mediaData);

      if (response.data) {
        // message.success(`${templateData.type} template saved successfully`);
        setIsCreateTemplateModalOpen(false);
        // Optional: refresh templates list or update state
        setMediaData((prev) => [response.data.result, ...prev]);
        setAllMediaData((prev) => [response.data.result, ...prev]);
      }
      fetchMediaData({ user, searchValue, filters: { ...filters }, currentPage, itemsPerPage });
    } catch (error) {
      console.error("Template save error:", error);
      message.error(`Failed to save template: ${error.message}`);
    }
  };


  // SORTING LOGIC START 

  const parseSize = (sizeStr) => {
    if (!sizeStr) return 0;
    const [num, unit] = sizeStr.split(" ");
    const size = parseFloat(num);
    if (unit === "KB") return size;
    if (unit === "MB") return size * 1024;
    return size; // default fallback
  };

  const parseResolution = (resStr) => {
    if (!resStr) return 0;
    const [w, h] = resStr.split(/[xX]/).map((x) => parseInt(x.trim(), 10));
    return w * h || 0;
  };

  const sortItems = (items, { key, direction }) => {
    return [...items].sort((a, b) => {
      const getValue = (item) => {
        switch (key) {
          case "createdAt":
          case "updatedAt":
            return new Date(item[key]);
          case "size":
            return parseSize(item.size);
          case "resolution":
            return parseResolution(item.resolution);
          case "title":
          case "type":
            return item[key]?.toLowerCase() || "";
          default:
            return 0;
        }
      };

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      return 0;
    });
  };


  const handleSorterChange = (sorter) => {
  // Check if the selected sorter is already active
  const isAlreadySelected =
    activeSorter.key === sorter.key && activeSorter.direction === sorter.direction;

  // If it's the same sorter, deselect it, otherwise update the active sorter
  if (isAlreadySelected) {
    setActiveSorter({ key: '', direction: '' });
  } else {
    setActiveSorter(sorter);
  }
};




  const sorterMenu = (
    <Menu>
      {sorterOptions.map((option, index) => {
        // Determine if the option is active
        const isActive =
          activeSorter.key === option.key && activeSorter.direction === option.direction;

        // Dynamically update label based on current direction
        const dynamicLabel = option.key === "createdAt"
          ? (option.direction === "asc" ? "Oldest First" : "Newest First")
          : option.key === "size"
            ? (option.direction === "asc" ? "Size (Smallest First)" : "Size (Largest First)")
            : option.key === "type"
              ? (option.direction === "asc" ? "Type (A-Z)" : "Type (Z-A)")
              : option.key === "title"
                ? (option.direction === "asc" ? "Title (A-Z)" : "Title (Z-A)")
                : option.key === "updatedAt"
                  ? "Recently Updated"
                  : option.label; // Default case for 'resolution'

        return (
          <Menu.Item
            key={`${option.key}-${option.direction}-${index}`}
            onClick={() =>
              handleSorterChange({
                key: option.key,
                direction: option.direction,
              })
            }
            style={{
              fontWeight: isActive ? 'bold' : 'normal',
              backgroundColor: isActive ? '#e6f7ff' : 'transparent',
            }}
          >
            {dynamicLabel}
          </Menu.Item>
        );
      })}
    </Menu>
  );



  // SORTING LOGIC END 
  try {
    return (
      <div className="h-full w-full  justify-center items-center pl-6">
        {/* Header */}

        {/* {closeMediaModalOpenSectionTemplate ? <h1>{closeMediaModalOpenSectionTemplate}yes</h1> : <h1>{closeMediaModalOpenSectionTemplate}no</h1>} */}
        <header className="w-full">
          <div className="w-full mx-auto">
            {/* <div className="w-full "> */}
            {!ImageModal && (
              <div className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center sm:h-16 sm:gap-0">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">Media Library</h1>
                </div>
                <div className="flex flex-col items-stretch w-full gap-3 sm:flex-row sm:items-center sm:w-auto">



                  {!activeSection && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsAddModalOpen(true)}
                      size="large"
                      className="w-full sm:w-auto custom-button"
                    >
                      Add image / video
                    </Button>
                  )}

                </div>
              </div>
            )}

            {/* {
              selectedTab !== "4" && (
                <div className="flex items-center gap-1 justify-start">
                  <div>
                    {currentSectionLimits && activeSection && (
                      <p style={{ fontSize: '16px', color: '#333', margin: '10px 0' }}>
                        {currentSectionLimits.videos > 0 ? (
                          <>This section accepts up to {currentSectionLimits.images} image
                            {currentSectionLimits.images > 1 ? 's' : ''} and {currentSectionLimits.videos} video
                            {currentSectionLimits.videos > 1 ? 's' : ''}.</>
                        ) : (
                          <>This section accepts only {currentSectionLimits.images} image
                            {currentSectionLimits.images > 1 ? 's' : ''}.</>
                        )}
                      </p>
                    )}
                  </div>
                  {
                    activeSection === "Employee Testimonials" && (
                      <button onClick={showModal} className="group flex gap-1 text-gray-500 border p-1 rounded-lg  hover:bg-blue-400 hover:text-white">
                        Reorder Images<ArrowUpDown className="text-gray-500 group-hover:text-white" size={20} />
                      </button>
                    )
                  }

                </div>
              )
            } */}

            {/* {
              selectedTab == "4" && ( 
                <p>{currentSectionLimits?.sectionName + " " + activeSection}</p>
              )
            } */}


          </div>
        </header>

        {/* Main Content */}
        <main className="px-2 py-1 pt-[-20px] mx-auto">
          <div className="space-y-3 ">


            <Tabs activeKey={selectedTab} onChange={handleTabChange} type="line">
              {!activeSection && (
                <TabPane
                  tab="All"
                  key="1"
                  disabled={!allowedTabs.includes("all")}
                ></TabPane>
              )}

              <TabPane
                tab="Images"
                key="2"
                disabled={!allowedTabs.includes("image")}
              ></TabPane>
              <TabPane
                tab="Videos"
                key="3"
                disabled={!allowedTabs.includes("video")}
              ></TabPane>
              {/* Hide section templates for now */}
              {/* <TabPane
                tab="Section templates"
                key="4"
                disabled={!allowedTabs.includes("section-template")}
              ></TabPane> */}
            </Tabs>

            {/* Search and Actions */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center w-full gap-3 ">
                {/* RENDER APPLIED FILTERS HERE START */}

                {/* RENDER APPLIED FILTERS HERE END */}
                <div className="relative flex-1 w-full flex items-center h-full">
                  <SearchOutlined className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Media"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full h-full py-2 pl-10 pr-4 bg-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />


                </div>

                <div className="flex items-center rounded-lg gap-2 h-full">
                  <Button
                    className={`action-button flex items-center gap-2 ${activeFilterCount > 0 ? 'bg-blue-100 text-blue-700' : ''
                      }`}
                    type="text"
                    // shape="round"
                    icon={
                      <div className="relative">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
                            stroke={activeFilterCount > 0 ? '#2563EB' : '#344054'}
                            strokeWidth="1.67"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        {activeFilterCount > 0 && (
                          <span className="absolute -top-5 -right-16  bg-blue-600 border-2 border-gray-200 text-white text-xs rounded-full px-1.5 py-0.5">
                            {activeFilterCount}
                          </span>
                        )}
                      </div>
                    }
                    onClick={() => setIsMediaFilterOpen(true)}
                    style={{
                      backgroundColor: activeFilterCount > 0 ? '#EBF4FF' : 'white',
                      color: activeFilterCount > 0 ? '#2563EB' : '#344054',
                      border: 'none',

                    }}
                  >
                    Filters
                  </Button>
                  <Dropdown overlay={sorterMenu} trigger={["click"]}>
                    <Button
                      className={`flex items-center gap-2 h-full rounded-lg !border-none ${activeSorter.key ? 'bg-blue-100 text-blue-700' : ''
                        }`}
                      style={{
                        backgroundColor: activeSorter.key ? '#EBF4FF' : 'white',
                        color: activeSorter.key ? '#2563EB' : '#344054',
                      }}
                    >
                      <FaSortAmountDownAlt size={20} />
                      Sort
                    </Button>
                  </Dropdown>




                  <Button
                    className="action-button rounded-lg  flex items-center gap-2"
                    type="text"
                    icon={
                      selectedItems.length === 0 ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.25 9L7.75 11.5L12.75 6.5M5.5 16.5H12.5C13.9001 16.5 14.6002 16.5 15.135 16.2275C15.6054 15.9878 15.9878 15.6054 16.2275 15.135C16.5 14.6002 16.5 13.9001 16.5 12.5V5.5C16.5 4.09987 16.5 3.3998 16.2275 2.86502C15.9878 2.39462 15.6054 2.01217 15.135 1.77248C14.6002 1.5 13.9001 1.5 12.5 1.5H5.5C4.09987 1.5 3.3998 1.5 2.86502 1.77248C2.39462 2.01217 2.01217 2.39462 1.77248 2.86502C1.5 3.3998 1.5 4.09987 1.5 5.5V12.5C1.5 13.9001 1.5 14.6002 1.77248 15.135C2.01217 15.6054 2.39462 15.9878 2.86502 16.2275C3.3998 16.5 4.09987 16.5 5.5 16.5Z"
                            stroke="#344054"
                            stroke-width="1.67"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5M6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5Z"
                            stroke="#D92D20"
                            stroke-width="1.67"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      )
                    }
                    onClick={() => {
                      // select all items
                      // setSelectedItems(mediaData.map((item) => item.id));
                      selectedItems.length === 0
                        ? setSelectedItems(mediaData.map((item) => item._id))
                        : setSelectedItems([]);
                    }}
                    style={{ backgroundColor: 'white' }}
                  >
                    {selectedItems.length > 0 ? "Deselect all" : "Select all"}

                  </Button>
                </div>

              </div>
            </div>

            <div className="">
              <FilterTags filters={filters} setFilters={setFilters} />

            </div>

            <div className="flex items-center justify-between w-full gap-3">
              {selectedItems.length > 0 && (
                <div className="flex flex-wrap items-center w-full gap-3 sm:w-auto">
                  <div className="flex items-center gap-2">
                    <CloseOutlined
                      className="text-gray-400 cursor-pointer"
                      onClick={() => {
                        setSelectedItems([]);
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} items selected
                    </span>
                  </div>
                  
                  {/* Bulk actions */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setIsBulkEditModalOpen(true)}
                      className="flex items-center gap-1"
                    >
                      <EditOutlined size={16} />
                      Bulk Edit
                    </Button>
                    <Button 
                      danger
                      onClick={handleBulkDelete}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              )}
              {/* {selectedItems && selectedItems.length  > 0 && ( */}
              {selectedItems && selectedItems.length > 0 && mediaLimits && activeSection && (
                <Button type="text" className="custom-button" onClick={handleUseSelected} style={{ backgroundColor: '#5207CD', color: '#ffffff' }}>
                  Use selected
                </Button>
              )}
            </div>

            {/* Applied Filters */}

            {/* Media Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lgr:grid-cols-4 ">
              {mediaData && mediaData.map((item) => (
                <MediaCard
                  key={item._id}
                  {...item}
                  templateData={item?.templateData}
                  selected={selectedItems.includes(item?._id?.toString())}
                  onSelect={handleItemSelect}
                  onEdit={handleEditItem}
                  onDelete={() => handleDelete(item?._id?.toString())}
                  onRename={() => onRename(item?._id?.toString())}
                  source={item?.source}
                />
              ))}

              {loading && (
                <>
                  {new Array(4).fill(0).map((x, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-start w-full gap-4 px-6 py-5 sm:px-5 bg-white-A700 rounded-[12px] min-w-[350px] min-h-[341px]"
                    > <SkeletonLoader /> </div>
                  ))}
                </>
              )}


            </div>
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={totalItems}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          </div>
        </main>

        {
          activeSection === "Employee Testimonials" && (
            <Modal
              // title="Reorder Images"
              visible={isReorderImage} // Control visibility using state
              onCancel={handleCancel} // Close modal when clicking the close button
              footer={[
                <div className="flex flex-col gap-2 sm:flex-row" key="footer">
                  <Button className="w-full border border-[#D0D5DD] text-[#344054]" onClick={handleCancel} type="text">Cancel</Button>
                  <Button type="primary" className="w-full custom-button" onClick={() => {
                    handleUseSelected();
                    setIsReorderImage(false)
                  }}>Save order</Button>
                </div>
              ]}
            // footer={null}
            >
              {/* <p>Here you can reorder your images.</p> */}
              {
                orderedTestimonials && activeSection === "Employee Testimonials" && (
                  <TestimonialReorder
                    testimonials={orderedTestimonials}
                    onReorder={handleSave}
                  />
                )
              }

            </Modal>
          )
        }


        {/* Modals */}

        {/* Media Filter Modal */}
        <MediaFilterMedia
          isOpen={isMediaFilterOpen}
          onClose={() => setIsMediaFilterOpen(false)}
          onApply={handleApplyMediaFilters}
          filterOptions={filterOptions}
          initialFilters={filters}
        />
        <EditMediaModal
          visible={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditItem(null);
          }}
          onSave={async (updatedItem) => {
            if (editItem) {
              try {
                await CrudService.update("MediaLibrary", editItem._id, updatedItem);
                setMediaData((prevData) =>
                  prevData.map((media) =>
                    media._id === editItem._id ? { ...media, ...updatedItem } : media
                  )
                );
                message.success("Media updated successfully");
              } catch (error) {
                console.error("Error updating media:", error);
                message.error("Failed to update media. Please try again.");
              }
            }
            setIsEditModalOpen(false);
          }}
          initialValues={
            editItem
              ? {
                fileName: editItem.title,
                description: editItem.description,
                tags: editItem.tags.map((t) => ({ text: t.text })),
                image: editItem.thumbnail,
              }
              : undefined
          }
          mediaItem={editItem}
        />
        <EditMediaModalNew
          visible={renameModal}
          onCancel={() => {
            setRenameModal(false);
            setSelectedMedia(null);
          }}
          onSave={handleRename}
          initialValues={{
            fileName: selectedMedia?.title || '',
            description: selectedMedia?.description || '',
            tags: selectedMedia?.tags || [],
          }}
          mediaItem={selectedMedia}
        />

        <AddMediaModal
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onAdd={(files) => {
            // Here you would typically send these files to your backend
            // and update your state with the new media items
            setIsAddModalOpen(false);
            message.success(`${files.length} file(s) added successfully`);
            fetchMediaData({ user, searchValue, filters: { ...filters }, currentPage, itemsPerPage });
          }}
          setCloseMediaModalOpenSectionTemplate={setCloseMediaModalOpenSectionTemplate}
          multiple
        />
        {/* 
        <SelectTemplateModal
          open={isCreateTemplateModalOpen}
          onCancel={() => setIsCreateTemplateModalOpen(false)}
          onFinish={() => {
            setIsCreateTemplateModalOpen(false);
            message.success("Template created successfully");
          }}
        /> */}

        <SelectTemplateModal
          open={isCreateTemplateModalOpen}
          onCancel={() => setIsCreateTemplateModalOpen(false)}
          onSave={handleSaveTemplate}  // Now saving happens in parent
        />

        <BulkEditModal
          open={isBulkEditModalOpen}
          onCancel={() => setIsBulkEditModalOpen(false)}
          selectedItems={selectedItems}
          mediaData={mediaData}
          onSave={() => {
            // Refresh the data after bulk edit
            fetchMediaData({
              user,
              searchValue,
              filters,
              sorters,
              activeSorter,
              currentPage,
              itemsPerPage,
            });
            setSelectedItems([]);
          }}
        />


      </div>
    );
  } catch (error) {
    console.error("Error in MediaLibrary component:", error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
