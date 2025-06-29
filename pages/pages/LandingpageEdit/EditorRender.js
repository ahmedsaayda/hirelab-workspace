import {
  Divider,
  Popconfirm,
  Collapse,
  Switch,
  message,
  Checkbox,
  Modal,
  Select,
  Spin,
} from "antd";
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import CrudService from "../../service/CrudService";
import {
  Button,
  Heading,
  Img,
  Input,
  Text,
} from "../Dashboard/Vacancies/components";
import EditorRenderArray from "./EditorRenderArray";
import ImageUploader from "./ImageUploader";
import { useFocusContext } from "../../contexts/FocusContext";
import { useHover } from "../../contexts/HoverContext";
import eventEmitter from "../../utils/eventEmitter";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";

const stripFormattingFromText = (text) => {
  // Remove line breaks and extra spaces
  return text
    .replace(/(\r\n|\n|\r)/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Recommended Jobs Selector Component
const RecommendedJobsSelector = React.memo(({
  value = [],
  onChange,
  excludeCurrentJobId,
  availableJobs: propAvailableJobs,
  jobsLoading: propJobsLoading,
}) => {
  // Use props if provided, otherwise fall back to local state (for backward compatibility)
  const [localJobs, setLocalJobs] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const user = useSelector(selectUser);

  const jobs = propAvailableJobs !== undefined ? propAvailableJobs : localJobs;
  const loading = propJobsLoading !== undefined ? propJobsLoading : localLoading;

  // Only use local fetching if no props are provided (backward compatibility)
  const shouldFetchLocally = propAvailableJobs === undefined;

  // Memoize user ID to prevent unnecessary re-fetches
  const userId = useMemo(() => user?._id, [user?._id]);
  
  // Memoize excludeCurrentJobId to prevent unnecessary re-fetches
  const excludeId = useMemo(() => excludeCurrentJobId, [excludeCurrentJobId]);

  // Use refs to track the last fetched values to prevent duplicate requests
  const lastFetchedUserId = useRef(null);
  const lastFetchedExcludeId = useRef(null);

  // Fetch all user's vacancies/jobs with debouncing and duplicate prevention (for backward compatibility)
  useEffect(() => {
    if (!shouldFetchLocally || !userId) return;

    // Check if we should skip this fetch (same as last time)
    if (lastFetchedUserId.current === userId && 
        lastFetchedExcludeId.current === excludeId) {
      return;
    }

    // Debounce the fetch to prevent rapid successive calls
    const timeoutId = setTimeout(async () => {
      setLocalLoading(true);
      try {
        
        const result = await CrudService.search(
          "LandingPageData",
          999, // Get a large number of results
          1,
          {
            text: "",
            filters: {
              user_id: userId,
            },
            sort: { createdAt: -1 }, // Most recent first
          }
        );

        // Filter out the current job if we have an ID to exclude
        let jobList = result.data.items || [];

        if (excludeId) {
          jobList = jobList.filter((job) => job._id !== excludeId);
        }

        // Transform to format needed for Select component
        const options = jobList.map((job) => ({
          label: job.vacancyTitle || "Untitled Job",
          value: job._id,
          description: job.heroDescription || "",
        }));

        setLocalJobs(options);
        
        // Update the last fetched values
        lastFetchedUserId.current = userId;
        lastFetchedExcludeId.current = excludeId;
        
      } catch (error) {
        console.error("Error fetching jobs:", error);
        message.error("Failed to load jobs");
      } finally {
        setLocalLoading(false);
      }
    }, 500); // Increased debounce time

    return () => clearTimeout(timeoutId);
  }, [shouldFetchLocally, userId, excludeId]);

  // Custom option rendering to show job title and description
  const customOptionRender = (option) => (
    <div className="flex flex-col">
      <div className="font-semibold">{option.label}</div>
      {option.description && (
        <div className="text-xs text-gray-500 truncate">
          {option.description}
        </div>
      )}
    </div>
  );

  // Handle individual select field changes
  const handleJobChange = (index, selectedJobId) => {
    const newValues = [...value];

    // If clearing the field
    if (!selectedJobId) {
      // Remove this position and shift all subsequent jobs up
      newValues.splice(index, 1);
    } else {
      // Update or add the job at this position
      newValues[index] = selectedJobId;
    }

    // Filter out any undefined/null values
    const cleanValues = newValues.filter(Boolean);

    onChange(cleanValues);
  };

  // Get job titles
  const getJobTitles = {
    0: "Recommended Job 1",
    1: "Recommended Job 2",
    2: "Recommended Job 3",
  };

  // Determine how many selectors to show
  // Always show the current count + 1 more (if less than 3), to allow adding more
  const selectorCount = Math.min(value.length + 1, 3);

  // If no jobs are available, don't show any selectors
  if (jobs.length === 0 && !loading) {
    return null;
  }

  // The select style to match other form controls
  const selectStyle = {
    width: "100%",
  };

  return (
    <div className="w-full space-y-4">
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Spin />
          <span className="ml-2">Loading jobs...</span>
        </div>
      ) : (
        Array.from({ length: selectorCount }).map((_, index) => (
          <div key={index} className="w-full">
            <div className="mb-2">
              <Text as="p" className="!text-blue_gray-700 font-medium text-sm">
                {getJobTitles[index]}
              </Text>
            </div>
            <div className="border border-solid border-blue_gray-100 rounded-lg overflow-hidden focus-within:border-light_blue-A700">
              <Select
                style={selectStyle}
                placeholder="Select a job"
                value={value[index]}
                onChange={(jobId) => handleJobChange(index, jobId)}
                options={jobs}
                optionRender={customOptionRender}
                optionFilterProp="label"
                allowClear
                showSearch
                className="w-full h-11 hover:border-none hover:outline-none"
                bordered={false}
                listHeight={250}
                dropdownStyle={{
                  borderRadius: "8px",
                  padding: "4px",
                }}
                notFoundContent={
                  <div className="p-2 text-center text-gray-500">
                    No jobs found
                  </div>
                }
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
});

const EditorRender = React.memo(({
  landingPageData,
  setLandingPageData,
  items,
  hideFooter,
  renderMore,
  showMagicPencil = true,
  sectionName = "",
  availableJobs,
  jobsLoading,
  lpId
}) => {
  const [changed, setChanged] = useState(false);
  const { setFocusRef } = useFocusContext();
  const [activeKeys, setActiveKeys] = useState([]); // Change to plural to indicate array
  const [isAutoPlayModalVisible, setIsAutoPlayModalVisible] = useState(false);
  const [tempAutoPlayValue, setTempAutoPlayValue] = useState(false);
  const { setHoveredField, setScrollToSection, setLastScrollToSection } =
    useHover();
  const [visiblePopconfirm, setVisiblePopconfirm] = useState({});
  const [selectedIndices, setSelectedIndices] = useState({});
  const autoSaveTimeout = useRef(null);

  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
    }
    autoSaveTimeout.current = setTimeout(async () => {
      if (changed && lpId) {
        try {
          await CrudService.update("LandingPageData", lpId, {
            ...landingPageData,
            _id: undefined,
          });
          setChanged(false);
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }
    }, 3000);
  }, [changed, lpId, landingPageData]);

  useEffect(() => {
    if (sectionName) {
      setScrollToSection(sectionName);
    }
  }, [sectionName]);


  const handleSave = async () => {
    await CrudService.update("LandingPageData", lpId, {
      ...landingPageData,
      _id: undefined,
    }).then(() => {
      message.success("Data saved successfully");
    });
    setChanged(false);
  };

  useEffect(() => {
    eventEmitter.on("triggerSave", handleSave); // Store function globally

    return () => {
      eventEmitter.off("triggerSave", handleSave); // Cleanup on unmount
    };
  }, [handleSave]);

  useEffect(() => {
    // Emit the state whenever it changes
    eventEmitter.emit("changeState", changed);
  }, [changed]);

  useEffect(() => {
    function listener(e) {
      if (changed) {
        e.preventDefault();
        const msg = "You have unsaved changes";
        e.returnValue = msg;
        return msg;
      }
    }
    window.addEventListener("beforeunload", listener);
    window.addEventListener("onbeforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
      window.removeEventListener("onbeforeunload", listener);
    };
  }, [changed]);

  const handleChanged = () => {
    setChanged(true);
    debouncedAutoSave();
  };
  
  useEffect(() => {
    document.addEventListener("HANDLE.CHANGED", handleChanged);
    return () => document.removeEventListener("HANDLE.CHANGED", handleChanged);
  }, [handleChanged]);

  const bulletListItems = items.filter((item) => item.type === "bulletList");
  
  const handleCheckboxChange = (checkedValues, parentKey) => {
    const updatedData = { ...landingPageData };
    updatedData[parentKey] = updatedData[parentKey].map((item, index) => ({
      ...item,
      enabled: checkedValues.includes(index),
    }));
    setLandingPageData(updatedData);
    handleChanged();
  };

  const handleAutoPlayConfirm = () => {
    setLandingPageData((d) => ({
      ...d,
      videoAutoPlay: tempAutoPlayValue,
    }));
    handleChanged();
    setIsAutoPlayModalVisible(false);
  };

  const handleAutoPlayCancel = () => {
    setIsAutoPlayModalVisible(false);
  };

  const handleMouseEnter = (key) => {
    setHoveredField(key);
  };

  const handleMouseLeave = () => {
    setHoveredField(null);
  };

  const handlePaste = (e, key, max) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const cleanText = stripFormattingFromText(pastedText);
    const element = e.target;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const currentText = landingPageData?.[key] || "";
    const newText = 
      currentText.substring(0, start) + 
      cleanText + 
      currentText.substring(end);
    const finalText = max ? newText.slice(0, max) : newText;
    
    setLandingPageData((d) => ({
      ...d,
      [key]: finalText,
    }));
    handleChanged();
    
    // Update cursor position after paste
    setTimeout(() => {
      const newCursorPosition = start + cleanText.length;
      element.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  useEffect(() => {
    const handleOpenCollapsePanel = ({ arrayKey, index }) => {
      const hasMatchingArray = items.some(
        (item) => item.key === arrayKey && item.array
      );
      if (hasMatchingArray) {
        setActiveKeys((prev) => {
          const indexStr = String(index);
          if (!prev.includes(indexStr)) {
            return [...prev, indexStr];
          }
          return prev;
        });
      }
    };
    eventEmitter.on("openCollapsePanel", handleOpenCollapsePanel);
    return () => {
      eventEmitter.off("openCollapsePanel", handleOpenCollapsePanel);
    };
  }, [items]);

  return (
    <div className="flex relative flex-col flex-grow">
      <div className="px-2">
      {bulletListItems.map((parentItem, index) => (
          <Checkbox.Group
            className="flex flex-wrap gap-2 justify-between"
            key={index}
            style={{ marginBottom: "16px" }}
            value={landingPageData[parentItem.key]
              .map((item, index) => (item.enabled ? index : null))
              .filter((index) => index !== null)}
            onChange={(checkedValues) =>
              handleCheckboxChange(checkedValues, parentItem.key)
            }
          >
            {landingPageData[parentItem.key].map((item, index) => (
              <Checkbox key={index} value={index}>
                {item.title}
              </Checkbox>
            ))}
          </Checkbox.Group>
        ))}
      </div>

      <div
        className="flex relative flex-wrap gap-2 justify-start items-start px-2"
        onBlur={async () => {
          if (changed) {
            await CrudService.update("LandingPageData", lpId, {
              ...landingPageData,
              _id: undefined,
            });
            setChanged(false);
          }
        }}
      >
        {items?.map?.((a, i) =>
          a.array ? (
            <div className="col-span-2 px-1 my-5 w-full">
              <Text size="4xl" className="!text-light_blue-A700 mb-2 font-bold">
                {a.label}
              </Text>
              <div className="flex gap-2 items-center"></div>{" "}
              {Array.isArray(landingPageData[a.key]) &&
                landingPageData[a.key].map((x, idx) => {
                  const maxArrayLength = a.maxArrayLength || 10000;

                  return (
                    <Collapse
                      size="small"
                      ghost
                      bordered={false}
                      key={idx}
                      className="mt-2 !pb-0"
                      activeKey={activeKeys}
                      onChange={(keys) => {
                        setActiveKeys(
                          typeof keys === "string" ? [keys] : keys || []
                        );
                      }}
                    >
                      <Collapse.Panel
                        showArrow={false}
                        className="border-none"
                        header={
                          <div className="flex gap-2 items-center">
                            <span>
                              {x?.title ? x.title : a.label + "-" + (idx + 1)}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className={`size-3 transition-transform duration-200 ${
                                activeKeys.includes(idx.toString())
                                  ? "rotate-180"
                                  : ""
                              }`}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                            {!a.diabledListChange && (
                              <Popconfirm
                                title="Are you sure?"
                                open={visiblePopconfirm[idx]}
                                onOpenChange={(open) =>
                                  setVisiblePopconfirm((prev) => ({
                                    ...prev,
                                    [idx]: open,
                                  }))
                                }
                                showCancel={false}
                                okButtonProps={{ style: { display: "none" } }}
                                cancelButtonProps={{
                                  style: { display: "none" },
                                }}
                                description={
                                  <div className="flex gap-2 justify-end mt-3">
                                    <button
                                      className="px-3 py-1 text-black bg-gray-300 rounded"
                                      onClick={() =>
                                        setVisiblePopconfirm((prev) => ({
                                          ...prev,
                                          [idx]: false,
                                        }))
                                      }
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => {
                                        setLandingPageData((d) => ({
                                          ...d,
                                          [a.key]: d[a.key].filter(
                                            (_, i2) => i2 !== idx
                                          ),
                                        }));
                                        handleChanged();
                                        setVisiblePopconfirm((prev) => ({
                                          ...prev,
                                          [idx]: false,
                                        }));
                                      }}
                                      className="px-3 py-1 text-white bg-red-500 rounded"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                }
                              >
                                <Img
                                  src="/images2/img_trash_01_red_700.svg"
                                  alt="trash-01"
                                  className="h-[20px] w-[20px] cursor-pointer ml-auto"
                                />
                              </Popconfirm>
                            )}
                          </div>
                        }
                        key={idx.toString()}
                        data-panel-key={idx.toString()}
                      >
                        <div className="p-2 rounded-md border border-solid border-blue_gray-100">
                          <EditorRenderArray
                            landingPageData={x}
                            setLandingPageData={(value, key) => {
                              const newData = [...landingPageData[a.key]];
                              newData[idx] = {
                                ...newData[idx],
                                [key]: value,
                              };
                              setLandingPageData({
                                ...landingPageData,
                                [a.key]: newData,
                              });
                            }}
                            items={a.array}
                            itemKey={x.key}
                            setChanged={handleChanged}
                            arrayContext={{
                              parentKey: a.key,
                              index: idx,
                            }}
                          />
                        </div>
                      </Collapse.Panel>
                    </Collapse>
                  );
                })}
              {!a.diabledListChange &&
                landingPageData[a.key].length < (a.maxArrayLength || 10000) && (
                  <button
                    className={`flex items-center !px-2 mt-2 ${
                      a.key === "growthPath" &&
                      landingPageData?.growthPath?.length >= 6
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      a.key === "growthPath" &&
                      landingPageData?.growthPath?.length >= 6
                    }
                    onClick={() => {
                      setLandingPageData((d) => {
                        if (d[a.key]) {
                          const newData = {
                            ...d,
                            [a.key]: [
                              ...d[a.key],
                              a.newItemValue ?? {
                                fullname: "",
                                role: "",
                                rating: 5,
                                comment: "",
                                avatar: "/dhwise-images/placeholder.png",
                              },
                            ],
                          };
                          const newIndex = (
                            newData[a.key].length - 1
                          ).toString();
                          setActiveKeys([...activeKeys, newIndex]);
                          return newData;
                        } else {
                          const newData = {
                            ...d,
                            [a.key]: [
                              a.newItemValue ?? {
                                fullname: "",
                                role: "",
                                rating: 5,
                                comment: "",
                                avatar: "/dhwise-images/placeholder.png",
                              },
                            ],
                          };
                          const newIndex = (
                            newData[a.key].length - 1
                          ).toString();
                          setActiveKeys([...activeKeys, newIndex]);
                          return newData;
                        }
                      });
                      handleChanged();
                    }}
                  >
                    <Img
                      src="/images2/img_plus_blue_gray_700_01.svg"
                      alt="plus"
                      className="h-[20px] w-[20px] "
                    />
                    <Heading
                      size="3xl"
                      as="h2"
                      className="!text-blue_gray-700_01"
                    >
                      Add more
                    </Heading>
                  </button>
                )}
            </div>
          ) : (
            <div
              key={i}
              onMouseEnter={() => handleMouseEnter(a.key)}
              onMouseLeave={handleMouseLeave}
              className={`
            w-full  
            flex flex-col gap-2 
            ${a.halfWidth ? "md:w-[calc(50%-4px)]" : "md:w-full"}
            hover:bg-gray-50 transition-colors duration-200 p-2 rounded
            relative
          `}
            >
              <div className="flex gap-5 justify-between">
                <div className="flex gap-2">
                  <Text
                    as="p"
                    className="!text-blue_gray-700 font-medium text-sm"
                  >
                    {a?.type === "image" && a?.multiple
                      ? `up to (${
                          a.maxFiles - (landingPageData?.[a.key]?.length || 0)
                        } images)`
                      : a.label}
                  </Text>
                </div>
                {!["image", "video", "jobSelector"].includes(a.type) && (
                  <div className="flex py-px">
                    <Text
                      as="p"
                      className="!font-normal !text-blue_gray-700_01"
                    >
                      {landingPageData?.[a.key]?.length || 0}/{a.max}
                    </Text>
                  </div>
                )}
              </div>
              {a.type === "image" ? (
                <>
                  <ImageUploader
                    maxFiles={a.maxFiles || 1}
                    multiple={a.multiple}
                    defaultImage={landingPageData?.[a.key]}
                    imageAdjustments={landingPageData?.imageAdjustment || {}}
                    fieldKey={a.key}
                    onImageUpload={(url) => {
                      setLandingPageData((d) => ({
                        ...d,
                        [a.key]: url,
                      }));
                      handleChanged();
                    }}
                    onImageAdjustmentChange={(fieldKey, adjustments) => {
                      setLandingPageData((d) => ({
                        ...d,
                        imageAdjustment: {
                          ...(d.imageAdjustment || {}),
                          [fieldKey]: adjustments,
                        },
                      }));
                      handleChanged();
                    }}
                  />
                </>
              ) : a.type === "video" ? (
                <>
                  <div className="flex gap-2 items-center">
                    <Text
                      as="p"
                      className="!text-blue_gray-700 font-medium text-sm py-2"
                    >
                      Auto Play
                    </Text>
                    <Switch
                      checked={landingPageData?.videoAutoPlay}
                      onChange={(checked) => {
                        setLandingPageData((d) => ({
                          ...d,
                          videoAutoPlay: checked,
                        }));
                        message.success(
                          checked
                            ? "Autoplay activated"
                            : "Autoplay deactivated"
                        );
                        handleChanged();
                      }}
                    />
                  </div>
                  <ImageUploader
                    maxFiles={a.maxFiles || 1}
                    multiple={a.multiple}
                    defaultImage={landingPageData?.[a.key]}
                    accept="video/*"
                    onImageUpload={(url) => {
                      setLandingPageData((d) => ({
                        ...d,
                        [a.key]: url,
                      }));
                      handleChanged();
                    }}
                  />
                </>
              ) : a.type === "jobSelector" ? (
                <RecommendedJobsSelector
                  value={landingPageData?.[a.key] || []}
                  onChange={(selectedJobs) => {
                    setLandingPageData((d) => ({
                      ...d,
                      [a.key]: selectedJobs,
                    }));
                    handleChanged();
                  }}
                  excludeCurrentJobId={lpId} // Exclude current job from options
                  availableJobs={availableJobs}
                  jobsLoading={jobsLoading}
                />
              ) : (
                <Input
                  className="border outline-none focus-within:border-light_blue-A700"
                  shape="round"
                  type={a.inputType}
                  name="input_one"
                  textarea={a.textarea}
                  value={landingPageData?.[a.key] || ''}
                  onChange={(value) => {
                    setLandingPageData((d) => ({
                      ...d,
                      [a.key]: value.slice(0, a.max),
                    }));
                    handleChanged();
                  }}
                  onPaste={(e) => handlePaste(e, a.key, a.max)}
                  ref={setFocusRef(a.key)}
                  maxLength={a.max}
                  onFocus={() => {
                    setLastScrollToSection(null)
                  }}
                />
              )}
            </div>
          )
        )}

        {renderMore && renderMore}
        {!hideFooter && <div className="mt-auto h-6" />}
      </div>
      <div className="sticky right-0 bottom-0 left-0 h-5 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
});

export default EditorRender;
