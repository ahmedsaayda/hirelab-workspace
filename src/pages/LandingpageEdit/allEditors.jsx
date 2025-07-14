import React, { useMemo } from "react";
import EditorRender from "./EditorRender";
import eventEmitter from "../../utils/eventEmitter";
import { message } from "antd";
import { useState, useEffect } from "react";
import Currency from "../../data/Currency.json";
import { Slider, Spin, Switch, Collapse, Select } from "antd";
import { currencies } from "../../data/currencies";
import {
  Button,
  Heading,
  Img,
  Input,
  SelectBox,
  Text,
} from "../Dashboard/Vacancies/components/components";
import ImageUploader from "./ImageUploader";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import { useHover } from "../../contexts/HoverContext";
import { useFocusContext } from "../../contexts/FocusContext";
import AuthService from "../../services/AuthService";
import { CloseOutlined } from "@ant-design/icons";

const AboutCompanyEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "aboutTheCompanyTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "aboutTheCompanyText",
            label: "Subheader",
            max: 120,
          },
          {
            key: "aboutTheCompanyDescription",
            label: "Body Text",
            max: 500,
            textarea: true,
          },
          {
            key: "aboutTheCompanyImages",
            label: "Images (up to 5 images)",
            type: "image",
            accept: "image/*",
            multiple: true,
            maxFiles: 5,
          },
        ]}
      />
    </>
  );
};

const LeaderIntroductionEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "leaderIntroductionTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "leaderIntroductionDescription",
            label: "Body text",
            max: 400,
            textarea: true,
          },
          {
            key: "leaderIntroductionFullname",
            label: "Full name",
            max: 40,
            halfWidth: true,
          },
          {
            key: "leaderIntroductionJobTitle",
            label: "Job Title",
            max: 40,
            halfWidth: true,
          },
          {
            key: "leaderIntroductionAvatar",
            label: "Image",
            type: "image",
            accept: "image/*"
          },
        ]}
      />
    </>
  );
};

const VideoEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "videoTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "videoDescription",
            label: "Subheader",
            max: 120,
            textarea: true,
          },
          {
            key: "myVideo",
            label: "Video",
            type: "video",
            accept: "video/*"
          },
        ]}
      />
    </>
  );
};

const AgendaEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "agendaTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "agendaDescription",
            label: "Subheader",
            max: 120,
          },
          {
            key: "dailyScheduleList",
            label: "Daily Schedule",
            max: 120,
            array: [
              {
                key: "eventTitle",
                label: "Activity",
                max: 40,
              },
              {
                key: "dateTimeSlot",
                label: "Time Slot",
                type: "timeslot",
              },
              {
                key: "description",
                label: "Description",
                max: 400,
                textarea: true,
              },
            ],
          },
        ]}
      />
    </>
  );
};

const CandidateProcessEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "candidateProcessTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "candidateProcessDescription",
            label: "Subheader",
            max: 120,
            textarea: true,
          },
          {
            key: "candidateProcess",
            label: "Steps",
            max: 12,
            maxArrayLength: 10,
            array: [
              {
                key: "candidateProcessIcon",
                label: "Icon",
                type: "icon",
              },
              {
                key: "candidateProcessText",
                label: "Title",
                max: 40,
              },
            ],
          },
        ]}
      />
    </>
  );
};

const EVPMissionEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "evpMissionTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "evpMissionDescription",
            label: "Body text ",
            textarea: true,
            max: 300,
          },
          {
            key: "evpMissionFullname",
            label: "Full name",
            max: 40,
            halfWidth: true,
          },
          {
            key: "evpMissionCompanyName",
            label: "Job Title",
            max: 40,
            halfWidth: true,
          },
          {
            key: "evpMissionAvatar",
            label: "Image",
            type: "image",
            accept: "image/*"
          },
        ]}
      />
    </>
  );
};

const EmployerTestimonialEdit = (props) => {
  const { setScrollToSection } = useHover();
  const handleClick = () => {
    const lastItem = localStorage.getItem("lastItem");
    console.log("lastItem", lastItem);
    if (lastItem !== "employer-testimonial") {
      console.log("setting scroll to section");
      setScrollToSection("employer-testimonial");
      localStorage.setItem("lastItem", "employer-testimonial");
    }
  };
  console.log("EmployerTestimonialEdit", props);
  return (
    <div onClick={handleClick}>
      <EditorRender
        showMagicPencil={false}
        {...props}
        items={[
          {
            key: "testimonialTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "testimonialSubheader",
            label: "Subheader",
            max: 300,
            textarea: true,
          },
          {
            key: "testimonials",
            label: "Testimonials",
            max: 120,
            array: [
              {
                key: "fullname",
                label: "Name",
                max: 40,
              },
              {
                key: "role",
                label: "Job Title",
                max: 40,
              },
              {
                key: "comment",
                label: "Body Text",
                max: 400,
                textarea: true,
              },
              {
                key: "avatar",
                label: "Image",
                type: "image",
                toggle: true,
                toggleKey: "avatarEnabled",
              },
            ],
          },
        ]}
      />
    </div>
  );
};

const FooterEdit = (props) => {
  console.log("setLandingPageData", props.setLandingPageData)
  const handleShowSimilarJobsChange = (e) => {
    console.log("handleShowSimilarJobsChange", e);
    
    document.dispatchEvent(new CustomEvent("HANDLE.CHANGED"));
    props.setLandingPageData((prev) => ({
      ...prev,
      showSimilarJobs: e
    }));
  }
  return (
    <>
      <EditorRender
        {...props}
        items={[
          { key: "footerTitle", label: "Header", max: 80 },
          {
            key: "footerDescription",
            label: "Subheader",
            max: 120,
            textarea: true,
          },
          { key: "similarJobsTitle", label: "Similar Jobs Title", max: 40 },
          {key:"similarJobs", label:"Select Jobs", type: "jobSelector"}
        ]}
        renderMore={
          <div className="flex items-center gap-2">
            <div>Show Similar Jobs</div>
            <Switch checked={props.landingPageData?.showSimilarJobs} onChange={handleShowSimilarJobsChange} />
          </div>
        }
      />
    </>
  );
};

const GrowthPathEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "growthPathTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "growthPathDescription",
            label: "Subheader",
            max: 120,
            textarea: true,
          },

          {
            key: "growthPath",
            label: "Path",
            max: 2,
            maxArrayLength: 10,
            array: [
              {
                key: "icon",
                label: "Icon",
                type: "icon",
              },
              {
                key: "title",
                label: "Title",
                max: 40,
              },
            ],
          },
        ]}
      />
    </>
  );
};

const dropDownOptions = [
  { label: "Monthly", value: "Month" },
  { label: "Annual", value: "Year" },
   {label: "Weekly", value: "Week" },
  { label: "Hourly", value: "Hour" },
];

const currencyOptions = Object.entries(Currency).map(
  ([code, currency]) => ({
    label: currency.name,
    value: code,
    symbol: currency.symbol,
  })
);


const hoursUnitOptions = [
  // { label: "Hours", value: "Hours" },
  { label: "Day", value: "Day" },
  { label: "Week", value: "Week" },
  { label: "Month", value: "Month" },
];

const HeroSectionEdit = ({ landingPageData, setLandingPageData }) => {
  const user = useSelector(selectUser);
  const PreviousAllAddress = user?.allAddresses || [];
  const [isRemote, setIsRemote] = useState(false);
  const [isHybrid, setIsHybrid] = useState(false);
  const [isSalaryRange, setIsSalaryRange] = useState(false);
  const [isHoursRange, setIsHoursRange] = useState(false);
  // const [position, setPosition] = useState({ x: "50%", y: "50%" });
  const [activeKeys, setActiveKeys] = useState([]); // Change to plural to indicate array
  console.log("activeKeys", activeKeys);
  const { setHoveredField, setScrollToSection,setLastScrollToSection } = useHover();
  const { setFocusRef, handleItemClick } = useFocusContext();
  const [allAddresses, setAllAddresses] = useState(user?.allAddresses);
  const [selectedLocations, setSelectedLocations] = useState(
    landingPageData && landingPageData.location || []
  );
  const [locationOptions, setLocationOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  console.log("landingPageData", landingPageData.location);
  // [ 'Paris', 'Lyon' ]

  console.log("landingPageData.locations", landingPageData.location);
  console.log("PreviousAllAddress", PreviousAllAddress);

  const [isCustomLocationDeleted, setIsCustomLocationDeleted] = useState(false);

  // Listen for focus events from the preview
  useEffect(() => {
    const handleOpenCollapseForField = (fieldName) => {
      // Map field names to their corresponding collapse panel keys
      const fieldToCollapseMap = {
        // Salary fields
        salaryMin: "salaryRange",
        salaryMax: "salaryRange",
        salaryTime: "salaryRange",
        salaryCurrency: "salaryRange",
        salaryRange: "salaryRange",
        // Hours fields
        hoursMin: "hoursRange",
        hoursMax: "hoursRange",
        hoursUnit: "hoursRange",
        hoursRange: "hoursRange",
        // Location fields
        location: "location",
      };

      const collapseKey = fieldToCollapseMap[fieldName];
      if (collapseKey && !activeKeys.includes(collapseKey)) {
        console.log(
          `Opening collapse panel for ${fieldName} -> ${collapseKey}`
        );
        setActiveKeys((prev) => [...prev, collapseKey]);
      }
    };

    // Handle focus events
    const handleFocusEvent = (event) => {
      console.log("handleFocusEvent", event);
      const { key } = event.detail || event||{};
      console.log("key", key);
      if (key) {
        handleOpenCollapseForField(key);
      }
    };

    // Listen for custom focus events
    eventEmitter.on("focusField", handleFocusEvent);

    return () => {
      eventEmitter.off("focusField", handleFocusEvent);
    };
  }, [activeKeys]);

  // Modify the handleItemClick wrapper to emit our custom event
  const handleItemClickWithCollapse = (key) => {
    // Emit event to open collapse if needed
    eventEmitter.emit("focusField", { key });
    // Call original handler
    handleItemClick(key);
  };

  const generateLocationOptions = () => {
    console.log("isCustomLocationDeleted", isCustomLocationDeleted);
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
  };

  useEffect(() => {
    if (isCustomLocationDeleted) {
      setIsCustomLocationDeleted(false);
      console.log(
        "isCustomLocationDeleted-updated the false",
        isCustomLocationDeleted
      );
      return;
    } else {
      const updatedLocationOptions = generateLocationOptions();
      setLocationOptions(updatedLocationOptions);
    }
  }, [allAddresses, searchText]);

  useEffect(() => {
    if (landingPageData?.location) {
      setSelectedLocations(landingPageData.location);
      setIsRemote(landingPageData.location?.includes("Remote"));
      setIsHybrid(landingPageData.location?.includes("Hybrid"));
    }
    setIsSalaryRange(!!landingPageData?.salaryRange);
    setIsHoursRange(!!landingPageData?.hoursRange);
  }, [landingPageData]);

  const handleChange = (key, value) => {
    document.dispatchEvent(new CustomEvent("HANDLE.CHANGED"));
    setLandingPageData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLocationChange = async (values) => {
    const lastValue = values[values.length - 1];
    const isNewLocation = locationOptions.find(
      (opt) => opt && opt.value === lastValue && opt.isNew
    );
    if (isNewLocation) {
      const NewLocation = {
        country: `${lastValue}`,
        city: `${lastValue}`,
        officeName: "",
        yourLocation: "",
        street: "namename",
        address: "",
        addressType: "",
        CustomLocation: true,
      };

      setAllAddresses((prev) => [...prev, NewLocation]);

      console.log("userrrrrrrrrr", user);
      const current = await AuthService.updateMe({
        // ...user,
        allAddresses: [...PreviousAllAddress, NewLocation],
      });

      console.log("currentcurrent", current);
    }

    setSelectedLocations(values);
    handleChange("location", values);
  };

  const dropdownRender = (menu) => (
    <div>
      {menu}
      <div className="px-2 py-1 text-xs text-gray-500">
        Type to search or create a new location
      </div>
    </div>
  );

  const handleDeleteLocation = async (location) => {
    const updatedAddresses = allAddresses.filter(
      (addr) => addr.city !== location
    );
    setSelectedLocations((prevState) =>
      prevState.filter((option) => option !== location)
    );
    setLocationOptions((prevState) =>
      prevState.filter((option) => option.value !== location)
    );

    const current = await AuthService.updateMe({
      allAddresses: updatedAddresses,
    });
    setAllAddresses(updatedAddresses);
    setIsCustomLocationDeleted(true);
    message.success(`Location "${location}" deleted successfully`);
  };
  console.log("selectedLoc", {
    selectedLocations,
    locationOptions,
    allAddresses,
  });

  const optionRender = (option) => {
    // Find the corresponding address object from `allAddresses`
    console.log("allAddresses", allAddresses);
    const address = allAddresses.find((addr) => addr.city === option.value);

    return (
      <div className="flex justify-between items-center">
        <span>{option.label}</span>
        {address && address?.CustomLocation && (
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteLocation(option.value);
            }}
            className="p-1 text-red-300 rounded-full cursor-pointer hover:bg-red-400 hover:text-white"
          />
        )}
      </div>
    );
  };

  const handleRemoteChange = (checked) => {
    setIsRemote(checked);
    if (checked) {
      setIsHybrid(false);
      handleLocationChange(["Remote"]);
    } else {
      handleLocationChange(["Hybrid"]);
    }
  };

  const handleHybridChange = (checked) => {
    setIsHybrid(checked);
    if (checked) {
      setIsRemote(false);
      handleLocationChange(["Hybrid"]);
    }
  };

  const handleClick = () => {
    const lastItem = localStorage.getItem("lastItem");
    console.log("lastItem", lastItem);
    if (lastItem !== "hero-section") {
      setScrollToSection("hero-section");
      localStorage.setItem("lastItem", "hero-section");
    }
  };

  return (
    <div onClick={handleClick}>
      <EditorRender
        {...({} )}
        landingPageData={landingPageData}
        setLandingPageData={setLandingPageData}
        items={[
          { key: "vacancyTitle", label: "Job title", max: 60 },
          {
            key: "heroDescription",
            label: "Headline",
            max: 120,
            textarea: true,
          },
        ]}
        renderMore={
          <div className="flex flex-col gap-2 w-full">
            {/* Salary Range */}
            <Collapse
              size="small"
              ghost
              bordered={false}
              className="mt-2 !pb-0 w-full "
              activeKey={activeKeys}
              onChange={(keys) => {
                setActiveKeys(typeof keys === "string" ? [keys] : keys || []);
              }}
            >
              <Collapse.Panel
                showArrow={false}
                className="border-none"
                header={
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-900_01 font-inter !text-blue_gray-700 font-medium text-xs lgr:text-sm ">
                      Salary Range
                    </span>
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
                key="salaryRange"
              >
                <div className="flex flex-col col-span-2 gap-2 w-full">
                  <div className="flex gap-5 justify-between items-center">
                    <Text as="p" className="self-end !text-blue_gray-700">
                      Salary
                    </Text>
                    <div className="flex gap-2 self-start">
                      <Text
                        as="p"
                        className="!font-normal !text-blue_gray-700_01"
                      >
                        Range
                      </Text>
                      <Switch
                        checked={isSalaryRange}
                        onChange={(checked) => {
                          setIsSalaryRange(checked);
                          handleChange("salaryRange", checked);
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2 justify-between items-center">
                      <Input
                        shape="round"
                        {...({} )}
                        name="salaryMin"
                        placeholder="Min"
                        value={landingPageData?.salaryMin || ""}
                        onInput={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
                          handleChange("salaryMin", value);
                        }}
                        className="w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 text-sm"
                        onMouseEnter={() => setHoveredField("salaryMin")}
                        onMouseLeave={() => setHoveredField(null)}
                        ref={setFocusRef("salaryMin")}
                        onFocus={() => {
                          setLastScrollToSection(null)
                        }}
                 
                      />
                      <SelectBox
                        shape="round"
                        {...({} )}
                        name="salaryTime"
                        placeholder="Frequency"
                        options={dropDownOptions}
                        value={dropDownOptions.find(
                          (o) => o.value === landingPageData?.salaryTime
                        )}
                        onChange={(e) => handleChange("salaryTime", e.value)}
                        className="gap-px w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5"
                        onMouseEnter={() => setHoveredField("salaryTime")}
                        onMouseLeave={() => setHoveredField(null)}
                        ref={setFocusRef("salaryTime")}
                        onFocus={() => {
                          setLastScrollToSection(null)
                        }}
               
                      />
                    </div>
                    {isSalaryRange && (
                      <Input
                        shape="round"
                        {...({} )}
                        name="salaryMax"
                        placeholder="Max"
                        value={landingPageData?.salaryMax || ""}
                        onInput={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
                          handleChange("salaryMax", value);
                        }}
                        className="border border-solid border-blue_gray-100 sm:pr-5 text-sm"
                        onMouseEnter={() => setHoveredField("salaryMax")}
                        onMouseLeave={() => setHoveredField(null)}
                        ref={setFocusRef("salaryMax")}
                        onFocus={() => {
                          setLastScrollToSection(null)
                        }}
                      />
                    )}

                    <SelectBox
                      shape="round"
                      {...({} )}
                      name="salaryCurrency"
                      placeholder="Currency"
                      options={currencyOptions}
                      value={currencyOptions.find((o) => {
                        const curr = Currency[o.value];
                        return curr?.symbol === landingPageData?.salaryCurrency;
                      })}
                      onChange={(e) => {
                        const selectedCurrency = Currency[e.value];
                        console.log("selectedCurrency", selectedCurrency);
                        handleChange("salaryCurrency", selectedCurrency.symbol);
                      }}
                      className="w-full !rounded-[10px] border h-[44px] sm:w-full sm:pr-5"
                      onMouseEnter={() => setHoveredField("salaryCurrency")}
                      onMouseLeave={() => setHoveredField(null)}
                      onFocus={() => {
                        setLastScrollToSection(null)
                      }}
                    />
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>

            {/* Hours Range */}
            <Collapse
              size="small"
              ghost
              bordered={false}
              className="mt-2 !pb-0 w-full "
              activeKey={activeKeys}
              onChange={(keys) => {
                setActiveKeys(typeof keys === "string" ? [keys] : keys || []);
              }}
            >
              <Collapse.Panel
                showArrow={false}
                className="border-none"
                header={
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-900_01  !text-blue_gray-700 font-medium text-xs lgr:text-sm ">
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
                key="hoursRange"
              >
                <div className="flex flex-col col-span-2 gap-2 mt-5 w-full">
                  <div className="flex gap-5 justify-between items-center">
                    <Text as="p" className="self-end !text-blue_gray-700">
                      Hours
                    </Text>
                    <div className="flex gap-2">
                      <Text
                        as="p"
                        className="!font-normal !text-blue_gray-700_01"
                      >
                        Range
                      </Text>
                      <Switch
                        checked={isHoursRange}
                        onChange={(checked) => {
                          setIsHoursRange(checked);
                          handleChange("hoursRange", checked);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-4 w-full">
                    <div className="flex gap-2 justify-between items-center w-full">
                      <Input
                        shape="round"
                        {...({} )}
                        name="hoursMin"
                        placeholder="Min"
                        value={landingPageData?.hoursMin || "32"}
                        onInput={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          handleChange("hoursMin", value);
                        }}
                        className="!w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 text-sm"
                        onMouseEnter={() => setHoveredField("hoursMin")}
                        onMouseLeave={() => setHoveredField(null)}
                        ref={setFocusRef("hoursMin")}
                        onFocus={() => {
                          setLastScrollToSection(null)
                        }}
                      />
                      <SelectBox
                        shape="round"
                        {...({} )}
                        name="hoursUnit"
                        placeholder="Unit"
                        options={hoursUnitOptions}
                        value={hoursUnitOptions.find(
                          (o) => o.value === landingPageData?.hoursUnit
                        )}
                        onChange={(e) => handleChange("hoursUnit", e.value)}
                        className="w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 text-sm"
                        onMouseEnter={() => setHoveredField("hoursUnit")}
                        onMouseLeave={() => setHoveredField(null)}
                        ref={setFocusRef("hoursUnit")}
                        onFocus={() => {
                          setLastScrollToSection(null)
                        }}
                      />
                    </div>
                    {isHoursRange && (
                      <Input
                        shape="round"
                        {...({} )}
                        name="hoursMax"
                        placeholder="Max"
                        value={landingPageData?.hoursMax || ""}
                        onInput={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          handleChange("hoursMax", value);
                        }}
                        className="border border-solid border-blue_gray-100 sm:pr-5"
                        onMouseEnter={() => setHoveredField("hoursMax")}
                        onMouseLeave={() => setHoveredField(null)}
                        ref={setFocusRef("hoursMax")}
                        onFocus={() => {
                          setLastScrollToSection(null)
                        }}
                      />
                    )}
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>

            {/* Location */}
            <Collapse
              size="small"
              ghost
              bordered={false}
              className="mt-2 !pb-0 w-full "
              activeKey={activeKeys}
              onChange={(keys) => {
                setActiveKeys(typeof keys === "string" ? [keys] : keys || []);
              }}
            >
              <Collapse.Panel
                showArrow={false}
                className="border-none"
                header={
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-900_01 font-inter !text-blue_gray-700 text-xs lgr:text-sm font-medium">
                      Location
                    </span>
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
                key="location"
              >
                <div className="flex flex-col col-span-2 gap-2 mt-5 w-full">
                  <div className="flex gap-5 justify-start">
                    <div className="flex gap-2">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Remote
                      </Text>
                      <Switch
                        checked={isRemote}
                        onChange={handleRemoteChange}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Hybrid
                      </Text>
                      <Switch
                        checked={isHybrid}
                        onChange={handleHybridChange}
                      />
                    </div>
                  </div>
                  {!isRemote && (
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch
                      placeholder="Select or type to add location"
                      options={locationOptions}
                      value={selectedLocations || []}
                      onChange={handleLocationChange}
                      onSearch={setSearchText}
                      className="w-full border ring-0 outline-none focus:outline-none sm:w-full sm:pr-5"
                      dropdownRender={dropdownRender}
                      onMouseEnter={() => setHoveredField("location")}
                      optionRender={optionRender}
                      onMouseLeave={() => setHoveredField(null)}
                      ref={setFocusRef("location")}
                      filterOption={(input, option) =>
                        option && typeof option.label === "string"
                          ? option.label
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          : false
                      }
                    />
                  )}
                </div>
              </Collapse.Panel>
            </Collapse>

            {/* Image */}
            <div
              onMouseEnter={() => setHoveredField("heroImage")}
              onMouseLeave={() => setHoveredField(null)}
              className="flex flex-col col-span-2 gap-2 mt-5 w-full px-2"
            >
              <label as="p" className="self-start !text-blue_gray-700">
                Image
              </label>
              {/* @ts-ignore */}
              <ImageUploader
                defaultImage={landingPageData?.heroImage}
                imageAdjustments={landingPageData?.imageAdjustment || {}}
                fieldKey="heroImage"
                isSettingDisabled={false}
                onImageUpload={(url) => {
                  handleChange("heroImage", url);
                  document.dispatchEvent(new CustomEvent("HANDLE.CHANGED"));
                }}
                onImageAdjustmentChange={(fieldKey, adjustments) => {
                  setLandingPageData((d) => ({
                    ...d,
                    imageAdjustment: {
                      ...(d.imageAdjustment || {}),
                      [fieldKey]: adjustments,
                    },
                  }));
                  document.dispatchEvent(new CustomEvent("HANDLE.CHANGED"));
                }}
                allowedTabs={["image"]}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

const JobDescriptionEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "jobDescriptionTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "jobDescriptionSubheader",
            label: "Subheader",
            max: 80,
          },
          {
            key: "jobDescription",
            label: "Body Text",
            max: 2000,
            rows: 10,
            textarea: true,
          },
          {
            key: "jobDescriptionImage",
            label: "Image",
            type: "image",
            accept: "image/*"
          },
        ]}
      />
    </>
  );
};

const JobSpecificationEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          { key: "jobSpecificationTitle", label: "Header", max: 40 },
          { key: "jobSpecificationDescription", label: "Subheader", max: 80 },

          {
            key: "specifications",
            label: "Specifications",
            type: "bulletList",
            newItemValue: {
              title: "",
              description: "",
              enabled: true,
              bulletPoints: [],
            },
            array: [
              {
                key: "title",
                label: "Title",
                max: 20,
              },
              {
                key: "description",
                label: "Description",
                max: 40,
              },
              {
                key: "icon",
                label: "Icon",
                type: "icon",
              },
              {
                key: "bulletPoints",
                label: "Bullet Points",
                enabled: true,
                type: "bullets",
                bulletPoints: [
                  {
                    key: "bullet",
                    label: "Bullet",
                    max: 100,
                  },
                ],
              },
            ],
            diabledListChange: true,
          },
        ]}
      />
    </>
  );
};

const CompanyFactsEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "companyFactsTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "companyFactsDescription",
            label: "Subheader",
            max: 120,
          },

          {
            key: "companyFacts",
            label: "Facts",
            max: 2,
            array: [
              {
                key: "icon",
                label: "Icon",
                type: "icon",
              },
              {
                key: "headingText",
                label: "Title",
                max: 25,
              },
              {
                key: "descriptionText",
                label: "Description",
                max: 80,
              },
            ],
          },
        ]}
      />
    </>
  );
};

const PhotosEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "photoTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "photoText",
            label: "Subheader",
            max: 120,
          },
          {
            key: "photoImages",
            label: "Images (up to 12 images)",
            type: "image",
            accept: "image/*",
            multiple: true,
            maxFiles: 12,
          },
        ]}
      />
    </>
  );
};

const RecruiterContactEdit = (props) => {
  const { setFocusRef, handleItemClick } = useFocusContext();

  useEffect(() => {
    if (props.focusKey) {
      handleItemClick(props.focusKey);
    }
  }, [props.focusKey, handleItemClick]);

  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "recruiterContactTitle",
            label: "Header",
            max: 40,
            ref: setFocusRef("recruiterContactTitle"),
          },
          {
            key: "recruiterContactText",
            label: "Subheader",
            max: 120,
            textarea: true,
            ref: setFocusRef("recruiterContactText"),
          },
          {
            key: "recruiters",
            label: "Recruiters",
            max: 120,
            array: [
              {
                key: "recruiterFullname",
                label: "Name",
                max: 50,
                halfWidth: true,

                // ref: setFocusRef("recruiterFullname"),
              },
              {
                key: "recruiterRole",
                label: "Job Title",
                max: 50,
                halfWidth: true,
                // ref: setFocusRef("recruiterRole"),
              },
              {
                key: "recruiterPhone",
                label: "Phone",
                max: 20,
                halfWidth: true,
                toggle: true,
                toggleKey: "recruiterPhoneEnabled",
                // ref: setFocusRef("recruiterPhone"),
              },
              {
                key: "recruiterEmail",
                label: "Email",
                max: 50,
                halfWidth: true,
                toggle: true,
                toggleKey: "recruiterEmailEnabled",
                // ref: setFocusRef("recruiterEmail"),
              },
              {
                key: "recruiterAvatar",
                label: "Image",
                type: "image",

                // ref: setFocusRef("recruiterAvatar"),
              },
            ].map((item, dx) => {
              console.log(`${item.key}[${dx}]`);
              return {
                ...item,
                ref: setFocusRef(`${item.key}[${dx}]`),
              };
            }),

            maxArrayLength: 3,
          },
        ]}
      />
    </>
  );
};

const TextBoxEdit = (props) => {
  return (
    <>
      <EditorRender
        {...props}
        items={[
          {
            key: "textBoxTitle",
            label: "Header",
            max: 40,
          },
          {
            key: "textBoxText",
            label: "Subheader",
            max: 120,
          },
          {
            key: "textBoxDescription",
            label: "Body Text",
            max: 400,
            textarea: true,
          },
          {
            key: "textBoxImage",
            label: "Image",
            type: "image",
          },
        ]}
      />
    </>
  );
};

export {
  AboutCompanyEdit,
  LeaderIntroductionEdit,
  VideoEdit,
  AgendaEdit,
  CandidateProcessEdit,
  EVPMissionEdit,
  EmployerTestimonialEdit,
  FooterEdit,
  GrowthPathEdit,
  HeroSectionEdit,
  JobDescriptionEdit,
  JobSpecificationEdit,
  CompanyFactsEdit,
  PhotosEdit,
  RecruiterContactEdit,
  TextBoxEdit,
};
