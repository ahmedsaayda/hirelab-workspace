"use client"

import { Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PublicService from "../../services/PublicService.js";
import { changeIndigoShades, generateTailwindPalette } from "../Dashboard/index.js";
import { renderSection } from "../LandingpageEdit/renderSection.js";
import { Button } from "./components/index.jsx";
import Footer from "./Footer.js";
import Form from "./Form.js"; // Import the new FormEditor component
import HeroSection from "./HeroSection.js";
import NavBar from "./NavBar.jsx";
import ApplyCustomFont from "./ApplyCustomFont.jsx";
import { useFocus } from "../../contexts/FocusContext.js";
import { useHover } from "../../contexts/HoverContext.js";

export default function LandingpagePage({ paramsId, overrideParamId = null, fullscreen = false, showBackToEditButton = false, setFullscreen }) {
  const lpId = overrideParamId ?? paramsId;
  const [landingPageData, setLandingPageData] = useState(null);
  console.log(landingPageData);
  const [showApplyButton, setShowApplyButton] = useState(false);
  const [showFormEditor, setShowFormEditor] = useState(false); // New state for form editor visibility

  // Add navbar height adjustment
  useEffect(() => {
    const navbarHeight = 128;
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    document.documentElement.style.setProperty('scroll-padding-top', `${navbarHeight}px`);
    
    // Add styles for scroll behavior
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-padding-top: var(--navbar-height, 128px);
      }
      body {
        padding-top: ${fullscreen ? '0' : 'var(--navbar-height, 128px)'};
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [fullscreen]);

  const fetchData = useCallback(() => {
    if (lpId) {
      PublicService.getLP(lpId).then((res) => {
        if (res.data?.lp) setLandingPageData(res.data.lp);
      });
      PublicService.getLPBrand(lpId).then((res) => {
        if (res.data?.color) {
          // changeIndigoShades(generateTailwindPalette(res.data?.color));
        }
      });
    }
  }, [lpId]);

  useEffect(() => {
    fetchData();

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowApplyButton(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchData]);

  useEffect(() => {
    const handleApply = () => {
      setShowFormEditor(true);
    };
    const handleApplyButtonClick = (event) => {
      if (event.target?.href?.includes?.("#apply")) {
        handleApply();
      }
      if (event.target?.href?.includes?.("#share")) {
        // handle share (modal to allow user choose from a list of social media to share this job)
      }
    };

    document.addEventListener("click", handleApplyButtonClick);
    document.addEventListener("APPLY", handleApply);

    return () => {
      document.removeEventListener("click", handleApplyButtonClick);
      document.removeEventListener("APPLY", handleApply);
    };
  }, []);

  if (!landingPageData) return <Skeleton active />;
  // if (!landingPageData?.published) return <></>;

  return (
    <div className="w-full">
      <ApplyCustomFont landingPageData={landingPageData} />
      <div className="flex flex-col justify-between items-center">
        <NavBar
          landingPageData={landingPageData}
          onClickApply={() => setShowFormEditor(true)}
          fullscreen={fullscreen}
          showBackToEditButton={showBackToEditButton}
          setFullscreen={setFullscreen}
        />

        <HeroSection landingPageData={landingPageData} fetchData={fetchData} />

        {(landingPageData?.menuItems ?? [])?.map((section, idx) =>
          renderSection({ section, landingPageData, fetchData, key: idx })
        )}

        <Footer landingPageData={landingPageData} fetchData={fetchData} />

        <Form
          landingPageData={landingPageData}
          setLandingPageData={setLandingPageData}
          showFormEditor={showFormEditor}
          setShowFormEditor={setShowFormEditor}
        />
      </div>
    </div>
  );
}
