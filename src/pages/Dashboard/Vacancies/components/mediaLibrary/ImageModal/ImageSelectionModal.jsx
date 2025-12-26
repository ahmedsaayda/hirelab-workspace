// hirelab-frontend\src\components\mediaLibrary\ImageModal\ImageSelectionModal.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { message, Progress, Tabs } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Modal from "../Modal/Modal.jsx";
import SidebarOption from "./SidebarOption.jsx";
import DropZone from "./DropZone.jsx";
import { Film, Upload as UploadIcon, Link, Image, Palette } from "lucide-react";
import UploadService from "../../../../../../services/UploadService.js";
import StockImageBrowser from "./StockImageBrowse.jsx";
import CrudService from "../../../../../../services/CrudService.js";
import AiService from "../../../../../../services/AiService.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../../redux/auth/selectors.js";
import { Img } from "../../../../../../dhwise-components/index.jsx";
import { MediaCard } from "../components/media-card.jsx";
import { Skeleton, Box } from '@mui/material';
import HeroForm from "../components/modals/sectionTemplateForms/hero-form.jsx";
import TestimonialsForm from "../components/modals/sectionTemplateForms/testimonials-form.jsx";
import EditMediaModal from "./EditMediaModal.jsx";


const { TabPane } = Tabs;

const ImageSelectionModal = ({
  isOpen,
  onClose,
  onImageSelected,
  existingFiles = [],
  multiple,
  maxFiles,
  accept = "image/*",
  type = "all",
  autosave = false,
  currentSectionLimits = Infinity,
  isLogo = false,
  allowedTabs = ["all", "image", "video"] // Removed "section-template"
}) => {
  const user = useSelector(selectUser);
  const [activeOption, setActiveOption] = useState("upload");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [addingFromStockImage, setAddingFromStockImage] = useState(false);
  const [recentMedia, setRecentMedia] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(() => {
    if (type === "video") return "videos";
    if (type === "image") return "images";
    return "all";
  });
  const [searchValue, setSearchValue] = useState("");
  const [linkValue, setLinkValue] = useState("");

  // Unsplash (via backend proxy)
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashResults, setUnsplashResults] = useState([]);
  console.log("unsplashResults", unsplashResults);
  const [unsplashPage, setUnsplashPage] = useState(1);
  const [unsplashHasMore, setUnsplashHasMore] = useState(true);
  const unsplashSentinelRef = useRef(null);
  const unsplashInFlightRef = useRef(false);
  const unsplashRequestedPagesRef = useRef(new Set());
  const unsplashLoadedPagesRef = useRef(new Set());
  const unsplashSeenIdsRef = useRef(new Set());

  // Function to check if a media type is allowed
  const isMediaTypeAllowed = (mediaType) => {
    if (type === "all") return true;
    return mediaType.toLowerCase() === type.toLowerCase();
  };

  console.log("recentMedia", recentMedia)

  // Filter media based on type and selectedTab
  const filteredMedia = recentMedia.filter(media => {
    if (type !== "all") {
      // If type is specified (video/image), only show that type
      return media.type.toLowerCase() === type.toLowerCase();
    }
    // Otherwise filter based on selected tab
    if (selectedTab === "all") return true;
    if (selectedTab === "images") return media.type === "image";
    if (selectedTab === "videos") return media.type === "video";
    return true;
  });

  console.log("type:", type);
  console.log("filteredMedia:", filteredMedia);

  const handleFilesSelected = async (newFiles) => {
    if (!multiple) {
      // For single file mode, just replace the existing file
      const newEntries = newFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
        progress: 0,
      }));
      setFiles([newEntries[0]]);
      setIsUploading(true);
    } else if (maxFiles && files.length + newFiles.length > maxFiles && !isLogo) {
      message.error(`You can only select up to ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'}. Please remove some ${maxFiles === 1 ? 'file' : 'files'} first.`);
      return;
    }

    const newEntries = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      progress: 0,
    }));

    setFiles((prev) => {
      const newFilesArr = multiple ? [...prev, ...newEntries] : [newEntries[0]];
      // Remove duplicates by url
      const unique = Array.from(new Map(newFilesArr.map(f => [f.url, f])).values());
      return unique;
    });
    setIsUploading(true);

    try {
      const uploadPromises = newEntries.map(async (entry) => {
        if (!entry.file) return null;

        const result = await UploadService.upload(entry.file, (progress) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.url === entry.url ? { ...f, progress } : f
            )
          );
        });
        // @ts-ignore
        const cloudinaryData = result.data;
        if (!cloudinaryData?.secure_url) throw new Error("Invalid response");

        const mediaData = {
          user_id: user?._id,
          title: cloudinaryData.original_filename?.slice(0, 40) || "Untitled",
          description: cloudinaryData.original_filename || "",
          type: cloudinaryData.resource_type === "image" ? "image" : "video",
          thumbnail: cloudinaryData.secure_url,
          resolution: `${cloudinaryData.width || 0}x${cloudinaryData.height || 0}`,
          size: formatFileSize(cloudinaryData.bytes || 0),
          duration: cloudinaryData.duration
            ? `${Math.round(cloudinaryData.duration)}s`
            : "",
          tags: [],
        };

        await CrudService.create("MediaLibrary", mediaData);

        return {
          originalUrl: entry.url,
          uploadedUrl: cloudinaryData.secure_url,
        };
      });

      const results = (await Promise.all(uploadPromises)).filter(Boolean);

      setFiles((prev) =>
        prev.map((f) => {
          const match = results.find((r) => r.originalUrl === f.url);
          return match ? { ...f, url: match.uploadedUrl, progress: 100 } : f;
        })
      );

      // If autosave is enabled, automatically call handleDone after successful upload
      if (autosave) {
        const urls = files.map((f) => f.url).filter((u) => u.startsWith("http"));
        onImageSelected(urls);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setFiles((prev) =>
        prev.filter((f) => !newEntries.some((ne) => ne.url === f.url))
      );
      message.error("Upload failed");
    } finally {
      setIsUploading(false);
      // Refresh recent media after upload
      fetchRecent();
    }
  };

  const addRemoteImageToMediaLibrary = async (remoteUrl) => {
    if (!remoteUrl) return null;
    if (!user?._id) throw new Error("User not authenticated");

    // Upload remote URL to Cloudinary (Cloudinary supports remote URL uploads)
    const result = await UploadService.upload(remoteUrl, 10);
    // @ts-ignore
    const cloudinaryData = result?.data;
    if (!cloudinaryData?.secure_url) throw new Error("Invalid upload response");

    const mediaData = {
      user_id: user?._id,
      title: cloudinaryData.original_filename?.slice(0, 40) || "Unsplash image",
      description: cloudinaryData.original_filename || "Unsplash image",
      type: "image",
      thumbnail: cloudinaryData.secure_url,
      resolution: `${cloudinaryData.width || 0}x${cloudinaryData.height || 0}`,
      size: formatFileSize(cloudinaryData.bytes || 0),
      duration: "",
      tags: [
        { text: "unsplash", type: "source" },
      ],
    };

    await CrudService.create("MediaLibrary", mediaData);
    return cloudinaryData.secure_url;
  };






  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDone = () => {
    const urls = files.map((f) => f.url).filter((u) => u.startsWith("http"));
    onImageSelected(urls);
    onClose();
  };

  // Auto-apply selected images when modal is closed
  const handleModalClose = () => {
    if (!autosave && files.length > 0) {
      const urls = files.map((f) => f.url).filter((u) => u.startsWith("http"));
      if (urls.length > 0) {
        onImageSelected(urls);
      }
    }
    onClose();
  };

  useEffect(() => {
    if (addingFromStockImage) {
      const urls = files.map((f) => f.url).filter((u) => u.startsWith("http"));
      onImageSelected(urls);
      onClose();
      setAddingFromStockImage(false);
    }
  }, [files])

  // Extract fetchRecent to a function so it can be called after upload
  const fetchRecent = async (searchText = "") => {
    setRecentLoading(true);
    try {
      // IMPORTANT:
      // - In workspace sessions we must query by workspace to see workspace media.
      // - In main sessions we must query by user_id to avoid leaking other users' media.
      const filters = {};
      if (user?.isWorkspaceSession && user?.workspaceId) {
        filters.workspace = user.workspaceId;
      } else {
        filters.user_id = user._id;
      }

      // Only show videos if accept is video only
      if (accept?.includes('video') && !accept?.includes('image')) {
        filters.type = 'video';
      } else if (accept?.includes('image') && !accept?.includes('video')) {
        filters.type = 'image';
      }
      // Limit to 9 for videos
      const limit = (filters.type === 'video') ? 9 : 18;
      const result = await CrudService.search("MediaLibrary", limit, 1, {
        text: searchText || "",
        filters,
        sort: { createdAt: -1 },
        populate: undefined,
        populate2: undefined,
      });
      setRecentMedia(result?.data?.items || []);
    } catch (err) {
      setRecentMedia([]);
    } finally {
      setRecentLoading(false);
    }
  };

  // Always refresh results when modal opens (and whenever filters change),
  // and support "search as you type" with debounce.
  useEffect(() => {
    if (!isOpen || !user?._id) return;

    const t = setTimeout(() => {
      fetchRecent(searchValue);
    }, 350);

    return () => clearTimeout(t);
  }, [isOpen, user?._id, accept, searchValue, user?.isWorkspaceSession, user?.workspaceId]);

  // Reset files state every time the modal opens to ensure fresh state
  useEffect(() => {
    if (isOpen) {
      const newFiles = (existingFiles || []).map((url) => ({ url }));
      console.log("Modal opened - resetting files state:");
      console.log("  existingFiles:", existingFiles);
      console.log("  newFiles:", newFiles);
      setFiles(newFiles);
      setSearchValue("");
      setUnsplashQuery("");
      setUnsplashResults([]);
      setUnsplashPage(1);
      setUnsplashHasMore(true);
    } else {
      // Clear files when modal closes to ensure fresh state next time
      console.log("Modal closed - clearing files state");
      setFiles([]);
    }
  }, [isOpen]);

  // Reset Unsplash pagination when query changes
  useEffect(() => {
    if (!isOpen) return;
    if (activeOption !== "unsplash") return;
    setUnsplashPage(1);
    setUnsplashHasMore(true);
    setUnsplashResults([]);
    unsplashInFlightRef.current = false;
    unsplashRequestedPagesRef.current = new Set();
    unsplashLoadedPagesRef.current = new Set();
    unsplashSeenIdsRef.current = new Set();
  }, [unsplashQuery, isOpen, activeOption]);

  const fetchUnsplashPage = async ({ query, page }) => {
    const q = (query || "").trim();
    if (!q) return;
    // Prevent duplicate loads of the same page and concurrent fetches
    if (unsplashInFlightRef.current) return;
    if (unsplashLoadedPagesRef.current.has(page)) return;
    if (unsplashRequestedPagesRef.current.has(page)) return;
    try {
      unsplashInFlightRef.current = true;
      unsplashRequestedPagesRef.current.add(page);
      setUnsplashLoading(true);
      const res = await AiService.searchUnsplash(q, 24, page);
      const items = res?.data?.data || [];
      const meta = res?.data?.meta || {};
      const nextItems = Array.isArray(items) ? items : [];
      console.log("[Stock images] response meta:", meta);

      // De-dupe against what we already rendered (avoid stale closures)
      // We also update the refs so observer race conditions can't re-add the same ids.
      let dedupedCount = 0;
      setUnsplashResults((prev) => {
        const existingIds = new Set((prev || []).map((x) => x?.id).filter(Boolean));
        const existingUrls = new Set((prev || []).map((x) => x?.url).filter(Boolean));
        const normalizeAlt = (a) => (typeof a === "string" ? a.trim().toLowerCase() : "");
        const existingAlts = new Set((prev || []).map((x) => normalizeAlt(x?.alt)).filter(Boolean));
        const next = nextItems.filter((it) => {
          const id = it?.id;
          const url = it?.url;
          const alt = normalizeAlt(it?.alt);
          if (!id || !url) return false;
          if (existingIds.has(id) || existingUrls.has(url)) return false;
          // Also de-dupe by alt text (helps reduce "same looking" stock results)
          if (alt && existingAlts.has(alt)) return false;
          existingIds.add(id);
          existingUrls.add(url);
          if (alt) existingAlts.add(alt);
          return true;
        });
        dedupedCount = next.length;

        // Update ref sets as well (defensive)
        next.forEach((it) => {
          if (it?.id) unsplashSeenIdsRef.current.add(it.id);
        });

        return page === 1 ? next : [...prev, ...next];
      });

      unsplashLoadedPagesRef.current.add(page);

      const totalPages = Number(meta.total_pages || 0);
      if (totalPages && page >= totalPages) {
        setUnsplashHasMore(false);
      } else if (nextItems.length === 0) {
        setUnsplashHasMore(false);
      } else {
        setUnsplashHasMore(true);
      }
    } catch (e) {
      setUnsplashHasMore(false);
    } finally {
      setUnsplashLoading(false);
      unsplashInFlightRef.current = false;
      unsplashRequestedPagesRef.current.delete(page);
    }
  };

  // Real-time Unsplash search (debounced) - first page
  useEffect(() => {
    if (!isOpen) return;
    if (activeOption !== "unsplash") return;

    const q = (unsplashQuery || "").trim();
    if (!q) {
      setUnsplashResults([]);
      return;
    }

    const t = setTimeout(async () => {
      await fetchUnsplashPage({ query: q, page: 1 });
    }, 400);

    return () => clearTimeout(t);
  }, [isOpen, activeOption, unsplashQuery]);

  // Infinite scroll sentinel for Unsplash results
  useEffect(() => {
    if (!isOpen) return;
    if (activeOption !== "unsplash") return;
    if (!unsplashHasMore) return;
    if (unsplashLoading) return;

    const el = unsplashSentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        const q = (unsplashQuery || "").trim();
        if (!q) return;
        if (unsplashLoading) return;
        if (!unsplashHasMore) return;
        if (unsplashInFlightRef.current) return;

        const nextPage = unsplashPage + 1;
        // Guard: only fetch a page once
        if (unsplashLoadedPagesRef.current.has(nextPage)) return;
        setUnsplashPage(nextPage);
        fetchUnsplashPage({ query: q, page: nextPage });
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isOpen, activeOption, unsplashQuery, unsplashHasMore, unsplashLoading, unsplashPage]);

  // Also sync when existingFiles changes while modal is open
  useEffect(() => {
    if (isOpen) {
      const newFiles = (existingFiles || []).map((url) => ({ url }));
      console.log("existingFiles changed while modal is open:");
      console.log("  existingFiles:", existingFiles);
      console.log("  updating to newFiles:", newFiles);
      setFiles(newFiles);
    }
  }, [existingFiles, isOpen]);

  // Add recent upload to files
  const handleSelectRecent = (media) => {
    if (files.some(f => f.url === media.thumbnail)) return;
    if (maxFiles && files.length >= maxFiles && !isLogo) {
      message.error(`You can only select up to ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'}. Please remove some ${maxFiles === 1 ? 'file' : 'files'} first.`);
      return;
    }

    setFiles(prev => {
      const newFilesArr = multiple ? [...prev, { url: media.thumbnail }] : [{ url: media.thumbnail }];
      // Remove duplicates by url
      const unique = Array.from(new Map(newFilesArr.map(f => [f.url, f])).values());

      // If autosave is enabled, automatically save after selection
      if (autosave) {
        const urls = unique.map(f => f.url);
        onImageSelected(urls);
        onClose();
      }

      return unique;
    });
  };



  const handleRemoveFile = (url) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.url !== url));
  };


  const renderPreview = (file) => (
    <div key={file.url} className="flex items-center p-2 mb-2 bg-white rounded border">
      <img
        src={file.url}
        alt="Preview"
        className="object-cover mr-2 w-10 h-10 rounded sm:w-12 sm:h-12 sm:mr-3"
        onError={(e) => {
          (e.target).style.display = "none";
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs truncate sm:text-sm">
          {file.url.split("/").pop()?.split("?")[0]}
        </p>
        {typeof file.progress === "number" && (
          <Progress
            percent={file.progress}
            status={file.progress === 100 ? "success" : "active"}
            size="small"
          />
        )}
      </div>
      <button
        type="button"
        title="Remove file"
        onClick={() => handleRemoveFile(file.url)}
        className="flex-shrink-0 p-1 rounded-full sm:p-2 hover:bg-gray-100"
      >
        <Img
          src="/images2/img_trash_01.svg"
          alt="trash-01"
          className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px] cursor-pointer"
        />
      </button>
    </div>
  );

  // Handler for Edit
  const handleEdit = (id) => {
    const media = recentMedia.find((m) => m._id === id);
    if (media) {
      setEditingMedia(media);
      setIsEditModalOpen(true);
    }
  };

  // Handler for Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media item? This action cannot be undone.")) return;
    try {
      await CrudService.delete("MediaLibrary", id);
      setRecentMedia((prev) => prev.filter((m) => m._id !== id));
      message.success("Media item deleted successfully!");
    } catch (error) {
      message.error("Failed to delete media item. Please try again.");
    }
  };

  // Update handleEditSave to handle the full media data
  const handleEditSave = async (updatedData) => {
    if (!editingMedia) return;
    try {
      await CrudService.update("MediaLibrary", editingMedia._id, updatedData);
      setRecentMedia((prev) => prev.map((m) =>
        m._id === editingMedia._id ? { ...m, ...updatedData } : m
      ));
      setIsEditModalOpen(false);
      setEditingMedia(null);
      message.success("Media updated successfully");
      // Refresh the media list to show updated data
      fetchRecent();
    } catch (error) {
      message.error("Failed to update media. Please try again.");
    }
  };

  const handleLinkAdd = () => {
    if (!linkValue) {
      message.error("Please enter a valid URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(linkValue);
    } catch (e) {
      message.error("Please enter a valid URL");
      return;
    }

    // Add the link to files
    if (maxFiles && files.length >= maxFiles) {
      message.error(`You can only add up to ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'}`);
      return;
    }

    setFiles(prev => {
      const newFiles = [{ url: linkValue }];
      return multiple ? [...prev, ...newFiles] : newFiles;
    });

    // Clear the input
    setLinkValue("");

    // If autosave is enabled, save immediately
    if (autosave) {
      onImageSelected([linkValue]);
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} title="Media Library">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] max-h-[800px] w-full">
          {/* Sidebar */}
          <div className="flex-shrink-0 p-2 w-full border-b border-gray-100 lg:p-4 lg:w-48 lg:border-b-0 lg:border-r">
            <div className="flex overflow-x-auto gap-2 lg:flex-col lg:gap-0 lg:overflow-x-visible">
              <SidebarOption
                icon={<UploadIcon size={20} className="text-blue-500" />}
                label="Upload"
                active={activeOption === "upload"}
                onClick={() => setActiveOption("upload")}
              />
              <SidebarOption
                icon={<Link size={20} className="text-yellow-500" />}
                label="Link"
                active={activeOption === "link"}
                onClick={() => setActiveOption("link")}
              />
              <SidebarOption
                icon={<Image size={20} className="text-purple-500" />}
                label="Library"
                active={activeOption === "stock"}
                onClick={() => setActiveOption("stock")}
              />
              <SidebarOption
                icon={<Palette size={20} className="text-green-500" />}
                label="Stock images"
                active={activeOption === "unsplash"}
                onClick={() => setActiveOption("unsplash")}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="overflow-hidden flex-1 p-2 lg:p-4">
            {activeOption === "upload" && (
              <div className="flex flex-col gap-4 w-full h-full lg:flex-row"

              >
                {/* Left: DropZone and controls */}
                <div

                  className="lg:w-[35%] w-full ">
                  <div className="flex overflow-y-scroll relative flex-col p-2 pb-24 h-full bg-gray-50 rounded-lg border-2 border-gray-300 lg:p-4">
                    <div className="h-full"

                    >
                      <DropZone
                        onFilesSelected={handleFilesSelected}
                        multiple={multiple}
                        accept={type === "video" ? "video/*" : type === "image" ? "image/*" : accept}
                      />
                      <div className="flex flex-col mt-4 w-full">
                        <h4 className="mb-2 text-sm font-medium">Selected Files</h4>
                        <div className="overflow-y-auto flex-1 pb-16 min-h-0">
                          {files.map(renderPreview)}
                        </div>
                      </div>

                    </div>
                  </div>
                  {!autosave && (
                    <div className="flex sticky bottom-0 z-10 justify-end px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <button
                        onClick={handleDone}
                        disabled={isUploading || files.length === 0}
                        className="flex-shrink-0 px-4 py-2 w-full text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 disabled:bg-gray-400 lg:w-auto"
                      >
                        {isUploading ? "Uploading..." : `Insert ${type === "image" ? "Image" : "Video"}`}
                      </button>
                    </div>
                  )}

                </div>

                {/* Right: Recent uploads */}
                <div className="w-full lg:w-[65%] h-full flex flex-col overflow-hidden">
                  <div className="flex-shrink-0">
                    <h4 className="mb-2 text-sm font-semibold">Recent Uploads</h4>
                    <div className="mb-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2">
                          <SearchOutlined />
                        </span>
                        <input
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          placeholder="Search your media library..."
                          className="py-2 pr-3 pl-10 w-full text-sm rounded-[15px] border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    {/* Only show tabs if type is "all" */}
                    <Tabs activeKey={selectedTab} onChange={setSelectedTab} type="line" className="mb-2 w-full">
                      <TabPane tab="All" key="all" disabled={type !== "all"} />
                      <TabPane tab="Images" key="images" disabled={type !== "image" && type !== "all"} />
                      <TabPane tab="Videos" key="videos" disabled={type !== "video" && type !== "all"} />
                    </Tabs>
                    {/* {type === "all" ? (
                      <Tabs activeKey={selectedTab} onChange={setSelectedTab} type="line" className="mb-2 w-full">
                        <TabPane tab="All" key="all" />
                        <TabPane tab="Images" key="images" />
                        <TabPane tab="Videos" key="videos" />
                      </Tabs>
                    ) : (
                      <div className="mb-2 w-full border-b border-gray-200">
                        <h3 className="pb-2 text-sm font-medium capitalize">
                          {type === "video" ? "Videos" : "Images"}
                        </h3>
                      </div>
                    )} */}
                  </div>

                  <div className="overflow-y-auto flex-1 pb-4 min-h-0">
                    {recentLoading ? (
                      <div className="w-full text-gray-500">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {[1, 2, 3].map((index) => (
                            <div key={index} className="w-full">
                              <Skeleton variant="rectangular" width="100%" height={180} />
                              <Box sx={{ pt: 1 }}>
                                <Skeleton />
                                <Skeleton width="60%" />
                              </Box>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : filteredMedia.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">No {type !== "all" ? type : ""} media found</div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 w-full sm:grid-cols-2 lg:grid-cols-4">
                        {filteredMedia.map((media) => (
                          <div key={media._id} className="cursor-pointer" onClick={() => handleSelectRecent(media)}>
                            <MediaCard
                              _id={media._id}
                              title={media.title}
                              description={media.description}
                              tags={media.tags || []}
                              thumbnail={media.thumbnail}
                              type={media.type}
                              duration={media.duration}
                              resolution={media.resolution}
                              templateData={media.templateData}
                              size={media.size}
                              selected={files.some(f => f.url === media.thumbnail)}
                              onSelect={() => handleSelectRecent(media)}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              hideDescription={true}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeOption === "link" && (
              <div className="flex flex-col p-4 mx-auto space-y-4 max-w-md">
                <h4 className="mb-4 text-lg font-medium">Add {type === "video" ? "Video" : "Image"} from URL</h4>
                <input
                  type="text"
                  placeholder={`https://example.com/${type === "video" ? "video.mp4" : "image.jpg"}`}
                  className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setLinkValue(e.target.value)}
                  value={linkValue}
                />
                <button
                  className="px-4 py-2 w-full text-white bg-blue-500 rounded hover:bg-blue-600 sm:w-auto"
                  onClick={handleLinkAdd}
                >
                  Add {type === "video" ? "Video" : "Image"}
                </button>
              </div>
            )}

            {activeOption === "stock" && (
              <div className="w-full h-full">
                <StockImageBrowser
                  onSelect={(urls) => {
                    setAddingFromStockImage(false);
                    setFiles((prev) => {
                      const newFiles = urls.map(url => ({ url }));
                      return multiple ? [...prev, ...newFiles] : newFiles;
                    });
                    setAddingFromStockImage(true);
                  }}
                  maxFiles={maxFiles}
                  currentCount={files.length}
                  type={type}
                  currentSectionLimits={currentSectionLimits}
                  allowedTabs={allowedTabs}
                />
              </div>
            )}

            {activeOption === "unsplash" && (
              <div className="flex flex-col gap-4 w-full h-full lg:flex-row">
                {/* Left: Selected */}
                <div className="lg:w-[35%] w-full">
                  <div className="flex overflow-y-scroll relative flex-col p-2 pb-24 h-full bg-gray-50 rounded-lg border-2 border-gray-300 lg:p-4">
                    <div className="flex flex-col mt-2 w-full">
                      <h4 className="mb-2 text-sm font-medium">Selected Files</h4>
                      <div className="overflow-y-auto flex-1 pb-16 min-h-0">
                        {files.length === 0 ? (
                          <div className="py-8 text-sm text-center text-gray-400">
                            Search Unsplash and click an image to add it.
                          </div>
                        ) : (
                          files.map(renderPreview)
                        )}
                      </div>
                    </div>
                  </div>

                  {!autosave && (
                    <div className="flex sticky bottom-0 z-10 justify-end px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <button
                        onClick={handleDone}
                        disabled={isUploading || files.length === 0}
                        className="flex-shrink-0 px-4 py-2 w-full text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 disabled:bg-gray-400 lg:w-auto"
                      >
                        {isUploading ? "Uploading..." : `Insert ${type === "image" ? "Image" : "Video"}`}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Unsplash search */}
                <div className="w-full lg:w-[65%] h-full flex flex-col overflow-hidden">
                  <div className="flex-shrink-0">
                    <h4 className="mb-2 text-sm font-semibold">Stock images</h4>
                    <div className="mb-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2">
                          <SearchOutlined />
                        </span>
                        <input
                          value={unsplashQuery}
                          onChange={(e) => setUnsplashQuery(e.target.value)}
                          placeholder="Search stock images (e.g., Software Engineer office)..."
                          className="py-2 pr-3 pl-10 w-full text-sm rounded-[15px] border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Images are imported into your Media Library after upload.
                      </div>
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1 pb-4 min-h-0">
                    {!unsplashQuery.trim() ? (
                      <div className="py-8 text-center text-gray-400">
                        Start typing to search stock images
                      </div>
                    ) : unsplashLoading && unsplashResults.length === 0 ? (
                      // Only show skeletons for the initial load (so we don't wipe results + reset scroll)
                      <div className="w-full text-gray-500">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="w-full">
                              <Skeleton variant="rectangular" width="100%" height={180} />
                              <Box sx={{ pt: 1 }}>
                                <Skeleton />
                                <Skeleton width="60%" />
                              </Box>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : unsplashResults.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">No results</div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 w-full sm:grid-cols-2 lg:grid-cols-4">
                        {unsplashResults.map((img) => (
                          <button
                            key={img.id}
                            type="button"
                            className="text-left cursor-pointer"
                            onClick={async () => {
                              try {
                                if (maxFiles && files.length >= maxFiles && !isLogo) {
                                  message.error(`You can only select up to ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'}.`);
                                  return;
                                }

                                setIsUploading(true);
                                const uploadedUrl = await addRemoteImageToMediaLibrary(img.url);
                                if (!uploadedUrl) return;

                                setFiles((prev) => {
                                  const next = multiple ? [...prev, { url: uploadedUrl }] : [{ url: uploadedUrl }];
                                  // De-dupe
                                  return Array.from(new Map(next.map(f => [f.url, f])).values());
                                });

                                // Refresh recent media list so it appears in Library tab immediately
                                fetchRecent(searchValue);

                                if (autosave) {
                                  onImageSelected([uploadedUrl]);
                                  onClose();
                                }
                              } catch (e) {
                                console.error(e);
                                message.error("Failed to import image from Unsplash");
                              } finally {
                                setIsUploading(false);
                              }
                            }}
                          >
                            <div className="overflow-hidden bg-white rounded-lg border">
                              <img
                                src={img.thumb || img.url}
                                alt={img.alt || "Unsplash image"}
                                className="object-cover w-full h-40"
                              />
                              <div className="p-2">
                                <div className="text-xs text-gray-700 truncate">
                                  {img.alt || "Unsplash image"}
                                </div>
                                <div className="text-[11px] text-gray-500 truncate">
                                  {img.photographer || ""}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        <div ref={unsplashSentinelRef} className="col-span-full w-full h-1" />
                        {unsplashLoading && unsplashResults.length > 0 && (
                          <div className="col-span-full py-2 text-xs text-center text-gray-500">
                            Loading more...
                          </div>
                        )}
                        {!unsplashHasMore && unsplashResults.length > 0 && (
                          <div className="col-span-full py-2 text-xs text-center text-gray-400">
                            End of results
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Edit Modal for section-template types */}
      {editingMedia && isEditModalOpen && (
        <EditMediaModal
          visible={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingMedia(null);
          }}
          onSave={handleEditSave}
          initialValues={
            editingMedia
              ? {
                fileName: editingMedia.title,
                description: editingMedia.description,
                tags: editingMedia.tags || [],
                image: editingMedia.thumbnail,
              }
              : undefined
          }
          mediaItem={editingMedia}
        />
      )}
    </>
  );
};

export default ImageSelectionModal;
