import React from "react";
import HeroSection from "../Landingpage/HeroSection.js";
import MultiJobHero from "../Landingpage/MultiJobHero.js";
import FormE from "../Landingpage/Form.js";
import Footer from "../Landingpage/Footer.js";
import EmployerTestimonial from "../Landingpage/EmployerTestimonial.js";
import LeaderIntroduction from "../Landingpage/LeaderIntroduction.js";
import CompanyFacts from "../Landingpage/CompanyFacts.js";
import RecruiterContact from "../Landingpage/RecruiterContact.js";
import Agenda from "../Landingpage/Agenda.js";
import JobSpecification from "../Landingpage/JobSpecification.js";
import JobDescription from "../Landingpage/JobDescription.js";
import AboutCompany from "../Landingpage/AboutCompany.js";
import Photos from "../Landingpage/Photos.js";
import EVPMission from "../Landingpage/EVPMission.js";
import CandidateProcess from "../Landingpage/CandidateProcess.js";
import GrowthPath from "../Landingpage/GrowthPath.js";
import Video from "../Landingpage/Video.js";
import TextBox from "../Landingpage/TextBox.js";
import LinkedJobs from "../Landingpage/LinkedJobs.js";
import { defaultLandingPageData } from "../onboarding/components/brand-style-form.jsx";

export const renderSection = ({
  section,
  fetchData,
  landingPageData = defaultLandingPageData,
  setLandingPageData,
  key= Math.random(),
  similarJobs,
  similarJobsLoading,
}) => {
  console.log("section", section);
  console.log("landingPageData", landingPageData);
  
  // Map section keys to HTML IDs for navigation
  const sectionKeyToIdMap = {
    "Job Specifications": "job-specifications",
    "Recruiter Contact": "recruiter-contact", 
    "Job Description": "job-description",
    "Agenda": "agenda",
    "About The Company": "about-the-company",
    "Company Facts": "company-facts",
    "Leader Introduction": "leader-introduction",
    "Employee Testimonials": "testimonials",
    "Candidate Process": "candidate-process",
    "Growth Path": "growth-path",
    "EVP / Mission": "evp-mission",
    "Image Carousel": "image-carousel",
    "Video": "video",
    "Text Box": "text-box",
    "Linked Jobs": "linked-jobs",
  };
  
  const sectionId = sectionKeyToIdMap[section?.key];
  
  // This function should render the corresponding section based on its key.
  let sectionContent;
  switch (section?.key) {
    case "flexaligntop":
      // Use MultiJobHero for multi-job campaigns, regular HeroSection for single jobs
      if (landingPageData?.campaignType === "multi") {
        sectionContent = (
          <MultiJobHero
            key={key}
            fetchData={fetchData}
            landingPageData={landingPageData}
            isEdit={false}
          />
        );
      } else {
        sectionContent = (
          <HeroSection
            key={key}
            fetchData={fetchData}
            landingPageData={landingPageData}
          />
        );
      }
      break;
    case "form-editor":
      sectionContent = (
        <FormE
          showFormEditor={false}
          setShowFormEditor={() => {}}
          landingPageData={landingPageData}
          noModal
        />
      );
      break;
    case "flexalign":
      sectionContent = (
        <Footer 
          key={key} 
          fetchData={fetchData} 
          landingPageData={landingPageData}
          onClickApply={() => {}}
          lpId={landingPageData?._id}
          isEdit={false}
        />
      );
      break;
    case "Employee Testimonials":
      sectionContent = (
        <EmployerTestimonial
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;

    case "Leader Introduction":
      sectionContent = (
        <LeaderIntroduction
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;
    case "Company Facts":
      sectionContent = (
        <CompanyFacts
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;
    case "Recruiter Contact":
      sectionContent = (
        <RecruiterContact
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;
    case "Agenda":
      sectionContent = (
        <Agenda
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
          setLandingPageData={setLandingPageData}
        />
      );
      break;
    case "Job Specifications":
      sectionContent = (
        <JobSpecification
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;
    case "Job Description":
      sectionContent = (
        <JobDescription
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;
    case "About The Company":
      sectionContent = (
        <AboutCompany
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;

    case "Image Carousel":
      sectionContent = (
        <Photos key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );
      break;
    case "EVP / Mission":
      sectionContent = (
        <EVPMission
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;
    case "Candidate Process":
      sectionContent = (
        <CandidateProcess
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;
    case "Growth Path":
      sectionContent = (
        <GrowthPath
          key={key}
          fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
      break;
    case "Video":
      sectionContent = <Video key={key} fetchData={fetchData} landingPageData={landingPageData} />;
      break;
    case "Text Box":
      sectionContent = (
        <TextBox key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );
      break;
    case "Linked Jobs":
      sectionContent = (
        <LinkedJobs key={key} landingPageData={landingPageData} isEdit={false} />
      );
      break;

    default:
      sectionContent = <></>;
  }
  
  // Wrap with ID for navigation if we have a section ID
  if (sectionId) {
    return (
      <div id={sectionId} key={key} className="w-full">
        {sectionContent}
      </div>
    );
  }
  
  return sectionContent;
}; 
