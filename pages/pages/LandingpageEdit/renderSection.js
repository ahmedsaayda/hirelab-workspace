import React from "react";
import HeroSection from "../Landingpage/HeroSection";
import FormE from "../Landingpage/Form";
import Footer from "../Landingpage/Footer";
import EmployerTestimonial from "../Landingpage/EmployerTestimonial";
import LeaderIntroduction from "../Landingpage/LeaderIntroduction.js";
import CompanyFacts from "../Landingpage/CompanyFacts.js";
import RecruiterContact from "../Landingpage/RecruiterContact";
import Agenda from "../Landingpage/Agenda";
import JobSpecification from "../Landingpage/JobSpecification";
import JobDescription from "../Landingpage/JobDescription";
import AboutCompany from "../Landingpage/AboutCompany.js";
import Photos from "../Landingpage/Photos";
import EVPMission from "../Landingpage/EVPMission";
import CandidateProcess from "../Landingpage/CandidateProcess";
import GrowthPath from "../Landingpage/GrowthPath";
import Video from "../Landingpage/Video";
import TextBox from "../Landingpage/TextBox.js";
import { defaultLandingPageData } from "../onboarding/components/brand-style-form";

export const renderSection = ({
  section,
  fetchData,
  landingPageData = defaultLandingPageData,
  setLandingPageData,
  key = Math.random(),
}) => {
  console.log("section", section);
  console.log("landingPageData", landingPageData);
  // This function should render the corresponding section based on its key.
  switch (section?.key) {
    case "flexaligntop":
      return (
        <HeroSection
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "form-editor":
      return (
        <FormE
          showFormEditor={false}
          setShowFormEditor={() => {}}
          landingPageData={landingPageData}
          noModal
        />
      );
    case "flexalign":
      return (
        <Footer key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );
    case "Employee Testimonials":
      return (
        <EmployerTestimonial
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );

    case "Leader Introduction":
      return (
        <LeaderIntroduction
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Company Facts":
      return (
        <CompanyFacts
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Recruiter Contact":
      return (
        <RecruiterContact
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Agenda":
      return (
        <Agenda
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
          setLandingPageData={setLandingPageData}
        />
      );
    case "Job Specifications":
      return (
        <JobSpecification
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Job Description":
      return (
        <JobDescription
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "About The Company":
      return (
        <AboutCompany
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );

    case "Image Carousel":
      return (
        <Photos key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );
    case "EVP / Mission":
      return (
        <EVPMission
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Candidate Process":
      return (
        <CandidateProcess
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Growth Path":
      return (
        <GrowthPath
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Video":
      return <Video key={key} fetchData={fetchData} landingPageData={landingPageData} />;
    case "Text Box":
      return (
        <TextBox key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );

    default:
      return <></>;
  }
}; 