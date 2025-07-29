import React, { useState } from "react";
import HeroSection from "./Landingpage/HeroSection.js";
import JobSpecification from "./Landingpage/JobSpecification.js";
import RecruiterContact from "./Landingpage/RecruiterContact.js";
import NavBar from "./Landingpage/NavBar.jsx";
import { renderSection } from "./LandingpageEdit/renderSection.js";
import Footer from "./Landingpage/Footer.js";
// Default colors for the template
const DEFAULT_COLORS = {
  primaryColor: "#2e9eac",
  secondaryColor: "#e1ce11",
  tertiaryColor: "#44b566",
};
//
const TestBranding = () => {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample landing page data with templateId set to "x" to use our new template
  const [landingPageData, setLandingPageData] = useState({
    department: "",
    published: true,
    timeRequirement: "",
    form: {
      title: "Application Form",
      description: "Please fill out the form below to apply.",
      submitText: "Submit Application",
      fields: [],
    },
    formIntroductionText:
      "Welcome! Great to have you with us today. You can start your application here. This won't take more than a minute.",
    formSubText: "Please click next to fill out your details.",
    formSuccessMessage: "Application submitted successfully!",
    formErrorMessage: "Failed to submit application",
    vacancyStages: [],
    companyName: "Air Max Dn8",
    companyUrl: "https://www.nike.com/in/",
    companyInfo: "Inspiring the world's athletes.",
    companyLogo: "https://logo.clearbit.com/www.nike.com",
    primaryColor: "#26B0C6",
    secondaryColor: "#F7E733",
    tertiaryColor: "#44b566",
    selectedFont: {
      family: "Poppins-Bold",
      src: "https://res.cloudinary.com/dvq0ouupb/raw/upload/v1742388170/fmo1ye9nswzixvzglc6v.ttf",
    },
    unpublishedAt: null,
    publishedAt: null,
    menuItems: [
      {
        key: "Job Specifications",
      },
      {
        key: "Recruiter Contact",
      },
      {
        key: "Job Description",
      },
      {
        key: "Agenda",
      },
      {
        key: "Company Facts",
      },
      {
        key: "About The Company",
      },
      {
        key: "Employee Testimonials",
      },
      {
        key: "Leader Introduction",
      },
      {
        key: "Candidate Process",
      },
      {
        key: "Growth Path",
      },
      {
        key: "EVP / Mission",
      },
      {
        key: "Image Carousel",
      },
      {
        key: "Video",
      },
      {
        key: "Text Box",
      },
    ],
    currentPath: 1,
    templateId: "1",
    createdWithText: "Created with HireLab",
    vacancyTitle: "Senior Director, Customer Leadershipfea",
    heroDescription:
      "Join Coca-Cola as a Senior Director and lead strategic customer relationships in the foodservice sector.",
    heroImage: "/images3/img_hero_section.png",
    salaryRange: true,
    salaryMin: "169000",
    salaryMax: "196000",
    salaryCurrency: "USD",
    salaryTime: "Year",
    hoursRange: true,
    hoursMin: "40",
    hoursMax: "50",
    hoursUnit: "Monthly",
    location: ["Irvine, California", "Southern California", "Denver, CO"],
    jobSpecificationTitle: "Job Sepcifications ",
    jobSpecificationDescription:
      "Key details about the Senior Director position",
    specifications: [
      {
        title: "Benefits",
        description: "What we offer",
        bulletPoints: [
          {
            bullet: "Comprehensive medical benefits",
          },
          {
            bullet: "Performance-based annual incentives",
          },
          {
            bullet: "Continuous learning and development opportunities",
          },
        ],
        enabled: true,
        icon: "Archive",
      },
      {
        title: "Tasks",
        description: "Your responsibilities",
        bulletPoints: [
          {
            bullet: "Lead a team of account professionals across regions",
          },
          {
            bullet: "Build strategic relationships with key customers",
          },
          {
            bullet: "Coach and develop sales talent",
          },
          {
            bullet: "",
          },
        ],
        enabled: true,
        undefined: {
          title: "Tasks",
          description: "Your responsibilities",
          bulletPoints: [
            {
              bullet: "Lead a team of account professionals across regions",
            },
            {
              bullet: "Build strategic relationships with key customers",
            },
            {
              bullet: "Coach and develop sales talent",
            },
            {
              bullet: "",
            },
          ],
          enabled: true,
        },
      },
      {
        title: "Requirements",
        description: "What you need",
        bulletPoints: [
          {
            bullet: "Bachelor's degree (MBA preferred)",
          },
          {
            bullet: "5+ years in consumer goods industry",
          },
          {
            bullet: "3+ years managing professional sales teams",
          },
        ],
        enabled: true,
      },
    ],
    recruiterContactTitle: "adfe azef",
    recruiterContactText:
      "Interested in this position? Reach out to our recruitment team.",
    recruiters: [
      {
        recruiterFullname: "Recruitment Team",
        recruiterRole: "HR Team",
        recruiterEmail: "careers@coca-cola.com",
        recruiterPhone: "+1 (800) 241-2653",
        recruiterPhoneEnabled: true,
        recruiterEmailEnabled: true,
      },
      {
        fullname: "",
        role: "",
        rating: 5,
        comment: "",
        avatar: "/dhwise-images/placeholder.png",
        recruiterFullname: "Jhon ",
        recruiterRole: "doe",
        recruiterPhoneEnabled: true,
        recruiterEmailEnabled: true,
        recruiterPhone: "5551231234",
        recruiterEmail: "x@recruiter.com",
      },
    ],
    jobDescriptionTitle: "About the Job ffeaz",
    jobDescriptionSubheader: "",
    jobDescription:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin fwords, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.fes',
    agendaTitle: "A Day in the Life",
    agendaDescription:
      "Here's what a typical day looks like for our Senior Directors",
    companyFactsTitle: "Coca-Cola Factsfeafas fde",
    companyFactsDescription: "Learn what makes Coca-Cola a great place to work",
    companyFacts: [
      {
        descriptionText: "Over 130 years of innovation and growth",
        headingText: "Established",
        icon: "Clock",
        _id: {
          $oid: "67de5d014f6e12e06def70d1",
        },
      },
      {
        descriptionText: "Presence in over 200 countries worldwide",
        headingText: "Global Reach",
        icon: "Angry",
        _id: {
          $oid: "67de5d014f6e12e06def70d2",
        },
      },
      {
        descriptionText: "Diverse portfolio of over 500 brands",
        headingText: "Brand Variety",
        icon: "AlignVerticalDistributeCenter",
        _id: {
          $oid: "67de5d014f6e12e06def70d3",
        },
      },
    ],
    aboutTheCompanyTitle: "About Coca-Cola",
    aboutTheCompanyText: "Refreshing the world since 1886",
    aboutTheCompanyDescription:
      "Coca-Cola is a leading beverage company specializing in refreshing drinks and innovative solutions. Our mission is to refresh the world and make a difference through our diverse portfolio of brands and products. We believe in fostering an inclusive culture that nurt",
    aboutTheCompanyImages: [
      "https://res.cloudinary.com/dvq0ouupb/image/upload/v1742677743/hnwxyed70fstbgxi2ic6.png",
      "https://res.cloudinary.com/dvq0ouupb/image/upload/v1742677744/t66x46og7fdvgr7qfev0.png",
      "https://res.cloudinary.com/dvq0ouupb/image/upload/v1742677744/vodzywddpb38v85htyx6.png",
      "https://res.cloudinary.com/dvq0ouupb/image/upload/v1742677744/ludcwnf7xejx3us0mvbq.png",
      "https://res.cloudinary.com/dvq0ouupb/image/upload/v1742677744/dwthy7o3gcgril2t53th.png",
    ],
    footerTitle: "Ready to join our team?",
    footerDescription:
      "Apply today and take the next step in your career with Coca-Cola.",
    ctaFooterTitle: "Apply Now",
    ctaFooterLink:
      "https://careers.coca-colacompany.com/job/21709296/senior-director-customer-leadership-foodservice-irvine-ca/",
    similarJobsTitle: "You may also like",
    cta1Title: "Share",
    cta2Title: "Apply now",
    cta1Link: "#share",
    cta2Link: "#apply",
    ctaApply: "Apply now",
    testimonialTitle: "Testimonials",
    testimonialSubheader: "Testimonials",
    leaderIntroductionTitle: "Meet Our CEO",
    leaderIntroductionDescription:
      "With the Core App development team we are on our way to become the worlds user friendliest consumer app for job connections with employers. We are just missing one person. You!",
    leaderIntroductionFullname: "John Doe",
    leaderIntroductionJobTitle: "John Doe",
    leaderIntroductionAvatar: "",
    photoTitle: "Image caroossel section",
    photoText:
      "Our company is a forward-thinking technology company specializing in AI-driven automation solutions designed to streamline business operations and elevate customer experiences.",
    photoImages: [],
    evpMissionTitle: "EVP / Missionf",
    evpMissionDescription: "EVP / Missionfeza",
    evpMissionFullname: "John Doexzeaf",
    evpMissionCompanyName: "John Doefezafza",
    evpMissionAvatar:
      "https://res.cloudinary.com/dvq0ouupb/image/upload/v1738169592/mwkfw1zhiktnb9aandui.jpg",
    candidateProcessTitle: "Our application process",
    candidateProcessDescription:
      "Understanding the Candidate Process: Navigating the Path to Success",
    growthPathTitle: "Growth path",
    growthPathDescription: "Take a glimpse of how your career could progress.",
    videoTitle: "Interview tips",
    videoDescription: "Mastering the Interview: Essential Tips for Success",
    myVideo: "",
    videoAutoPlay: false,
    textBoxTitle: "Discover our company??",
    textBoxText: "We are proud and loud we put our employee first.",
    textBoxDescription:
      "With the Core App development team we are on our way to become the worlds user friendliest consumer app for job connections with employers. We are just missing one person. You!",
    textBoxImage:
      "https://res.cloudinary.com/dvq0ouupb/image/upload/v1743035714/ulkmydjsn7ekdfywnejn.png",
    testimonials: [
      {
        comment:
          "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling. I feel valued as an employee and am proud to be part of a team that consistently strives for excellence. It's truly a rewarding and inspiring environment.",
        fullname: "John Doe",
        role: "CEO",
        avatar: "",
        avatarEnabled: true,
        _id: {
          $oid: "67de5d014f6e12e06def70d4",
        },
      },
      {
        comment:
          "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling. I feel valued as an employee and am proud to be part of a team that consistently strives for excellence. It's truly a rewarding and inspiring environment.",
        fullname: "John Doe",
        role: "CEO",
        avatar: "",
        avatarEnabled: true,
        _id: {
          $oid: "67de5d014f6e12e06def70d5",
        },
      },
    ],
    candidateProcess: [
      {
        candidateProcessText: "Submit Application",
        candidateProcessIcon: "/images3/img_lock.svg",
        _id: {
          $oid: "67de5d014f6e12e06def70d6",
        },
      },
      {
        candidateProcessText: "Screening",
        candidateProcessIcon: "/images3/img_screen_search_desktop.svg",
        _id: {
          $oid: "67de5d014f6e12e06def70d7",
        },
      },
      {
        candidateProcessText: "Interview",
        candidateProcessIcon: "/images3/img_partner_exchange.svg",
        _id: {
          $oid: "67de5d014f6e12e06def70d8",
        },
      },
      {
        candidateProcessText: "Offer",
        candidateProcessIcon: "/images3/img_television.svg",
        _id: {
          $oid: "67de5d014f6e12e06def70d9",
        },
      },
    ],
    growthPath: [
      {
        title: "Entry-Level path",
        description: "",
        icon: "AlarmClockPlus",
        _id: {
          $oid: "67de5d014f6e12e06def70da",
        },
      },
      {
        title: "Mid-Level path",
        description: "",
        icon: "AlarmClockCheck",
        _id: {
          $oid: "67de5d014f6e12e06def70db",
        },
      },
      {
        title: "Senior-Level path",
        description: "",
        icon: "Activity",
        _id: {
          $oid: "67de5d014f6e12e06def70dc",
        },
      },
      {
        title: "Executive-Level path",
        description: "",
        icon: "ArrowDown",
        _id: {
          $oid: "67de5d014f6e12e06def70dd",
        },
      },
    ],
    createdAt: {
      $date: "2025-03-22T06:47:29.901Z",
    },
    updatedAt: {
      $date: "2025-03-27T00:35:26.622Z",
    },
    __v: 0,
    dailyScheduleList: [
      {
        dateTimeSlot: {
          startTime: "04:00",
          endTime: "07:00",
          _id: {
            $oid: "67e38d8a54086e5fe61c2662",
          },
        },
        eventTitle: "Morning Check-In & Team Sync",
        description: "Morning Check-In & Team Sync",
        _id: {
          $oid: "67e38aafc000ff73a7fe55db",
        },
      },
      {
        dateTimeSlot: {
          startTime: "07:00",
          endTime: "11:00",
          _id: {
            $oid: "67e38d8a54086e5fe61c2665",
          },
        },
        eventTitle: "Review Project Timelines & Milestones",
        description: "",
        _id: {
          $oid: "67e38aafc000ff73a7fe55dd",
        },
      },
      {
        dateTimeSlot: {
          startTime: "",
          endTime: "",
          _id: {
            $oid: "67e38d8a54086e5fe61c2668",
          },
        },
        eventTitle: "Lunch Break",
        description: "Lunch Break",
        _id: {
          $oid: "67e38aafc000ff73a7fe55df",
        },
      },
      {
        dateTimeSlot: {
          startTime: "",
          endTime: "",
          _id: {
            $oid: "67e38d8a54086e5fe61c266b",
          },
        },
        eventTitle: "Budget Review & Resource Allocation",
        description: "Budget Review & Resource Allocation",
        _id: {
          $oid: "67e38aafc000ff73a7fe55e1",
        },
      },
    ],
  });

  // Function to update a specific color
  const updateColor = (colorType, value) => {
    setLandingPageData((prev) => ({
      ...prev,
      [colorType]: value,
    }));
  };

  // Reset colors to defaults
  const resetColors = () => {
    setLandingPageData((prev) => ({
      ...prev,
      primaryColor: DEFAULT_COLORS.primaryColor,
      secondaryColor: DEFAULT_COLORS.secondaryColor,
      tertiaryColor: DEFAULT_COLORS.tertiaryColor,
    }));
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchData = () => {};
  return (
    <div className="relative test-branding-page">
      <NavBar landingPageData={landingPageData} onClickApply={() => {}} />

      <HeroSection landingPageData={landingPageData} fetchData={() => {}} />

      {(landingPageData?.menuItems ?? [])?.map((section, idx) =>
        renderSection({ section, landingPageData, fetchData, key: idx })
      )}

      <Footer landingPageData={landingPageData} fetchData={fetchData} />

      <div className="container p-8 mx-auto bg-white">
        <h2 className="mb-4 text-2xl font-bold">Template X Test Page</h2>
        <p className="mb-4">
          This page demonstrates the new Template X with the hero section, job
          specification, and recruiter contact sections styled according to the
          design.
        </p>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="mb-2 font-bold">Current Template Colors:</h3>
          <ul className="pl-5 list-disc">
            <li>Primary: {landingPageData.primaryColor}</li>
            <li>Secondary: {landingPageData.secondaryColor}</li>
            <li>Tertiary: {landingPageData.tertiaryColor}</li>
            <li>Neutral: #757575</li>
            <li>Background: #1a3e4c</li>
            <li>Navigation Background: #1a4a5c</li>
          </ul>
        </div>
      </div>

      {/* Floating button to open color picker */}
      <button
        onClick={toggleModal}
        className="fixed right-6 bottom-6 p-4 text-white rounded-full shadow-lg"
        style={{ backgroundColor: landingPageData.primaryColor }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>

      {/* Color picker modal */}
      {isModalOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 w-96 bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Customize Template Colors</h3>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Primary Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={landingPageData.primaryColor}
                    onChange={(e) =>
                      updateColor("primaryColor", e.target.value)
                    }
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={landingPageData.primaryColor}
                    onChange={(e) =>
                      updateColor("primaryColor", e.target.value)
                    }
                    className="flex-1 p-2 rounded border"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Secondary Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={landingPageData.secondaryColor}
                    onChange={(e) =>
                      updateColor("secondaryColor", e.target.value)
                    }
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={landingPageData.secondaryColor}
                    onChange={(e) =>
                      updateColor("secondaryColor", e.target.value)
                    }
                    className="flex-1 p-2 rounded border"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Tertiary Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={landingPageData.tertiaryColor}
                    onChange={(e) =>
                      updateColor("tertiaryColor", e.target.value)
                    }
                    className="flex-1 p-2 rounded border"
                  />
                  <input
                    type="text"
                    value={landingPageData.tertiaryColor}
                    onChange={(e) =>
                      updateColor("tertiaryColor", e.target.value)
                    }
                    className="flex-1 p-2 rounded border"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={resetColors}
                  className="py-2 w-1/2 text-white bg-gray-500 rounded hover:bg-gray-600"
                >
                  Reset Colors
                </button>
                <button
                  onClick={toggleModal}
                  className="py-2 w-1/2 text-white rounded"
                  style={{ backgroundColor: landingPageData.primaryColor }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestBranding;
