import { MapPin, DollarSign, Clock } from "lucide-react";
// src\pages\Dashboard\Vacancies\components\VacanciesCard\TemplatePreviews\JobCard.jsx
import useTemplatePalette from "../../../../../../../../pages/hooks/useTemplatePalette";


export default function JobCard({ landingPageData }) {
  // Destructure landingPageData with fallbacks
  const {
    vacancyTitle = "Project Manager",
    company = "HireLab",
    heroDescription = "Are you a dynamic and experienced project manager...",
    location = "Offenbach",
    salary = "$2,500",
    salaryPeriod = "month",
    hours = "7 Hours",
    hoursPeriod = "daily",
    heroImage = "/placeholder.svg",
    primaryColor = "#44b566",
    secondaryColor = "#e1ce11",
    tertiaryColor = "#e1ce11",
  } = landingPageData || {};

  // Call the palette hook
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#2e9eac",
      secondaryColor: "#e1ce11",
      tertiaryColor: "#44b566",
    },
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  const backgroundColor = getColor("primary", 500);
console.log("backgroundddddddddddddddddddColor", backgroundColor);


  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-lg shadow-md"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
        color: "white",
        backgroundImage: `url(/assets/Hero_Banner_Transparent_grid.svg)`,
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3">
        <div className="font-semibold text-xs">{company}</div>
        <div className="flex gap-1">
          <button className="px-2 py-1 text-[10px] border border-white/20 rounded-full text-white/80 hover:bg-white/10 transition">
            Share
          </button>
          <button
            className="px-2 py-1 text-[10px] font-medium rounded-full transition"
            style={{ backgroundColor: getColor("secondaryColor"), color: "#000" }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col px-3 text-center relative">
        <span className="text-[10px] mb-1">👋 WE'RE HIRING</span>
        <h2 className="text-base font-bold leading-tight truncate mb-2">{vacancyTitle}</h2>
        <p className="text-white/80 text-[8px] leading-snug line-clamp-3 mb-3">
          {heroDescription.substring(0, 35)}
        </p>

        {/* Image and Badges */}
        <div className="relative flex-1 w-full overflow-hidden rounded-lg">
          <img
            src={heroImage}
            alt={vacancyTitle}
            style={{
              borderRadius: "30px 30px 0 0",
              borderColor: getColor("primaryColor"),
              borderWidth: "2px",
              borderStyle: "solid",
            }}
            className="w-1/2 h-[120px] object-cover rounded-[30px] rounded-b-none mx-auto"
          />

          {/* Badges */}
          {salary && (
            <div className="absolute top-3 left-3">
              <Badge icon={<DollarSign size={8} />} text={`${salary} / ${salaryPeriod}`} primaryColor={getColor("primaryColor")} />
            </div>
          )}
          {location && (
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <Badge icon={<MapPin size={8} />} text={location} primaryColor={getColor("primaryColor")} />
            </div>
          )}
          {hours && (
            <div className="absolute top-[10px] right-3 transform -translate-y-1/2">
              <Badge icon={<Clock size={8} />} text={`${hours} / ${hoursPeriod}`} primaryColor={getColor("primaryColor")} />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="absolute bottom-0 w-full">
        <div
          className="flex justify-center items-center gap-2 p-0.5 mb-1 overflow-x-auto text-[8px] mx-3 rounded-sm bg-black/20 shadow-sm"
          style={{ backgroundColor: getColor("primaryColor") }}
        >
          {["Summary", "Contacts", "Description", "About Us", "Company Facts"].map((tab, index) => (
            <a
              key={index}
              href={`#${tab.toLowerCase().replace(" ", "-")}`}
              className={`whitespace-nowrap ${
                index === 0 ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {tab}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, text, primaryColor }) {
  return (
    <div
      className="flex items-center gap-1 p-[2px] rounded-md border border-white/10 text-[10px]"
      style={{
        background: "linear-gradient(270deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 100%)",
        backdropFilter: "blur(34px)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-md p-[2px]"
        style={{ backgroundColor: primaryColor }}
      >
        {icon}
      </div>
      <span className="truncate text-[4px]">{text}</span>
    </div>
  );
}
