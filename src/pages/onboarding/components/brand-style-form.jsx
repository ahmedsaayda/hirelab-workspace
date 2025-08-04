import React, { useState, useRef, useEffect, useCallback } from "react";
import ColorThief from "colorthief";
import { WandSparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { Skeleton } from 'antd';

import {
  Input,
  Button,
  Upload,
  Select,
  Typography,
  message,
  Modal,
  UploadProps,
  Radio,
  Checkbox,
  Spin,
} from "antd";
import { PlusOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { ColorPicker } from "./color-picker.jsx";
import scraperService from "../../../services/ScraperService.js";
import AuthService from "../../../services/AuthService.js";
import HeroSection from "../../Landingpage/HeroSection.js";
import NavBar from "../../Landingpage/NavBar.jsx";
import { renderSection } from "../../LandingpageEdit/renderSection.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors.js";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "../../Landingpage/Footer.js";
import { ChartPieIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  Paintbrush,
  FileSpreadsheet,
  Star,
  Layers,
  Globe,
  PenTool,
  Plus,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import ThemeChooser from "./ThemeChooser.jsx";
import ImageUploader from "../../LandingpageEdit/ImageUploader.js";
const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;



import { useDispatch } from "react-redux";
import {
  setBaseColors,
  setTextColors,
} from "../../../redux/landingPage/themeActions.js";
import { login } from "../../../redux/auth/actions.js";
import { store } from "../../../redux/store.js";
import { ColorPicker as AntColorPicker, Space } from "antd";
// hirelab-frontend\src\pages\onboarding\components\brand-style-form.jsx
// hirelab-frontend\src\pages\Dashboard\Vacancies\components\Header\index.jsx
import { Heading, Img } from "../../Dashboard/Vacancies/components/components/index.jsx";
import { LayoutTemplate } from "lucide-react";
import CrudService from "../../../services/CrudService.js";
import ColorPickerButton from "./ColorPickerButton.jsx";
import PublicService from "../../../services/PublicService.js";
import { generateColorPalette } from "../../../utils/colors-util.js";
import { ScrapingModal } from "./ScrapingAnimation/ScrapingModal.jsx";
import { Content } from "antd/es/layout/layout";
import { PreviewContainer } from "../../Dashboard/Vacancies/components/preview-container.jsx";

const cloudname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
export const defaultLandingPageData = {
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
  companyUrl: "https://www.comanysite.com/in/",
  companyInfo: "Inspiring the world's athletes.",
  companyLogo: " ",
  primaryColor: "#26B0C6",
  secondaryColor: "#F7E733",
  tertiaryColor: "#44b566",
  yiqThreshold: 128,
  metaPixelId: "",
  selectedFont: {
    family: "Poppins-Bold",
    src: "https://res.cloudinary.com/dvq0ouupb/raw/upload/v1742388170/fmo1ye9nswzixvzglc6v.ttf",
  },
  titleFont: {
    family: "Poppins-Bold",
    src: "https://res.cloudinary.com/dvq0ouupb/raw/upload/v1742388170/fmo1ye9nswzixvzglc6v.ttf",
  },
  subheaderFont: {
    family: "Poppins-Medium",
    src: "https://res.cloudinary.com/dvq0ouupb/raw/upload/v1742388170/fmo1ye9nswzixvzglc6v.ttf",
  },
  bodyFont: {
    family: "Poppins-Regular",
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
  vacancyTitle: "Senior Director Customer Leadership",
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
  jobSpecificationDescription: "Key details about the Senior Director position",
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
      candidateProcessIcon: "Send",
      _id: {
        $oid: "67de5d014f6e12e06def70d6",
      },
    },
    {
      candidateProcessText: "Screening",
      candidateProcessIcon: "ScreenShare",
      _id: {
        $oid: "67de5d014f6e12e06def70d7",
      },
    },
    {
      candidateProcessText: "Interview",
      candidateProcessIcon: "Users",
      _id: {
        $oid: "67de5d014f6e12e06def70d8",
      },
    },
    {
      candidateProcessText: "Offer",
      candidateProcessIcon: "Handshake",
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
};

/**
 * Generates a harmonious color scheme based on color theory principles
 * @param primaryHex - The primary color in hex format (e.g., "#5207cd")
 * @returns A color scheme with primary, secondary, tertiary, and heroBackground colors
 */
function generateColorScheme(primaryHex) {
  // Convert hex to HSL for easier manipulation
  const hexToHSL = (hex) => {
    hex = hex.replace(/^#/, "");

    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16) / 255;
      g = parseInt(hex[1] + hex[1], 16) / 255;
      b = parseInt(hex[2] + hex[2], 16) / 255;
    } else {
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    }

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h *= 60;
    }

    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  };

  // Convert HSL to hex
  const hslToHex = (h, s, l) => {
    h = h % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    if (s === 0) {
      const val = Math.round(l * 255);
      return `#${val.toString(16).padStart(2, "0").repeat(3)}`;
    }

    const hueToRgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = Math.round(hueToRgb(p, q, h / 360 + 1 / 3) * 255);
    const g = Math.round(hueToRgb(p, q, h / 360) * 255);
    const b = Math.round(hueToRgb(p, q, h / 360 - 1 / 3) * 255);

    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  };

  // Calculate perceived brightness for contrast checking
  const getPerceivedBrightness = (hex) => {
    const rgb = hex
      .replace(/^#/, "")
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16));
    return (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) / 255;
  };

  // Extract HSL from primary color
  const [h, s, l] = hexToHSL(primaryHex);

  // Identify color temperature and characteristics
  const isVibrant = s > 70;
  const isLight = l > 70;
  const isDark = l < 30;
  const isNeutral = s < 20;

  // Determine color category more precisely
  let colorCategory;
  if (isDark && s < 15) {
    colorCategory = "near-black";
  } else if (isLight && s < 15) {
    colorCategory = "near-white";
  } else if ((h >= 0 && h <= 12) || (h >= 345 && h <= 360)) {
    colorCategory = "red";
  } else if (h > 12 && h <= 45) {
    colorCategory = "orange";
  } else if (h > 45 && h <= 70) {
    colorCategory = "yellow";
  } else if (h > 70 && h <= 150) {
    colorCategory = "green";
  } else if (h > 150 && h <= 200) {
    colorCategory = "cyan";
  } else if (h > 200 && h <= 260) {
    colorCategory = "blue";
  } else if (h > 260 && h <= 290) {
    colorCategory = "purple";
  } else if (h > 290 && h <= 345) {
    colorCategory = "magenta";
  }

  // Generate secondary color based on 60-30-10 design principle
  // Using complementary colors for higher contrast
  let secondaryHue;
  let secondaryS;
  let secondaryL;

  if (colorCategory === "near-black") {
    // For dark colors, create a lighter complementary
    secondaryHue = (h + 180) % 360;
    secondaryS = Math.min(70, Math.max(s + 10, 30));
    secondaryL = Math.min(85, Math.max(l + 45, 60));
  } else if (colorCategory === "near-white") {
    // For light colors, create a darker complementary
    secondaryHue = (h + 180) % 360;
    secondaryS = Math.min(90, Math.max(s + 30, 40));
    secondaryL = Math.max(25, l - 40);
  } else if (colorCategory === "red" || colorCategory === "orange") {
    // For warm colors, use a cool complementary
    secondaryHue = (h + 180) % 360;
    secondaryS = Math.min(s, 80);
    secondaryL = isLight ? Math.max(25, l - 30) : Math.min(85, l + 30);
  } else if (colorCategory === "blue" || colorCategory === "cyan") {
    // For cool colors, use a warm accent
    secondaryHue = (h + 30) % 360;
    secondaryS = Math.min(s + 10, 85);
    secondaryL = isLight ? Math.max(30, l - 25) : Math.min(80, l + 25);
  } else {
    // Default complementary relationship
    secondaryHue = (h + 180) % 360;
    secondaryS = Math.min(s + 5, 80);
    secondaryL = isLight ? Math.max(30, l - 30) : Math.min(80, l + 30);
  }

  // Generate tertiary color as an accent
  // Usually using split-complementary or analogous approach
  let tertiaryHue;
  let tertiaryS;
  let tertiaryL;

  if (isVibrant) {
    // For vibrant colors, use a more muted tertiary
    tertiaryHue = (h + 90) % 360;
    tertiaryS = Math.max(s - 30, 20);
    tertiaryL = isLight ? Math.max(20, l - 20) : Math.min(90, l + 20);
  } else if (isNeutral) {
    // For neutral colors, use a more saturated tertiary
    tertiaryHue = (h + 60) % 360;
    tertiaryS = Math.min(s + 40, 70);
    tertiaryL = isLight ? Math.max(30, l - 25) : Math.min(85, l + 25);
  } else {
    // Default tertiary - analogous relationship
    tertiaryHue = (h + 30) % 360;
    tertiaryS = Math.min(s, 75);
    tertiaryL = Math.min(85, Math.max(30, isLight ? l - 15 : l + 15));
  }

  // Background generation - especially for hero sections
  // Using more subdued versions of primary
  let bgHue = h;
  let bgS;
  let bgL;

  const primaryBrightness = getPerceivedBrightness(primaryHex);

  if (isVibrant) {
    // For vibrant primary, use a more neutral/muted background
    bgS = Math.max(s - 50, 5);
    bgL = primaryBrightness < 0.5 ? Math.min(95, l + 55) : Math.max(10, l - 40);
  } else if (isNeutral) {
    // For neutral primary, slightly shift hue for interest
    bgHue = (h + 10) % 360;
    bgS = Math.min(15, s);
    bgL = primaryBrightness < 0.5 ? 95 : 10;
  } else if (isDark) {
    // For dark primary, create light background
    bgS = Math.min(15, s);
    bgL = 95;
  } else if (isLight) {
    // For light primary, create darker background
    bgS = Math.min(30, s);
    bgL = 15;
  } else {
    // Default - subtle variation of primary
    bgS = Math.max(s - 40, 10);
    bgL = primaryBrightness < 0.5 ? 90 : 15;
  }

  // Generate the color values using our calculated HSL values
  const primary = primaryHex;
  const secondary = hslToHex(secondaryHue, secondaryS, secondaryL);
  const tertiary = hslToHex(tertiaryHue, tertiaryS, tertiaryL);
  const heroBackground = hslToHex(bgHue, bgS, bgL);

  // Ensure text will be readable on hero background
  const heroTextBrightness = getPerceivedBrightness(heroBackground);
  // Choose text color that contrasts with the hero background
  const heroTitleColor =
    heroTextBrightness > 0.5
      ? hslToHex(h, Math.min(s + 10, 90), 25)
      : hslToHex(h, 10, 95);

  // Final contrast check and adjustment to ensure all colors work well together
  const ensureColorDifference = (
    color1,
    color2,
    minDifference = 0.25
  ) => {
    const brightness1 = getPerceivedBrightness(color1);
    const brightness2 = getPerceivedBrightness(color2);

    if (Math.abs(brightness1 - brightness2) < minDifference) {
      const [h, s, l] = hexToHSL(color2);
      if (brightness1 > 0.5) {
        return hslToHex(h, s, Math.max(5, l - 25));
      } else {
        return hslToHex(h, s, Math.min(95, l + 25));
      }
    }
    return color2;
  };

  // Apply contrast adjustments
  const adjustedSecondary = ensureColorDifference(primary, secondary);
  const adjustedTertiary = ensureColorDifference(primary, tertiary);
  const finalTertiary = ensureColorDifference(
    adjustedSecondary,
    adjustedTertiary
  );

  return {
    primary,
    secondary: adjustedSecondary,
    tertiary: finalTertiary,
    heroBackground,
    heroTitleColor,
  };
}

function hexToHSL(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const color =
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getColorScheme(primaryHex) {
  const { h, s, l } = hexToHSL(primaryHex);

  // Hero background is the original
  const heroBackground = primaryHex;

  // Generate analogous or complementary colors
  const secondaryHex = HSLToHex((h + 60) % 360, s, l); // +60° for secondary
  const tertiaryHex = HSLToHex((h + 120) % 360, s, l); // +120° for tertiary

  return {
    primary: primaryHex,
    secondary: secondaryHex,
    tertiary: tertiaryHex,
    heroBackground,
    heroTitleColor: primaryHex,
  };
}

export default function BrandStyleForm() {
  const router = useRouter();;
  const dispatch = useDispatch();
  // const textColors = useSelector((state:any) => state.theme.textColors);
  const theme = useSelector((state) => state.theme);
  console.log("theme", theme);


  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [selectedColorType, setSelectedColorType] = useState("");
  const [brandColors, setBrandColors] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [fonts, setFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState("");
  const [titleFont, setTitleFont] = useState("");
  const [subheaderFont, setSubheaderFont] = useState("");
  const [bodyFont, setBodyFont] = useState("");
  const [selectedFontStyle, setSelectedFontStyle] = useState("h1"); // Default to H1
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [tertiaryColor, setTertiaryColor] = useState("");
  const [heroBackgroundColor, setHeroBackgroundColor] = useState("");
  const [yiqThreshold, setYiqThreshold] = useState(128);
  const [Scraping, setScraping] = useState(false);
  const [scrapeMessages, setScrapeMessages] = useState([]);
  const [landingPageData, setLandingPageData] = useState(
    defaultLandingPageData
  );
  console.log("landingPageData", landingPageData);
  const user = useSelector(selectUser);
  console.log("user", user);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { title: "Brand Assets", icon: <Paintbrush size={18} /> },
    { title: "Style Guide", icon: <PenTool size={16} /> },
    { title: "Company Info", icon: <Globe size={18} /> },
  ];
  const [progress, setProgress] = useState(0);
  const exampleBrands = [
    {
      name: "Nike",
      domain: "nike.com",
      logo: "https://logo.clearbit.com/nike.com",
    },
    {
      name: "Rains",
      domain: "rains.com",
      logo: "https://logo.clearbit.com/rains.com",
    },
    {
      name: "Pacha",
      domain: "pacha.com",
      logo: "https://logo.clearbit.com/pacha.com",
    },
    {
      name: "Airbnb",
      domain: "airbnb.com",
      logo: "https://logo.clearbit.com/airbnb.com",
    },
    {
      name: "Slack",
      domain: "slack.com",
      logo: "https://logo.clearbit.com/slack.com",
    },
  ];

  const modalRef = useRef(null);

  const [errors, setErrors] = useState({
    companyName: "",
    companyUrl: "",
    companyInfo: "",
    companyLogo: "",
    brandColors: "",
    primaryColor: "",
    secondaryColor: "",
    tertiaryColor: "",
    heroBackgroundColor: "",
    selectedFont: "",
    titleFont: "",
    subheaderFont: "",
    bodyFont: "",
  });
  const [templateMenu, setTemplateMenu] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("1");
  const [hasLoadedAndSetup, setHasLoadedAndSetup] = useState(false);
  const [heroTitleColor, setHeroTitleColor] = useState("");
  const lpId = "67de5d014f6e12e06def70ca";
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [googleFonts, setGoogleFonts] = useState([]);
  const [isLoadingFonts, setIsLoadingFonts] = useState(false);
  const [fontCategories, setFontCategories] = useState({});
  console.log("fontCategories", fontCategories);
    const [vacancyLenth, setVacancyLenth] = useState(0)
  const [fullscreen, setFullscreen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showCompanyInfoSkeleton, setShowCompanyInfoSkeleton] = useState(false);

  const fetchData = useCallback(() => {
    if (lpId) {
      PublicService.getLP(lpId).then((res) => {
        console.log("res", res);
        if (res.data?.lp) setLandingPageData(res.data.lp);
      });
    }
  }, [lpId]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLandingPageData((prevData) => ({
      ...prevData,
      theme: theme,
    }));
  }, [theme]);

  const handleNext = () => {
    // Validate current step before proceeding
    switch (currentStep) {
      case 1:
        if (!companyLogo) {
          message.error("Please upload company logo");
          return;
        }
        break;
      case 3:
        if (!companyName?.trim() || !companyUrl?.trim() || !companyInfo?.trim()) {
          message.error("Please fill all required fields");
          return;
        }
        break;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  

  // const handleBack = () => {
  //   if (currentStep === 1) {
  //     router.push("/dashboard");
  //   } else {
  //     setCurrentStep((prev) => Math.max(prev - 1, 1));
  //   }
  // };

   const handleBack = () => {
    if (currentStep === 1) {
      setShowModal(true);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

   const handleSkip = () => {
    setShowModal(false);
    // Navigate to dashboard
    router.push("/dashboard");
  };
const handleContinue = () => {
    setShowModal(false);
    // Continue onboarding (stay at step 1 or whatever you want)
    setCurrentStep(1);
  };

  const handleBrandClick = (domain) => {
    setCompanyUrl(domain);
    handleScrape(domain); // immediately start scraping
  };

  useEffect(() => {
    setLandingPageData((prevData) => ({
      ...prevData,
      templateId: selectedTemplateId,
    }));
  }, [selectedTemplateId]);

  // Update landing page data when company name or info changes
  useEffect(() => {
    if (companyName && companyName.trim() !== '') {
      setLandingPageData((prevData) => ({
        ...prevData,
        heroDescription: `Join ${companyName} as a Senior Director and lead strategic customer relationships in the foodservice sector.`,
        companyFactsTitle: `${companyName} Facts`,
        companyFactsDescription: `Learn what makes ${companyName} a great place to work`,
        aboutTheCompanyTitle: `About ${companyName}`,
        aboutTheCompanyText: `Leading innovation since founded`,
        aboutTheCompanyDescription: companyInfo || `${companyName} is a leading company specializing in innovative solutions. Our mission is to make a difference through our diverse portfolio of products and services. We believe in fostering an inclusive culture that nurtures talent and drives success.`,
        footerDescription: `Apply today and take the next step in your career with ${companyName}.`,
        ctaFooterLink: companyUrl ? `https://${companyUrl.replace(/^www\./, '').split('/')[0]}/careers` : prevData.ctaFooterLink,
        recruiters: prevData.recruiters.map((recruiter, index) => {
          if (index === 0) {
            return {
              ...recruiter,
              recruiterEmail: companyUrl ? `careers@${companyUrl.replace(/^www\./, '').split('/')[0]}` : recruiter.recruiterEmail,
            };
          }
          return recruiter;
        }),
      }));
    } else if (companyInfo && companyInfo.trim() !== '') {
      // Update only company info if no company name is set
      setLandingPageData((prevData) => ({
        ...prevData,
        aboutTheCompanyDescription: companyInfo,
      }));
    }
  }, [companyName, companyUrl, companyInfo]);

  const handleApplyThemeToLandingPage = () => {
    // message.info("Branding Theme Applied Successfully!");
    CrudService.update("LandingPageData", user._id, {
      updateAll: true,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      tertiaryColor: tertiaryColor,
      heroBackgroundColor: heroBackgroundColor,
      yiqThreshold: yiqThreshold,
      selectedFont: {
        family: selectedFont,
        src: fonts.find((font) => font.family === selectedFont)?.src,
      },
      titleFont: {
        family: titleFont,
        src: fonts.find((font) => font.family === titleFont)?.src,
      },
      subheaderFont: {
        family: subheaderFont,
        src: fonts.find((font) => font.family === subheaderFont)?.src,
      },
      bodyFont: {
        family: bodyFont,
        src: fonts.find((font) => font.family === bodyFont)?.src,
      },
    });
  };

  useEffect(() => {
    if (user&&!hasLoadedAndSetup) {
      setCompanyName(user.companyName);
      setCompanyUrl(user.companyUrl);
      setCompanyInfo(user.companyInfo);
      setCompanyLogo(user.companyLogo);
      setBrandColors(user.brandColors || []);
      setPrimaryColor(user.primaryColor || "");
      setSecondaryColor(user.secondaryColor || "");
      setTertiaryColor(user.tertiaryColor || "");
      setHeroBackgroundColor(
        user.heroBackgroundColor || user.primaryColor || ""
      );
      setYiqThreshold(user.yiqThreshold || 128);

      // Only set font values if they exist in user data
      if (user?.selectedFont?.family) setSelectedFont(user.selectedFont.family);
      if (user?.titleFont?.family) setTitleFont(user.titleFont.family);
      if (user?.subheaderFont?.family)
        setSubheaderFont(user.subheaderFont.family);
      if (user?.bodyFont?.family) setBodyFont(user.bodyFont.family);

      setLandingPageData((prevData) => ({
        ...prevData,
        primaryColor: user.primaryColor || "",
        secondaryColor: user.secondaryColor || "",
        tertiaryColor: user.tertiaryColor || "",
        heroBackgroundColor: user.heroBackgroundColor || user.primaryColor || "",
        yiqThreshold: user.yiqThreshold || 128,
        companyLogo: user.companyLogo ,
        selectedFont: user?.selectedFont || { family: "", src: "" },
        titleFont: user?.titleFont || { family: "", src: "" },
        subheaderFont: user?.subheaderFont || { family: "", src: "" },
        bodyFont: user?.bodyFont || { family: "", src: "" },
      }));

      if (user.primaryColor && user.secondaryColor && user.tertiaryColor) {
        dispatch(
          setBaseColors({
            primary: user.primaryColor,
            secondary: user.secondaryColor,
            tertiary: user.tertiaryColor,
            heroBackground: user.heroBackgroundColor || user.primaryColor,
          })
        );
        // dispatch(setTextColors({ heading: user.primaryColor, subHeading: user.primaryColor }));
      }
      setHasLoadedAndSetup(true);
      }
  }, [user]);


    const fetchAllDataByUser = async () => {
      try {
        // setLoading(true);
        const result = await CrudService.search("LandingPageData", 999999, 1, {
          text: "",
          filters: {
            user_id: user._id,
          },
          sort: {},
        });
        console.log("resultttt", result.data.items.length);

        setVacancyLenth(result.data.items.length)

      } catch (error) {
        console.error("Error fetching vacancies:", error);

      } 
    };

      useEffect(() => {
        fetchAllDataByUser();
      },[user])

      console.log("vacancyLenth", vacancyLenth)

  const handleColorSelect = (color) => {
    setBrandColors((colors) =>
      colors.map((c) => (c === selectedColorType ? color.toUpperCase() : c))
    );
    setIsColorPickerOpen(false);
  };

  const openColorPicker = (colorType) => {
    setSelectedColorType(colorType);
    setIsColorPickerOpen(true);
  };

  const validateForm = () => {
    if (!companyName?.trim()) {
      message.error("Please enter your company name");
      return false;
    }
    if (!companyUrl?.trim()) {
      message.error("Please enter your company URL");
      return false;
    }
    // if (!companyInfo?.trim()) {
    //   message.error("Please provide company information");
    //   return false;
    // }
    if (!companyLogo) {
      message.error("Please upload your company logo");
      return false;
    }
    // if (brandColors.length === 0) {
    //   message.error("Please add at least one brand color");
    //   return false;
    // }
    if (!primaryColor) {
      message.error("Please select a primary color");
      return false;
    }
    if (!secondaryColor) {
      message.error("Please select a secondary color");
      return false;
    }
    if (!tertiaryColor) {
      message.error("Please select a tertiary color");
      return false;
    }
    // if (!heroBackgroundColor) {
    //   message.error("Please select a hero background color");
    //   return false;
    // }
    if (!selectedFont && !titleFont) {
      message.error("Please upload or select a font for titles (H1)");
      return false;
    }
    if (!subheaderFont) {
      message.error("Please upload or select a font for subheaders (H2)");
      return false;
    }
    if (!bodyFont) {
      message.error("Please upload or select a font for body text (H3)");
      return false;
    }
    return true;
  };

  const handleSaveAndNext = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const res = await AuthService.updateMe({
        companyName,
        companyUrl,
        companyInfo,
        companyLogo,
        fonts,
        brandColors,
        primaryColor,
        secondaryColor,
        tertiaryColor,
        heroBackgroundColor,
        yiqThreshold,
        isUserFirsttime: false,
        selectedFont: {
          family: selectedFont,
          src: fonts.find((font) => font.family === selectedFont)?.src,
        },
        titleFont: {
          family: titleFont,
          src: fonts.find((font) => font.family === titleFont)?.src,
        },
        subheaderFont: {
          family: subheaderFont,
          src: fonts.find((font) => font.family === subheaderFont)?.src,
        },
        bodyFont: {
          family: bodyFont,
          src: fonts.find((font) => font.family === bodyFont)?.src,
        },
        onboardingCompleted:true
      });

      // Refresh user data in Redux store
      const me = await AuthService.me();
      if (me?.data?.me) {
        store.dispatch(login(me.data.me));
      }
     const modal = Modal.success({
    title: 'Brand Style Saved',
    content: (
      <div>
        Your brand style has been saved successfully!
        {user.isUserFirsttime && (
        <Confetti
          numberOfPieces={500}

          // @netra this is  givinng this error 
          /* Type '{ numberOfPieces; size; gravity; colors[]; style: { left; top; transform: "translate(-50%, -50%)"; }; }' is not assignable to type 'IntrinsicAttributes & Partial<IConfettiOptions> & CanvasHTMLAttributes<HTMLCanvasElement> & { ...; } & RefAttributes<...>'.
  Property 'size' does not exist on type 'IntrinsicAttributes & Partial<IConfettiOptions> & CanvasHTMLAttributes<HTMLCanvasElement> & { ...; } & RefAttributes<...> */
          // size={30}
          gravity={1}
          colors={['#FF69B4', '#FFC67D', '#8BC34A']}
           style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        />)}
      </div>
    ),
    footer: null,
    centered: true,
  });
    setTimeout(() => {
      modal.destroy(); 
    }, 2000);


    console.log("vacancyLenth", vacancyLenth)
    if (vacancyLenth === 0){
    router.push("/dashboard/vacancies?new=true");
    } else{
          router.push("/dashboard/vacancies");
    }

  } catch (error) {
    Modal.error({
      title: 'Error',
      content: 'Failed to save brand style.',
      footer: null, 
      centered: true,
  //      mask: {
  //   style: {
  //     backdropFilter: 'blur(20px)', 
  //   },
  // },
    });
    setTimeout(() => {
      Modal.destroyAll(); 
    }, 2000);
  
  }
};

  // const handleBack = () => {
  //   router.push("/dashboard");
  // };

  const handleScrape = async (domain) => {
    setScraping(true);
    setProgress(0);
    setScrapeMessages(["Starting…"]);
    // 1. Pick the incoming domain or fall back to the typed input:
    const raw = (domain ?? companyUrl)?.trim();

    // 2. Bail early if empty:
    if (!raw) {
      message.error("Please enter a company URL");
      return;
    }
    // Ensure the company URL starts with https://
    let formatedCompanyUrl = raw;

    // Handle empty URL
    if (!formatedCompanyUrl) {
      message.error("Please enter a company URL");
      return;
    }

    // Prepend 'https://' if it's not present
    if (
      !formatedCompanyUrl.startsWith("http://") &&
      !formatedCompanyUrl.startsWith("https://")
    ) {
      formatedCompanyUrl = "https://" + formatedCompanyUrl;
    }

    // Remove the 'https://' if it exists twice (e.g., 'https://https://google.com')
    if (formatedCompanyUrl.startsWith("https://https://")) {
      formatedCompanyUrl = "https://" + formatedCompanyUrl.slice(8);
    }

    // Now use the correctly formatted URL for scraping

    setScraping(true);
    setScrapeMessages(["Starting the scraping process..."]);

    try {
      setProgress(10);
      setScrapeMessages((prev) => [...prev, "Fetching website data..."]);
      const response = await scraperService.scrapeWebsiteOnboarding(
        formatedCompanyUrl
      );
      let data = response.data;
      console.log("Scraped data:", data);
      // Extract company logo first, to prioritize logo-based color extraction
      setProgress(30);

      // Only use AI enhancement if we're missing essential information
      // Note: We're now excluding brandColors from the check since we're handling that separately
      setProgress(40);
      setScrapeMessages((prev) => [...prev, "Enhancing with AI..."]);

      // Call our AI enhancement function
      data = await enhanceScrapedDataWithAI(formatedCompanyUrl, data);
      setProgress(50);
      setScrapeMessages((prev) => [...prev, "AI enhancement completed"]);

      // Extract company name
      setProgress(60);
      setScrapeMessages((prev) => [...prev, "Extracting company name..."]);
      if (data.companyName && data.companyName?.trim() !== "") {
        setCompanyName(data.companyName);
      } else {
        setScrapeMessages((prev) => [
          ...prev,
          "No company name found, using domain name...",
        ]);
        // Extract domain name as fallback
        const domain = new URL(formatedCompanyUrl).hostname.replace(
          /^www\./,
          ""
        );
        setCompanyName(
          domain.split(".")[0].charAt(0).toUpperCase() +
            domain.split(".")[0].slice(1)
        );
      }

      // Extract company information
      setProgress(70);
      setScrapeMessages((prev) => [
        ...prev,
        "Extracting company information...",
      ]);
      if (data.information && data.information?.trim() !== "") {
        setCompanyInfo(data.information);
      } else {
        setScrapeMessages((prev) => [
          ...prev,
          "No company information found, please add manually...",
        ]);
      }

      // Extract fonts
      setProgress(80);

      setProgress(100);
      setScrapeMessages((prev) => [
        ...prev,
        "Scraping completed successfully.",
      ]);
      message.success("Scraping and AI enhancement completed successfully!");
    } catch (error) {
      console.error("Scraping failed:", error);
      setScrapeMessages((prev) => [
        ...prev,
        "Scraping failed. Please try again or enter information manually.",
      ]);
      message.error(
        "Scraping failed. Please try again or enter information manually."
      );
    } finally {
      setTimeout(() => {
        setScraping(false);
        setShowCompanyInfoSkeleton(false); 
      }, 2000); 
    }
  };

 const handleOpenModal = () => {
 setIsModalOpen(true);
 setScraping(true);
 setShowCompanyInfoSkeleton(true); // Show skeleton when scan starts
 handleScrape(companyUrl);
};

const handleCancel = () => {
  setIsModalOpen(false);
  setScraping(false);
};

const handleLogoUpload = async (url) => {
  try {
    console.log("url", url)
    // Update local state
    setCompanyLogo(url);
    setLandingPageData((prevData) => ({
      ...prevData,
      companyLogo: url,
    }));

    // Save to backend
    await AuthService.updateMe({
      companyLogo: url,
    });

    // Refresh user data in Redux store
    const me = await AuthService.me();
    if (me?.data?.me) {
      store.dispatch(login(me.data.me));
    }

    message.success("Logo uploaded successfully.");
  } catch (error) {
    console.error("Error saving logo:", error);
    message.error("Failed to save logo. Please try again.");
  }
};


  const addNewColor = () => {
    setBrandColors((prevColors) => [...prevColors, "#000000"]);
    setSelectedColorType("#000000");
    setIsColorPickerOpen(true);
  };


  const enhanceScrapedDataWithAI = async (url, scrapedData) => {
    try {
      // Similar to how we use socket in PasteUrlModal
      const socket = new WebSocket(
        "wss://booklified-chat-socket.herokuapp.com"
      );

      return new Promise((resolve, reject) => {
        socket.addEventListener("open", () => {
          // Create a ping interval with correct typing for browser environment
          let pingIntervalId = window.setInterval(() => {
            socket.send(JSON.stringify({ id: "PING" }));
          }, 30000);

          // Helper function to safely clear the interval
          const clearPingInterval = () => {
            if (pingIntervalId !== null) {
              window.clearInterval(pingIntervalId);
              pingIntervalId = null;
            }
          };

          // Create prompt for AI
          const domain = new URL(url).hostname.replace(/^www\./, "");
          const companyName = scrapedData.companyName || domain.split(".")[0];

          const prompt = `
            I need information about a company with the website ${url}. 
            
            Here's what I've already found through web scraping:
            - Company name: ${scrapedData.companyName || "Not found"}
            - Company description: ${scrapedData.information || "Not found"}
            - Logo URL: ${scrapedData.logo || "Not found"}
            - Brand colors: ${
              scrapedData.brandColors.length
                ? scrapedData.brandColors.join(", ")
                : "None found"
            }
            - Fonts: ${
              scrapedData.fonts.length
                ? scrapedData.fonts.map((f) => f.family).join(", ")
                : "None found"
            }
            
            Please provide me with:
            1. A more accurate company name if the one I found seems incorrect or not professional or don't make sense...
            2. A professional, concise description of what the company does in maximum 200 words (but no hallucination here). A professional description of the company that would be used when creating vacancy posts that make anyone want to apply.
            3. 3 and exactly 3 from the logo you can detect the correct colors brand colors that would match their brand identity (as hex codes)
            4. 2-3 font families that would be appropriate for their brand
            
            Format your response as a valid JSON with these fields:
            - companyName
            - information (company description) Max 200 words
            - brandColors: array of hex color codes as strings if you know the colors of the brand and you think the provided colors are not correct please change them to the correct ones
            - fonts: array of font family names as strings
            
            Only return the JSON, no other text.
            If possible search the web for more information about the company.
          `;

          // Send the prompt to the AI service
          socket.send(
            JSON.stringify({
              id: "OPEN_AI_PROMPT",
              payload: {
                content: prompt,
                model: "gpt-4o-mini-2024-07-18", // Same model as in PasteUrlModal
                app_id: "hirelab",
                max_tokens: 10000,
              },
            })
          );

          // Handle messages from the socket
          socket.addEventListener("message", (event) => {
            try {
              const message = JSON.parse(event.data);

              if (message.id === "PING") {
                // Handle ping
              } else if (message.payload?.response) {
                // Parse the response
                let responseText = message.payload.response?.trim();

                // Extract JSON if it's wrapped in markdown code blocks
                if (responseText.includes("```json")) {
                  responseText = responseText
                    .replace(/```json|```/g, "")
                    ?.trim();
                }

                // Remove any text before { and after }
                const firstBrace = responseText.indexOf("{");
                const lastBrace = responseText.lastIndexOf("}");

                if (firstBrace >= 0 && lastBrace >= 0) {
                  responseText = responseText.substring(
                    firstBrace,
                    lastBrace + 1
                  );
                }

                try {
                  const enhancedData = JSON.parse(responseText);

                  // Merge the enhanced data with our scraped data
                  const result = {
                    ...scrapedData,
                    companyName:
                      enhancedData.companyName || scrapedData.companyName,
                    information:
                      enhancedData.information || scrapedData.information,
                  };

                  // Convert font names to the expected format
                  if (enhancedData.fonts && enhancedData.fonts.length > 0) {
                    result.fonts = enhancedData.fonts.map((fontName) => ({
                      family: fontName,
                      src: "",
                    }));
                  }

                  // Add brand colors if we got them
                  if (
                    enhancedData.brandColors &&
                    enhancedData.brandColors.length > 0
                  ) {
                    result.brandColors = enhancedData.brandColors.map(
                      (color) =>
                        color.startsWith("#")
                          ? color.toUpperCase()
                          : `#${color.toUpperCase()}`
                    );
                  }

                  // Clean up and resolve
                  clearPingInterval();
                  socket.close();
                  resolve(result);
                } catch (jsonError) {
                  console.error("Error parsing AI response:", jsonError);
                  clearPingInterval();
                  socket.close();
                  resolve(scrapedData); // Return the original data if we can't parse the AI response
                }
              }
            } catch (error) {
              console.error("Error processing WebSocket message:", error);
              clearPingInterval();
              socket.close();
              resolve(scrapedData); // Return the original data on error
            }
          });

          // Handle errors and close events
          socket.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
            clearPingInterval();
            resolve(scrapedData); // Return the original data on error
          });

          socket.addEventListener("close", () => {
            clearPingInterval();
          });

          // Set a timeout in case AI takes too long
          setTimeout(() => {
            clearPingInterval();
            if (socket.readyState === WebSocket.OPEN) {
              socket.close();
            }
            resolve(scrapedData); // Return the original data if AI takes too long
          }, 30000); // 30 second timeout
        });
      });
    } catch (error) {
      console.error("Error enhancing data with AI:", error);
      return scrapedData; // Return the original data on error
    }
  };

  const countWords = (text) => {
    return text?.trim().split(/\s+/).filter(Boolean).length;
  };

  // Function to validate word count
  const validateWordCount = (text, maxWords) => {
    const wordCount = countWords(text);
    return wordCount <= maxWords;
  };

  console.log("primaryColor");

  const handlePrimaryColorChange = (color) => {
    // const colorScheme = generateColorScheme(color);
    const colorScheme = generateColorPalette(color);
    setPrimaryColor(colorScheme.primary);
   

    setLandingPageData((prevData) => ({
      ...prevData,
      primaryColor: colorScheme.primary,

    }));
  };





  // Fetch Google Fonts
  useEffect(() => {
    setIsLoadingFonts(true);
    
    // This is using a proxy to avoid needing an API key. For production, use a proper API key from Google.
    fetch('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyAOES8EmKhuJEnsn9kS1XKBpxxp-TgN8Jc')
      .then(response => response.json())
      .then(data => {
        // Get the top 100 popular fonts
        const popularFonts = data.items.slice(0, 100);
        
        // Transform the response into the format needed
        const fontList = popularFonts.map(font => ({
          family: font.family,
          src: `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:wght@400;700&display=swap`,
          category: font.category
        }));
        
        // Group fonts by category
        const categories = {};
        fontList.forEach(font => {
          if (!categories[font.category]) {
            categories[font.category] = [];
          }
          categories[font.category].push(font);
        });
        
        setFontCategories(categories);
        setGoogleFonts(fontList);
        
        // Load web fonts for preview
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${popularFonts.map(f => `family=${f.family.replace(/ /g, '+')}:wght@400;700`).join('&')}&display=swap`;
        document.head.appendChild(link);
        
        // Merge with any existing custom fonts
        setFonts(prev => {
          const customFonts = prev.filter(f => f.family && f.src);
          return [...customFonts, ...fontList];
        });
      })
      .catch(err => {
        console.error('Error fetching Google Fonts:', err);
        message.error('Failed to load fonts. Using default fonts instead.');
      })
      .finally(() => setIsLoadingFonts(false));
  }, []);

  // Handle fullscreen mode
  if (fullscreen) {
    return (
      <div className="relative h-screen w-screen bg-white">
        {/* Floating Back Button */}
      
        
        <div className="w-full h-full">
          <Preview logo={companyLogo} landingPageData={landingPageData} fullscreen={fullscreen} setFullscreen={setFullscreen} />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* CSS to fix salary badge positioning in preview mode */}
      <style jsx global>{`
        /* Hide only the desktop absolute positioned salary container */
        .onboarding-preview-container div[class*="lg:block"][class*="absolute"][class*="-left-"][class*="w-1"][class*="h-full"] {
          display: none !important;
        }
        
        /* Keep mobile salary badges visible (they use lg:hidden) */
        .onboarding-preview-container div[class*="lg:hidden"] {
          display: flex !important;
        }
      `}</style>
      <div className="flex flex-col h-screen min-h-[600px] overflow-hidden bg-white px-4 sm:px-6 md:px-16 w-full py-4 sm:py-6">
      <div>
        <Img
            src="/images/img_arrow_right_blue_gray_400.svg"
            alt="arrowright"
            className="h-[24px] w-[24px] top-1 right-0 cursor-pointer"
            onClick={() => setShowModal(true)}
          />
        <div className="md:flex items-center justify-center w-full hidden">
         
          <div className="flex gap-4">
            {steps.map((step, index) => {
              const isActive = currentStep === index + 1;
              return (
                <div
                  key={step.title}
                  onClick={() => setCurrentStep(index + 1)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer group
                      ${isActive ? "shadow-sm" : ""}
                    `}
                >
                  {/* Icon container */}
                  <span
                    className={`flex-shrink-0 p-1 rounded-full
                      ${isActive ? "bg-blue-600 text-white" : "text-gray-400"}
                      group-hover:bg-blue-100 group-hover:text-blue-500
                    `}
                  >
                    {step.icon}
                  </span>

                  {/* Step title */}
                  <span
                    className={`text-sm font-medium
                      ${isActive ? "text-blue-600" : "text-gray-500"}
                      group-hover:text-blue-500
                    `}
                  >
                    {step.title}
                  </span>

                  {/* Completed checkmark */}
                  {currentStep > index + 1 && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white flex-1 flex flex-col overflow-hidden">
          {/* Step indicator */}
          <div className="px-6 py-4 border-b border-gray-200 flex md:hidden w-full">
            <div className="w-full">
              {/* Ṭhis commented below code will be render on the  */}
              <div className="flex items-center justify-center gap-2 w-full">
                {steps.map((step, index) => {
                  const isActive = currentStep === index + 1;
                  return (
                    <div
                      key={step.title}
                      onClick={() => setCurrentStep(index + 1)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer group
                          ${isActive ? "shadow-sm" : ""}
                        `}
                    >
                      <span
                        className={`flex-shrink-0 p-1 rounded-full
                            ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-400"
                            }
                            group-hover:bg-blue-100 group-hover:text-blue-500
                          `}
                      >
                        {step.icon}
                      </span>

                      <span
                        className={`text-sm font-medium
                          ${isActive ? "text-blue-600" : "text-gray-500"}
                          group-hover:text-blue-500
                        `}
                      >
                        {step.title}
                      </span>
                      {currentStep > index + 1 && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 py-4 lg:py-6 xl:py-8 h-full">
              {/* Left Column - Form Steps */}
              <div className="space-y-6 w-full lg:w-[30%] xl:w-[28%]">
                {/* Step 1 Content (Company Info) */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    {/* Step 1 Content (Company Info) */}
                    <div>
                      <Typography.Text className="mb-1.5 block text-sm text-gray-700">
                        Company Name
                      </Typography.Text>
                      <Input
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value?.slice?.(0,100))
                        }}
                        placeholder="Enter the name"
                        className="rounded-md border-gray-300"
                        suffix={
                          <span className="text-sm text-gray-400">{companyName?.length}/100</span>
                        }
                      />
                    </div>
                    <div>
                      <Typography.Text className="mb-1.5 block text-sm text-gray-00">
                        Company URL
                      </Typography.Text>
                      <Input
                        value={companyUrl}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Remove https:// if user pastes it
                          if (value.startsWith('https://')) {
                            value = value.substring(8);
                          } else if (value.startsWith('http://')) {
                            value = value.substring(7);
                          }
                          setCompanyUrl(value);
                        }}
                        addonBefore="https://"
                        placeholder="www.company.com"
                        className="rounded-md custom-container"
                      />
                      <Button
                        type="primary"
                        onClick={handleOpenModal}
                        className="mt-3 border-gray-300 "
                      
                      >
                       Scan Website.
                        <WandSparkles size={16} />
                      </Button>

                      {isModalOpen && (
                        <div style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 1,
                        }}>
                          <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                            width: '500px',
                            maxWidth: '90%',
                            zIndex: 2,
                          }}>
                            <ScrapingModal
                              isOpen={isModalOpen}
                              onCancel={handleCancel}
                              messages={messages}
                              progress={progress}
                            />
                            {/* {progress === 100 && handleCancel()}                         */}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                    
                      {showCompanyInfoSkeleton ? (
                    <div style={{ padding: '12px 0' }}>
                      <Skeleton active paragraph={{ rows: 4 }} />
                    </div>
                      ):!showCompanyInfoSkeleton&&!!companyInfo?  (
                        <>
                          <Typography.Text className="mb-1.5 block text-sm text-gray-700">
                        Company Information
                      </Typography.Text>
                        <TextArea
                          readOnly
                          value={companyInfo}
                          onChange={(e) => {
                            const newText = e.target.value;
                            // Only update if below word limit or if deleting text
                            if (
                              validateWordCount(newText, 200) ||
                              newText.length < companyInfo.length
                            ) {
                              setCompanyInfo(newText);
                            }
                          }}
                          placeholder="Info about the employee..."
                          className="rounded-md border-gray-300"
                          rows={8}
                          showCount={{
                            formatter: () => `${countWords(companyInfo)}/200 words`,
                          }}
                          />
                          </>
                      ):null}
                    </div>
                    {/* ... other step 1 fields ... */}
                  </div>
                )}
                {/* Step 2 Content (Brand Assets) */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    {/* Step 2 Content (Brand Assets) */}
                    <Typography.Text className="mb-1.5 block text-sm text-gray-700">
                      Upload your logo. Horizontally oriented logos display best. We recommend avoiding logos with too much white space.
                    </Typography.Text>
                    <div>
                      {/* <Upload.Dragger
                        className="bg-white rounded-md border-gray-300 border-dashed"
                        accept=".svg,.png,.jpg,.gif,.webp"
                        maxCount={1}
                        showUploadList={false}
                        beforeUpload={() => false} // Prevent default upload
                        onChange={handleLogoUpload}
                      >
                        {companyLogo ? (
                          <img
                            src={companyLogo}
                            alt="Company Logo"
                            className="max-h-40"
                          />
                        ) : (
                          <>
                            <p className="text-sm text-blue-600 hover:text-blue-800">
                              Click to upload
                            </p>
                            <p className="text-xs text-gray-500">
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">
                              SVG, PNG, JPG or GIF (max. 400x400px)
                            </p>
                          </>
                        )}
                      </Upload.Dragger> */}
                      <ImageUploader
                        maxFiles={1}
                        multiple={false}
                        defaultImage={companyLogo}
                        imageAdjustments={{}}
                        fieldKey="companyLogo"
                        onImageUpload={handleLogoUpload}
                        isSettingDisabled={false}
                        type="image"
                        accept="image/*"
                        isLogo={true}
                        currentSectionLimits={{
                          images: 1,
                          videos: 0,
                          mediaType: "image",
                        }}
                        allowedTabs={["image"]}
                        onImageAdjustmentChange={(fieldKey, adjustments) => {
                          // You can handle image adjustments here if needed
                        }}
                      />
                    </div>

                  </div>
                )}
                {/* Step 3 Content (Style Guide) */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    {/* Step 3 Content (Style Guide) */}
                    <div>
                      <Typography.Text strong className="mb-1.5 block text-md text-gray-700">
                        Text Style
                      </Typography.Text>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {/* Title Font Card */}
                        <div
                          className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedFontStyle === "h1"
                              ? "border-2 border-blue-600"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setSelectedFontStyle("h1")}
                        >
                          <div className="flex items-center">
                            <Radio
                              checked={selectedFontStyle === "h1"}
                              className="mr-2"
                            />
                            <div>
                              <Typography.Text strong className="text-gray-700">
                                Title Style
                              </Typography.Text>
                              <Typography.Text className="block text-xs text-gray-500">
                                {titleFont ? titleFont : "No font selected"}
                              </Typography.Text>
                            </div>
                          </div>
                        </div>

                        {/* Subheader Font Card */}
                        <div
                          className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedFontStyle === "h2"
                              ? "border-2 border-blue-600"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setSelectedFontStyle("h2")}
                        >
                          <div className="flex items-center">
                            <Radio
                              checked={selectedFontStyle === "h2"}
                              className="mr-2"
                            />
                            <div>
                              <Typography.Text strong className="text-gray-700">
                                H2, H3 Style
                              </Typography.Text>
                              <Typography.Text className="block text-xs text-gray-500">
                                {subheaderFont ? subheaderFont : "No font selected"}
                              </Typography.Text>
                            </div>
                          </div>
                        </div>

                        {/* Body Font Card */}
                        <div
                          className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedFontStyle === "h3"
                              ? "border-2 border-blue-600"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setSelectedFontStyle("h3")}
                        >
                          <div className="flex items-center">
                            <Radio
                              checked={selectedFontStyle === "h3"}
                              className="mr-2"
                            />
                            <div>
                              <Typography.Text strong className="text-gray-700">
                                Body Style
                              </Typography.Text>
                              <Typography.Text className="block text-xs text-gray-500">
                                {bodyFont ? bodyFont : "No font selected"}
                              </Typography.Text>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Font Selection Dropdown */}
                      <div className="mb-6">
                        {isLoadingFonts ? (
                          <div className="flex justify-center items-center py-4">
                            <Spin size="small" />
                            <span className="ml-2 text-sm text-gray-500">Loading fonts...</span>
                          </div>
                        ) : (
                          <div>
                            <div className="flex mb-2">
                              <Typography.Text strong className="text-md text-gray-700">
                                Select a font for {selectedFontStyle === "h1" ? "titles" : 
                                                  selectedFontStyle === "h2" ? "subheaders" : "body text"}
                              </Typography.Text>
                            </div>
                            
                            <Select
                              showSearch
                              value={
                                selectedFontStyle === "h1"
                                  ? titleFont
                                  : selectedFontStyle === "h2"
                                  ? subheaderFont
                                  : bodyFont
                              }
                              onChange={(value) => {
                                const selectedFont = googleFonts.find(f => f.family === value) || 
                                                    fonts.find(f => f.family === value);
                                                    
                                if (selectedFontStyle === "h1") {
                                  setTitleFont(value);
                                  setSelectedFont(value);
                                  setLandingPageData((prevData) => ({
                                    ...prevData,
                                    titleFont: {
                                      family: value,
                                      src: selectedFont?.src || "",
                                    },
                                    selectedFont: {
                                      family: value,
                                      src: selectedFont?.src || "",
                                    },
                                  }));
                                } else if (selectedFontStyle === "h2") {
                                  setSubheaderFont(value);
                                  setLandingPageData((prevData) => ({
                                    ...prevData,
                                    subheaderFont: {
                                      family: value,
                                      src: selectedFont?.src || "",
                                    },
                                  }));
                                } else {
                                  setBodyFont(value);
                                  setLandingPageData((prevData) => ({
                                    ...prevData,
                                    bodyFont: {
                                      family: value,
                                      src: selectedFont?.src || "",
                                    },
                                  }));
                                }
                              }}
                              className="w-full"
                              placeholder={`Select a font for ${
                                selectedFontStyle === "h1"
                                  ? "titles"
                                  : selectedFontStyle === "h2"
                                  ? "subheaders"
                                  : "body text"
                              }`}
                              optionLabelProp="label"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                (option?.label)
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              {Object.keys(fontCategories).map(category => (
                                <Select.OptGroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
                                  {fontCategories[category].map(font => (
                                    <Select.Option 
                                      key={font.family} 
                                      value={font.family}
                                      label={font.family}
                                    >
                                      <div style={{ fontFamily: font.family }}>
                                        {font.family}
                                      </div>
                                    </Select.Option>
                                  ))}
                                </Select.OptGroup>
                              ))}
                              
                              {fonts.filter((f) => 
                                !googleFonts.some((gf) => gf.family === f.family)).length > 0 && (
                                <Select.OptGroup label="Custom Fonts">
                                  {fonts
                                    .filter((f) => 
                                      !googleFonts.some((gf) => gf.family === f.family))
                                    .map((font) => (
                                      <Select.Option key={font.family} value={font.family} label={font.family}>
                                        <div>{font.family}</div>
                                      </Select.Option>
                                    ))}
                                </Select.OptGroup>
                              )}
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="py-4 space-y-4">
                      <div></div>
                    </div>

                    <div className="">
                      <Typography.Text strong className="mb-2 block text-md text-gray-700">
                        Color Palette 
                      </Typography.Text>
                      <div className="flex flex-wrap gap-4 justify-start items-start">
                        {/* Main color section */}
                        
                        <div className="flex gap-2 justify-center items-center">
                          <ColorPickerButton
                            label="Main"
                            color={primaryColor}
                            setColor={(color) => {
                              console.log("color", color);
                              handlePrimaryColorChange(color);
                            }}
                          />
                          <div>
                            <Typography.Text className="block text-sm text-gray-700">
                              Primary Color
                            </Typography.Text>
                            <Typography.Text className="block text-sm text-gray-700">
                              {primaryColor}
                            </Typography.Text>
                          </div>
                        </div>
                        {/* Secondary color section - manually editable */}
                        <div className="flex gap-2 justify-center items-center">
                          <ColorPickerButton
                            label="Secondary"
                            color={secondaryColor}
                            setColor={(color) => {
                              setSecondaryColor(color);
                              setLandingPageData((prevData) => ({
                                ...prevData,
                                secondaryColor: color,
                              }));
                            }}
                          />
                          <div>
                            <Typography.Text className="block text-sm text-gray-700">
                              Secondary Color
                            </Typography.Text>
                            <Typography.Text className="block text-sm text-gray-700">
                              {secondaryColor}
                            </Typography.Text>
                          </div>
                        </div>
                        {/* Tertiary color section - manually editable */}
                        <div className="flex gap-2 justify-center items-center">
                          <ColorPickerButton
                            label="Tertiary"
                            color={tertiaryColor}
                            setColor={(color) => {
                              setTertiaryColor(color);
                              setLandingPageData((prevData) => ({
                                ...prevData,
                                tertiaryColor: color,
                              }));
                            }}
                          />
                          <div>
                            <Typography.Text className="block text-sm text-gray-700">
                              Tertiary Color
                            </Typography.Text>
                            <Typography.Text className="block text-sm text-gray-700">
                              {tertiaryColor}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>

                      {/* YIQ Threshold Controller */}
                      {/* <div className="mt-6">
                        <Typography.Text strong className="mb-2 block text-md text-gray-700">
                          Text Contrast Sensitivity
                        </Typography.Text>
                        <div className="flex items-center gap-4">
                          <Typography.Text className="text-sm text-gray-600 min-w-0">
                            Light
                          </Typography.Text>
                          <div className="flex-1">
                            <input
                              type="range"
                              min="100"
                              max="180"
                              value={yiqThreshold}
                              onChange={(e) => {
                                const newThreshold = parseInt(e.target.value);
                                setYiqThreshold(newThreshold);
                                setLandingPageData((prevData) => ({
                                  ...prevData,
                                  yiqThreshold: newThreshold,
                                }));
                              }}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #5207cd 0%, #5207cd ${((yiqThreshold - 100) / 80) * 100}%, #e5e7eb ${((yiqThreshold - 100) / 80) * 100}%, #e5e7eb 100%)`,
                                outline: 'none'
                              }}
                            />
                          </div>
                          <Typography.Text className="text-sm text-gray-600 min-w-0">
                            Dark
                          </Typography.Text>
                        </div>
                        <div className="flex justify-between mt-2">
                          <Typography.Text className="text-xs text-gray-500">
                            More white text
                          </Typography.Text>
                          <Typography.Text className="text-xs text-gray-600 font-medium">
                            {yiqThreshold}
                          </Typography.Text>
                          <Typography.Text className="text-xs text-gray-500">
                            More black text
                          </Typography.Text>
                        </div>
                        <Typography.Text className="text-xs text-gray-500 mt-1 block">
                          Controls when text switches from white to black on colored backgrounds
                        </Typography.Text>
                      </div> */}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-6 justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="text"
                    className="w-1/2 text-gray-700 border-gray-300"
                    onClick={handleBack}
                  >
                    {currentStep === 1 ? "Back to Dashboard" : "Back"}
                  </Button>
                  {/* Popup Modal */}
                  <Modal
                    title="Complete Onboarding"
                    className="justify-center"
                    visible={showModal}
                    onCancel={() => setShowModal(false)}
                    footer={
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button
                          key="continue"
                          type="primary"
                          onClick={handleContinue}
                        >
                          Continue
                        </Button>
                        <Button
                          key="Exit"
                          onClick={handleSkip}
                          className="bg-white border border-gray-300 text-gray-700 hover:bg-red-300"
                        >
                          Exit
                        </Button>
                      </div>
                    }                       

                  >
                    <p>Please Complete Onboarding Steps first.</p>
                  </Modal>

                                    {currentStep < 3 ? (
                    <Button
                      type={currentStep === 1 && !companyLogo ? "default" : "primary"}
                      className={
                        currentStep === 1 && !companyLogo 
                          ? 'w-1/2 !bg-gray-300 !border-gray-300 !text-gray-500 cursor-not-allowed hover:!bg-gray-300 hover:!border-gray-300 hover:!text-gray-500' 
                          : 'w-1/2 custom-button'
                      }
                      disabled={currentStep === 1 && !companyLogo}
                      onClick={handleNext}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type={!companyName?.trim() || !companyUrl?.trim() ? "default" : "primary"}
                      className={
                        !companyName?.trim() || !companyUrl?.trim() 
                          ? 'w-1/2 !bg-gray-300 !border-gray-300 !text-gray-500 cursor-not-allowed hover:!bg-gray-300 hover:!border-gray-300 hover:!text-gray-500' 
                          : 'w-1/2 custom-button'
                      }
                      disabled={!companyName?.trim() || !companyUrl?.trim()}
                      onClick={() => {
                        handleSaveAndNext();
                        handleApplyThemeToLandingPage();
                      }}
                    >
                      Save & Publish
                    </Button>
                  )}
                </div>
              </div>

       
              {currentStep >= 1 && currentStep <= 3 && (
                  <div className="w-full lg:w-[70%] xl:w-[72%] flex justify-center">
                    <div className="w-full max-w-[1600px] h-[550px] sm:h-[650px] md:h-[750px] lg:h-[calc(100vh-140px)] xl:h-[calc(100vh-100px)] min-h-[550px] max-h-[1100px] overflow-visible text-sm text-center text-gray-400 border border-blue-600 rounded-lg onboarding-preview-container">
                      <Preview logo={companyLogo} landingPageData={landingPageData} fullscreen={fullscreen} setFullscreen={setFullscreen} />
                    </div>
                  </div>
              )}
                    
        </div>
      </div>
    </div>
    </>
  );
}


// Helper function to load and apply custom fonts
function applyCustomFont(
  fontData
) {
  if (!fontData || !fontData.family || !fontData.src) return "";

  // Create a unique font-face name using the family as an identifier
  const fontFaceId = `font-face-${fontData.family}`;

  // Check if this font-face is already added to avoid duplicates
  if (!document.getElementById(fontFaceId)) {
    const style = document.createElement("style");
    style.id = fontFaceId;
    style.textContent = `
      @font-face {
        font-family: "${fontData.family}";
        src: url("${fontData.src}") format("truetype");
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
  }

  return fontData.family;
}

const Preview = ({ logo, landingPageData, fullscreen, setFullscreen }) => {
  // Set a global flag for preview mode
  useEffect(() => {
    window.__isOnboardingPreview = true;
    return () => {
      delete window.__isOnboardingPreview;
    };
  }, []);
  const [device, setDevice] = useState("desktop");
  const user = useSelector(selectUser);
  console.log("user", user?.landingPageNum);
  console.log("user", user?.tier);
  console.log("user", user?.upgradeNeeded);
  const [showFormEditor, setShowFormEditor] = useState(false);

  // Apply custom fonts when landingPageData changes
  useEffect(() => {
    console.count("this use effect is running1");
    if (landingPageData) {
      if (landingPageData.titleFont) applyCustomFont(landingPageData.titleFont);
      if (landingPageData.bodyFont) applyCustomFont(landingPageData.bodyFont);
      if (landingPageData.subheaderFont)
        applyCustomFont(landingPageData.subheaderFont);
    }
  }, [landingPageData]);

  return (
      <PreviewContainer
        landingPageData={landingPageData}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
        pageComponent={
          <div className=" w-full h-full">
            <NavBar landingPageData={landingPageData} showBackToEditButton={false} onClickApply={() => {}} fullscreen={fullscreen} setFullscreen={setFullscreen} isEdit={true} />
                     <HeroSection landingPageData={landingPageData} />
            {(landingPageData?.menuItems ?? [])?.map((section, index) => {
              return (
                <div key={index}>
                  {renderSection({
                    section,
                    landingPageData: landingPageData,
                    fetchData: () => {},
                    setLandingPageData: () => {},
                  })}
                </div>
              );
            })}
            <Footer landingPageData={landingPageData} fetchData={() => {}} />
          </div>
        }
        // height={700}
      />
    
  );
};
