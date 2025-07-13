import React, {
  Suspense,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { Heading, Text } from "./components/index.jsx";
import ScheduleOverview1 from "./components/ScheduleOverview1/index.jsx";
import ScheduleOverview from "./components/ScheduleOverview/index.jsx";
import Calendar from "react-calendar";

// import { ReactComponent as Dotted2Agenda } from "../../assets/img/dotted2Agenda.svg";
// import { ReactComponent as DottedAgenda } from "../../assets/img/dottedAgenda.svg";
// Placeholder SVG components for Next.js
const Dotted2Agenda = ({ className, style }) => (
  <div className={className} style={style}>
    <svg width="50" height="50" viewBox="0 0 50 50" fill="currentColor">
      <circle cx="5" cy="5" r="2"/>
      <circle cx="15" cy="5" r="2"/>
      <circle cx="25" cy="5" r="2"/>
      <circle cx="35" cy="5" r="2"/>
      <circle cx="45" cy="5" r="2"/>
      <circle cx="5" cy="15" r="2"/>
      <circle cx="15" cy="15" r="2"/>
      <circle cx="25" cy="15" r="2"/>
      <circle cx="35" cy="15" r="2"/>
      <circle cx="45" cy="15" r="2"/>
    </svg>
  </div>
);
const DottedAgenda = ({ className, style }) => (
  <div className={className} style={style}>
    <svg width="50" height="50" viewBox="0 0 50 50" fill="currentColor">
      <circle cx="10" cy="10" r="2"/>
      <circle cx="20" cy="10" r="2"/>
      <circle cx="30" cy="10" r="2"/>
      <circle cx="40" cy="10" r="2"/>
      <circle cx="10" cy="20" r="2"/>
      <circle cx="20" cy="20" r="2"/>
      <circle cx="30" cy="20" r="2"/>
      <circle cx="40" cy="20" r="2"/>
    </svg>
  </div>
);
import { useSelector } from "react-redux";
import { getThemeData } from "../../utils/destructureTheme.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import {
  Calendar as CalendarIcon,
  CheckSquare,
  Sun,
  DollarSign,
  FileText,
} from "lucide-react";
import { useFocusContext } from "../../contexts/FocusContext.js";
import { useRouter } from "next/router";
import { useHover } from "../../contexts/HoverContext.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
import { Divider } from "antd";
import { GridPattern } from "./HeroSection.js";

const Template2 = ({ landingPageData, fetchData, setLandingPageData }) => {
  const [dailyScheduleList, setDailyScheduleList] = useState(
    landingPageData?.dailyScheduleList || []
  );

  useEffect(() => {
    setDailyScheduleList(landingPageData?.dailyScheduleList);
  }, [dailyScheduleList, landingPageData, setLandingPageData]);

  const themeData = getThemeData(landingPageData?.theme);

  const { basePrimary, baseSecondary, baseTertiary } = themeData;
  const { variantPl1, variantPl2, variantPl3, variantPl4 } = themeData;
  const { variantPd1, variantPd2, variantPd3, variantPd4, variantPd5 } =
    themeData;
  const { variantSl1, variantSl2, variantSl3, variantSl4 } = themeData;
  const { variantSd1, variantSd2, variantSd3, variantSd4, variantSd5 } =
    themeData;
  const { variantTl1, variantTl2, variantTl3, variantTl4 } = themeData;
  const { variantTd1, variantTd2, variantTd3, variantTd4, variantTd5 } =
    themeData;
  const { textHeadingColor, textSubHeadingColor } = themeData;

  return (
    <>
      <div>
        <div className="relative" style={{ backgroundColor: variantPl3 }}>
          <div className="hidden absolute md:block">
            <DottedAgenda
              className="w-50 h-50"
              style={{ backgroundColor: variantPl3 }}
            />
          </div>
          <div className="flex flex-col gap-3.5 items-center px-14 py-2 d-none mdx:px-5">
            <Heading
              as="h2"
              className="text-[36px] font-semibold tracking-[-0.72px] text-[#000] mdx:text-[34px] smx:text-[32px]"
              style={{ color: variantPd5 }}
            >
              {landingPageData?.agendaTitle}
            </Heading>
            <Text
              size="text_xl_regular"
              as="p"
              className="text-[20px] font-normal text-[#000]"
              style={{ color: variantPd5 }}
            >
              {landingPageData?.agendaDescription}
            </Text>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="w-full">
              <div className="sm:w-full  text-black-900 p-5 pb-[70px]">
                <div className="bg-white md:w-[75%] mx-auto relative">
                  <div className="bg-white" style={{ zIndex: 9999 }}>
                    <Suspense fallback={<div>Loading feed...</div>}>
                      <ScheduleOverview dailyScheduleList={dailyScheduleList} />
                    </Suspense>
                  </div>

                  <div
                    className="flex absolute justify-end"
                    style={{
                      zIndex: -1,
                      bottom: "-14%",
                      right: "-5%",
                    }}
                  >
                    <Dotted2Agenda className="text-blue-500 w-50 h-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Template3 = ({ landingPageData, fetchData, setLandingPageData }) => {
  const themeData = getThemeData(landingPageData?.theme);

  const { basePrimary, baseSecondary, baseTertiary } = themeData;
  const { variantPl1, variantPl2, variantPl3, variantPl4 } = themeData;
  const { variantPd1, variantPd2, variantPd3, variantPd4, variantPd5 } =
    themeData;
  const { variantSl1, variantSl2, variantSl3, variantSl4 } = themeData;
  const { variantSd1, variantSd2, variantSd3, variantSd4, variantSd5 } =
    themeData;
  const { variantTl1, variantTl2, variantTl3, variantTl4 } = themeData;
  const { variantTd1, variantTd2, variantTd3, variantTd4, variantTd5 } =
    themeData;
  const { textHeadingColor, textSubHeadingColor } = themeData;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [dailyScheduleList, setDailyScheduleList] = useState(
    landingPageData?.dailyScheduleList || []
  );

  useEffect(() => {
    const filtered =
      (dailyScheduleList &&
        dailyScheduleList?.filter((item) => {
          const startDate = new Date(item?.dateTimeSlot?.startDate);
          const endDate = new Date(item?.dateTimeSlot?.endDate);
          const formattedSelectedDate = new Date(selectedDate);

          const normalizedStartDate = new Date(startDate.setHours(0, 0, 0, 0));
          const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
          const normalizedSelectedDate = new Date(
            formattedSelectedDate.setHours(0, 0, 0, 0)
          );

          return (
            (normalizedSelectedDate >= normalizedStartDate &&
              normalizedSelectedDate <= normalizedEndDate) ||
            normalizedSelectedDate.getTime() ===
              normalizedStartDate.getTime() ||
            normalizedSelectedDate.getTime() === normalizedEndDate.getTime()
          );
        })) ||
      [];

    setFilteredSchedule(filtered);
  }, [selectedDate, dailyScheduleList, landingPageData, setLandingPageData]);
  const allTimeSlots = dailyScheduleList?.map((item) => {
    const { startDate, endDate } = item.dateTimeSlot;
    return `from: ${startDate} to ${endDate}`;
  });


  return (
    <>
      <div>
        <div
          className="pb-4"
          style={{
            backgroundColor: variantPl4,
            color: textHeadingColor,
          }}
        >
          <div className="pt-6 pb-3 text-center">
            <Heading
              as="h2"
              className="text-[36px] font-semibold tracking-[-0.72px]  mdx:text-[34px] smx:text-[32px]"
              style={{ color: variantPd4 }}
            >
              {landingPageData?.agendaTitle}
            </Heading>
            <Text
              size="text_xl_regular"
              as="p"
              className="text-[20px] font-normal "
              style={{ color: variantPd4 }}
            >
              {landingPageData?.agendaDescription}
            </Text>
          </div>

          <div className="flex flex-col py-4 md:flex-row">
            <div className="flex justify-center items-center px-6 w-full md:w-2/5">
              <div className="px-6 py-2">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  className="text-white shadow-lg react-calendar"
                />
              </div>
            </div>

            <div className="w-full md:w-3/5">
              <div className="sm:w-full text-black-900">
                <Suspense fallback={<div>Loading feed...</div>}>
                  <ScheduleOverview1
                    filteredSchedule={landingPageData.dailyScheduleList}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Create a custom hook for agenda hover effects
const useAgendaHover = () => {
  const {
    hoveredField,
    scrollToSection,
    setLastScrollToSection,
    lastScrollToSection,
  } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  // Object to store agenda item refs
  const agendaItemRefs = useRef({});

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      agendaTitle: titleRef,
      agendaDescription: descriptionRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    // Clear highlights from agenda item elements
    Object.values(agendaItemRefs.current).forEach((ref) => {
      if (ref) {
        ref.classList.remove("highlight-section");
      }
    });

    // Handle regular fields
    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
      return;
    }

    // Handle agenda item fields - use exact hoveredField as key
    if (agendaItemRefs.current[hoveredField]) {
      agendaItemRefs.current[hoveredField].classList.add("highlight-section");
    }
  }, [hoveredField]);

  useEffect(() => {
    if (
      scrollToSection === "agenda" &&
      sectionRef.current &&
      lastScrollToSection !== "agenda"
    ) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setLastScrollToSection("agenda");
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    descriptionRef,
    agendaItemRefs,
  };
};

const Template1 = ({ landingPageData, fetchData, setLandingPageData }) => {
  const router = useRouter();
  const currentPath = router.pathname?.split("/")[1];
  const { handleItemClick } = useFocusContext();
  const { hoveredField } = useHover();

  // Use our custom hook for hover effects
  const { sectionRef, titleRef, descriptionRef, agendaItemRefs } =
    useAgendaHover();

  // Extract colors for dependency tracking
  const primaryColor = landingPageData?.primaryColor || "#26B0C6";
  const secondaryColor = landingPageData?.secondaryColor || "#F7E733";
  const tertiaryColor = landingPageData?.tertiaryColor || "#44b566";

  // Use our template palette hook with the default colors
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#26B0C6",
      secondaryColor: "#F7E733",
      tertiaryColor: "#44b566",
    },
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Default agenda items if no schedule is provided
  const defaultAgendaItems = [
    {
      timeRange: "9:00 AM - 10:00 AM",
      title: "Morning Check-In & Team Sync",
      description: "Team updates and announcements",
      icon: (
        <CalendarIcon
          className="w-5 h-5"
          style={{ color: getColor("secondary", 500) }}
        />
      ),
      accentColor: getColor("secondary", 500),
    },
    {
      timeRange: "10:00 AM - 1:00 PM",
      title: "Review Project Timelines & Milestones",
      description:
        "Discuss current project progress against established timelines",
      icon: (
        <CheckSquare
          className="w-5 h-5"
          style={{ color: getColor("tertiary", 500) }}
        />
      ),
      accentColor: getColor("tertiary", 500),
    },
    {
      timeRange: "1:00 PM - 2:00 PM",
      title: "Lunch Break",
      description: "Break for lunch time",
      icon: (
        <Sun
          className="w-5 h-5"
          style={{ color: getColor("secondary", 500) }}
        />
      ),
      accentColor: getColor("secondary", 500),
    },
    {
      timeRange: "2:00 PM - 5:30 PM",
      title: "Budget Review & Resource Allocation",
      description: "Review current project budget expenditures.",
      icon: (
        <DollarSign
          className="w-5 h-5"
          style={{ color: getColor("tertiary", 500) }}
        />
      ),
      accentColor: getColor("tertiary", 500),
    },
    {
      timeRange: "5:30 PM - 6:00 PM",
      title: "End-of-Day Wrap-Up",
      description: "Summarize key decisions and action items.",
      icon: (
        <FileText
          className="w-5 h-5"
          style={{ color: getColor("secondary", 500) }}
        />
      ),
      accentColor: getColor("secondary", 500),
    },
  ];

  // Map dailyScheduleList to our agenda format if available
  // Updated to handle simplified time slots without dates
  const textColor = calculateTextColor(getColor("primary", 100));
  const agendaItems =
    landingPageData?.dailyScheduleList?.length > 0
      ? landingPageData.dailyScheduleList.map((item, index) => {
          const icons = [
            <CalendarIcon
              className="w-5 h-5"
              style={{ color: getColor("secondary", 500) }}
            />,
            <CheckSquare
              className="w-5 h-5"
              style={{ color: getColor("tertiary", 500) }}
            />,
            <Sun
              className="w-5 h-5"
              style={{ color: getColor("secondary", 500) }}
            />,
            <DollarSign
              className="w-5 h-5"
              style={{ color: getColor("tertiary", 500) }}
            />,
            <FileText
              className="w-5 h-5"
              style={{ color: getColor("secondary", 500) }}
            />,
          ];

          // Alternate accent colors
          const accentColors = [
            getColor("secondary", 500),
            getColor("tertiary", 500),
          ];

          // Use simplified time format from the updated dateTimeSlot structure
          const startTime = item.dateTimeSlot?.startTime || "9:00";
          const endTime = item.dateTimeSlot?.endTime || "10:00";

          return {
            timeRange: `${startTime} - ${endTime}`,
            title: item.eventTitle || `Agenda Item ${index + 1}`,
            description: item.description || "No description provided",
            icon: icons[index % icons.length],
            accentColor: accentColors[index % accentColors.length],
            originalIndex: index, // Keep track of the original index for reference
          };
        })
      : defaultAgendaItems;

  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);

  // Stabilize GridPattern props to prevent flickering
  const gridPatternProps = useMemo(() => {
    // Get stable color values by directly using the color values instead of getColor function
    const tertiaryColor300 = landingPageData?.tertiaryColor || "#44b566";
    const tertiaryColor50 = `${tertiaryColor300}20`; // Add light transparency
    
    return {
      gridColor: `${tertiaryColor300}80`, // Semi-transparent tertiary color
      gridLineColor: tertiaryColor50,
      backgroundColor: "transparent",
      gridSize: 50,
      // Use a stable key based on the actual color values to prevent unnecessary re-renders
      key: `agenda-${tertiaryColor300}`
    };
  }, [landingPageData?.tertiaryColor]);

  // Create a memoized GridPattern component to prevent re-renders
  const MemoizedGridPattern = useMemo(() => (
    <GridPattern
      key={gridPatternProps.key}
      gridColor={gridPatternProps.gridColor}
      gridLineColor={gridPatternProps.gridLineColor}
      backgroundColor={gridPatternProps.backgroundColor}
      gridSize={gridPatternProps.gridSize}
    />
  ), [gridPatternProps]);

  return (
    <div
      id="agenda"
      ref={sectionRef}
      className="px-4 py-16 w-full bg-white  md:px-8 relative h-fit isolate"
      style={{
        color: "black",
        fontFamily: bodyFont?.family,
      }}
    >
    
      
      <div className="mx-auto max-w-3xl relative">
        <div className="mb-8 text-center">
          <h2
            ref={titleRef}
            onClick={() => handleItemClick("agendaTitle")}
            className="mb-2 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: subheaderFont?.family }}
          >
            {landingPageData?.agendaTitle || "Typical Day"}
          </h2>
          <h3
            ref={descriptionRef}
            onClick={() => handleItemClick("agendaDescription")}
            className=""
            style={{ fontFamily: subheaderFont?.family }}
            dangerouslySetInnerHTML={{
              __html: landingPageData?.agendaDescription ||
                "Take a glimpse of how your day might look like."
            }}
          >
          </h3> 
        </div>

        {/* Agenda Items */}
        <div className="space-y-4 relative">
        {MemoizedGridPattern}
          {agendaItems.map((item, index) => {
            const originalIndex =
              item.originalIndex !== undefined ? item.originalIndex : index;
            return (
              <div
                key={index}
                className="flex overflow-hidden relative items-start  mx-auto"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "4px 68px 68px 24px rgba(103, 171, 179, 0.05)",
                  borderRadius: "24px",
                  padding: "20px 32px 28px 32px",
                  height: "188px",
                  maxWidth: "636px",
                }}
              >
                {/* Accent Bar */}
                <div
                  className="absolute top-[20%] h-[62px] -translate-x-1/2 left-0 w-4 rounded-full"
                  style={{ backgroundColor: item.accentColor }}
                ></div>

                <div className="flex-1 pl-3 space-y-5">
                  <div
                    ref={(el) => {
                      agendaItemRefs.current[
                        `dailyScheduleList[${originalIndex}].dateTimeSlot`
                      ] = el;
                    }}
                    onClick={() =>
                      handleItemClick(
                        `dailyScheduleList[${originalIndex}].dateTimeSlot`
                      )
                    }
                    className="mb-1 text-md "
                    style={{
                      width: "fit-content",
                      background: "#FAFAFA",
                      padding: "6px 8px",
                      borderRadius: "16px",
                      fontFamily: bodyFont?.family,
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {item.timeRange}
                  </div>
                  <h3
                    ref={(el) => {
                      agendaItemRefs.current[
                        `dailyScheduleList[${originalIndex}].eventTitle`
                      ] = el;
                    }}
                    onClick={() =>
                      handleItemClick(
                        `dailyScheduleList[${originalIndex}].eventTitle`
                      )
                    }
                    className="mb-1 font-semibold text-base"
                    style={{ color: "#1a3e4c" }}
                  >
                    {item.title}
                  </h3>
                  <Divider />
                  <p
                    ref={(el) => {
                      agendaItemRefs.current[
                        `dailyScheduleList[${originalIndex}].description`
                      ] = el;
                    }}
                    onClick={() =>
                      handleItemClick(
                        `dailyScheduleList[${originalIndex}].description`
                      )
                    }
                    style={{
                      height: 'auto',
                      overflow: 'visible'
                    }}
                    className="text-sm text-gray-600"
                  >
                    {item.description}
                  </p>
                </div>

                <div className="flex-shrink-0 p-2 ml-4 bg-gray-100 rounded-full">
                  {item.icon}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Agenda = (props) => {
  console.log("propsAgenda", props);
  if (props?.landingPageData?.templateId?.toLowerCase() === "3")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

//   function GridPattern({
//   gridColor = "#64a5b3",
//   gridLineColor = "#e5e5e5",
//   backgroundColor = "white",
//   gridSize = 30,
//   maxWidth = 850,
//   density = 0.3,
//   className = "",
//   style = {},
// }) {
//   const canvasRef = useRef(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     const resizeCanvas = () => {
//       const parent = canvas.parentElement
//       if (!parent) return

//       const { width, height } = parent.getBoundingClientRect()
//       canvas.width = width
//       canvas.height = height

//       drawPattern(ctx, width, height)
//     }

//     const drawPattern = (ctx, width, height) => {
//       // Clear canvas and set background
//       ctx.fillStyle = backgroundColor
//       ctx.fillRect(0, 0, width, height)

//       // Calculate the actual width to use (constrained by maxWidth)
//       const patternWidth = Math.min(width, maxWidth)

//       // Calculate the left offset to center the pattern
//       const leftOffset = Math.floor((width - patternWidth) / 2)

//       // Calculate grid dimensions
//       const cols = Math.ceil(patternWidth / gridSize)
//       const rows = Math.ceil(height / gridSize)

//       // Calculate the actual right edge of the pattern
//       const rightEdge = leftOffset + patternWidth

//       // Draw grid lines with fade effect
//       ctx.strokeStyle = gridLineColor
//       ctx.lineWidth = 0.5 // Thin line width

//       // Vertical lines with horizontal fade - ONLY within the maxWidth
//       for (let x = 0; x <= cols; x++) {
//         const xPos = leftOffset + x * gridSize

//         // Skip if outside the pattern width
//         if (xPos < leftOffset || xPos > rightEdge) continue

//         // Calculate fade factor based on position within the pattern width
//         const relativeX = x / cols // 0 at left edge, 1 at right edge
//         const distanceFromCenter = Math.abs(relativeX - 0.5) * 2 // 0 at center, 1 at edges

//         // Stronger fade at edges
//         const fadeFactorH = Math.max(0, 1 - distanceFromCenter * 1.8)

//         ctx.beginPath()
//         ctx.globalAlpha = 0.6 * fadeFactorH // Increased from 0.4 to 0.6
//         ctx.moveTo(xPos, 0)
//         ctx.lineTo(xPos, height)
//         ctx.stroke()
//       }

//       // Horizontal lines with vertical fade - ONLY within the maxWidth horizontally
//       for (let y = 0; y <= rows; y++) {
//         // Calculate fade factor - stronger at top
//         const fadeFactorV = Math.max(0.3, Math.min(1, y / (rows * 0.7))) // More visible at bottom

//         ctx.beginPath()
//         ctx.globalAlpha = 0.6 * fadeFactorV // Increased from 0.4 to 0.6
//         ctx.moveTo(leftOffset, y * gridSize)
//         ctx.lineTo(rightEdge, y * gridSize)
//         ctx.stroke()
//       }

//       // Reset global alpha
//       ctx.globalAlpha = 1.0

//       // Create a sparse pattern of filled cells
//       const filledCells = new Set()

//       // Calculate the row index for the middle of the container
//       // We'll only place colored squares in the bottom half
//       const middleRow = Math.floor(rows * 0.5)

//       // Fill cells with a sparse pattern, ONLY in the bottom half
//       for (let x = 0; x < cols; x++) {
//         // Only process rows in the bottom half
//         for (let y = middleRow; y < rows; y++) {
//           // Calculate horizontal fade factor (cells fade out at edges)
//           const relativeX = x / cols // 0 at left edge, 1 at right edge
//           const distanceFromCenter = Math.abs(relativeX - 0.5) * 2 // 0 at center, 1 at edges
//           const horizontalFadeFactor = Math.max(0, 1 - distanceFromCenter * 1.2)

//           // Calculate how far down in the bottom half we are (0 at middle, 1 at bottom)
//           const bottomHalfProgress = (y - middleRow) / (rows - middleRow)

//           // Higher probability as we go further down
//           // This creates a stacking effect with more squares at the bottom
//           const verticalFactor = 0.3 + 0.7 * bottomHalfProgress

//           // Combine factors for final probability
//           const probability = density * verticalFactor * horizontalFadeFactor * 2.5

//           if (Math.random() < probability) {
//             filledCells.add(`${x},${y}`)
//           }
//         }
//       }

//       // Draw filled cells
//       filledCells.forEach((cellKey) => {
//         const [x, y] = cellKey.split(",").map(Number)

//         // Calculate horizontal fade factor for opacity
//         const relativeX = x / cols // 0 at left edge, 1 at right edge
//         const distanceFromCenter = Math.abs(relativeX - 0.5) * 2 // 0 at center, 1 at edges
//         const horizontalFadeFactor = Math.max(0, 1 - distanceFromCenter * 1.2)

//         // Calculate opacity - slightly random but generally consistent
//         // Apply horizontal fade factor to make cells fade out at edges
//         const baseOpacity = (0.1 + 0.3 * Math.random()) * horizontalFadeFactor

//         // Fill the cell - add leftOffset to center the pattern
//         ctx.fillStyle = `${gridColor}${Math.floor(baseOpacity * 255)
//           .toString(16)
//           .padStart(2, "0")}`
//         ctx.fillRect(leftOffset + x * gridSize, y * gridSize, gridSize, gridSize)
//       })
//     }

//     // Initial draw
//     resizeCanvas()

//     // Redraw on resize
//     window.addEventListener("resize", resizeCanvas)

//     return () => {
//       window.removeEventListener("resize", resizeCanvas)
//     }
//   }, [gridColor, gridLineColor, backgroundColor, gridSize, maxWidth, density])

//   return (
//     <canvas
//       ref={canvasRef}
//       className={className}
//       style={{
//         position: "absolute",
//         top: 0,
//         left: "-50px",
//         width: "calc(100% + 50px)",
//         height: "calc(100% - 30px)",
//         ...style,
//       }}
//     />
//   )
// }
export default Agenda;
