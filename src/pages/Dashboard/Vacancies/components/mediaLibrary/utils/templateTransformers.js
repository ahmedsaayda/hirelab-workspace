
export const getMediaDataFromTemplate = (
  templateData,
  userId,
  existingItem
) => {
  console.log("templateDatatemplateDatatemplateDatatemplateData", templateData)
  // Start with existing data or create new base
  const baseMediaData = existingItem
    ? { ...existingItem }
    : {
        user_id: userId,
        title: templateData.sectionName || "Untitled Template",
        // thumbnail : `https://dummyimage.com/600x400/0E7EFF/ffffff&text=${templateData?.sectionName}`,
        type: "section-template",
        tags: templateData.tags ||[],
        duration: "",
        resolution: "",
        size: "",
      };

  // Update basic fields if they exist in templateData
  if (templateData.sectionName) {
    baseMediaData.title = templateData.sectionName;
  }

  // Handle tags merging - common for all types
  const mergeTags = (existingTags, newTags) => {
    return [...existingTags, ...newTags];
  };
  console.log("mergeTags", mergeTags, baseMediaData);
  // Section-specific transformations
  switch (templateData.type) {
    case "hero": {
      const newLocationTags =
        templateData.location && templateData.location.map((loc) => ({
          text: loc,
          type: "location",
        })) || [];

      console.log("handleEditItem-templateDataTags", newLocationTags);
      return {
        ...baseMediaData,
        description: templateData.vacancyTitle
          ? `Hero section for ${templateData.vacancyTitle}`
          : baseMediaData.description,
        thumbnail: templateData.heroImage || baseMediaData.thumbnail   ||
        `https://dummyimage.com/600x400/0E7EFF/ffffff&text=Hero-Section`,

        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type" && tag.type !== "location"
          ),

          { text: "Hero Section", type: "template-type" },

          ...newLocationTags,
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          // Ensure we don't lose any existing templateData fields
          location:
            templateData.location || (baseMediaData.templateData && baseMediaData.templateData.location) || [],
        },
      };
    }
    case "leaderIntro": {
      const leaderName = templateData.leaderIntroductionFullname || "Leader";
      const jobTitle = templateData.leaderIntroductionJobTitle || "Executive";
      console.log("templateDataleaderIntro", templateData);
      const ava =
        (templateData && templateData.leaderIntroductionAvatar) ||
        (baseMediaData && baseMediaData.templateData && baseMediaData.templateData.leaderIntroductionAvatar) ||
        `https://dummyimage.com/600x400/0E7EFF/ffffff&text=Leader-Introduction`;
      console.log("leaderIntro-image", ava);

      return {
        ...baseMediaData,
        description: templateData.leaderIntroductionTitle
          ? `${templateData.leaderIntroductionTitle} - ${leaderName}`
          : `Leader introduction section featuring ${leaderName}`,
        thumbnail:
          templateData.leaderIntroductionAvatar ||
          baseMediaData.thumbnail ||
          `https://dummyimage.com/600x400/0E7EFF/ffffff&text=Leader-Introduction`,
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type" && tag.type !== "role"
          ),
          { text: "Leader Introduction", type: "template-type" },
          { text: jobTitle, type: "role" },
          // { text: leaderName, type: 'person' }
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          // Ensure required fields exist
          leaderIntroductionAvatar:
            templateData?.leaderIntroductionAvatar ||
            baseMediaData?.templateData?.leaderIntroductionAvatar ||
            `https://dummyimage.com/600x400/0E7EFF/ffffff&text=Leader-Introduction`,
          leaderIntroductionFullname: templateData?.leaderIntroductionFullname,
          leaderIntroductionJobTitle: templateData?.leaderIntroductionJobTitle,
        },
      };
    }
    case "jobDescription": {
      const descriptionPreview = templateData.jobDescription
        ? templateData.jobDescription.substring(0, 100) + "..."
        : "Job description section";

      return {
        ...baseMediaData,
        description: templateData.jobDescriptionTitle
          ? `${templateData.jobDescriptionTitle} - ${
              templateData.jobDescriptionSubheader || ""
            }`
          : "Job description section",
        thumbnail:
          baseMediaData.thumbnail ||
          `https://dummyimage.com/600x400/0E7EFF/ffffff&text=Job-Description`, // Could use a default document icon here if needed
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type" && tag.type !== "job-role"
          ),
          { text: "Job Description", type: "template-type" },
          ...(templateData.jobDescriptionTitle
            ? [{ text: templateData.jobDescriptionTitle, type: "job-role" }]
            : []),
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          // Ensure required fields exist
          jobDescriptionTitle:
            templateData.jobDescriptionTitle ||
            baseMediaData.templateData?.jobDescriptionTitle ||
            "Job Description",
          jobDescriptionSubheader:
            templateData.jobDescriptionSubheader ||
            baseMediaData.templateData?.jobDescriptionSubheader ||
            "",
          jobDescription:
            templateData.jobDescription ||
            baseMediaData.templateData?.jobDescription ||
            "",
        },
      };
    }

    case "companyFacts": {
      const factTitles = templateData.companyFacts
        ?.map((f) => f.headingText)
        .filter(Boolean);
      return {
        ...baseMediaData,
        description: templateData.companyFactsTitle || "Company facts section",
        thumbnail:
          baseMediaData.thumbnail ||
          `https://dummyimage.com/600x400/0E7EFF/ffffff&text=Company-Facts`,
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type" && tag.type !== "company-fact"
          ),
          { text: "Company Facts", type: "template-type" },
          ...factTitles.map((title) => ({ text: title, type: "company-fact" })),
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          companyFacts: templateData.companyFacts || [],
          companyFactsTitle: templateData.companyFactsTitle || "Company Facts",
          companyFactsDescription: templateData.companyFactsDescription || "",
        },
      };
    }
    case "recruiterContact": {
      const recruiterNames = templateData.recruiters
        ?.map((r) => r.recruiterFullname)
        .filter(Boolean);
      return {
        ...baseMediaData,
        description:
          templateData.recruiterContactTitle || "Recruiter contact section",
        thumbnail:
          "https://dummyimage.com/600x400/0E7EFF/ffffff&text=Recruiter-Contact",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type" && tag.type !== "recruiter"
          ),
          { text: "Recruiter Contact", type: "template-type" },
          ...recruiterNames.map((name) => ({ text: name, type: "recruiter" })),
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          recruiters: templateData.recruiters || [],
          recruiterContactTitle:
            templateData.recruiterContactTitle || "Contact Our Team",
          recruiterContactText: templateData.recruiterContactText || "",
        },
      };
    }
    case "candidateProcess": {
      const processSteps = templateData.candidateProcess
        ?.map((s) => s.candidateProcessText)
        .filter(Boolean);

      return {
        ...baseMediaData,
        description:
          templateData.candidateProcessTitle || "Candidate process section",
        thumbnail:
          "https://dummyimage.com/600x400/0E7EFF/ffffff&text=Candidate-Process",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type" && tag.type !== "process-step"
          ),
          { text: "Candidate Process", type: "template-type" },
          ...(processSteps?.map((step) => ({
            text: step,
            type: "process-step",
          })) || []),
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          candidateProcess: templateData.candidateProcess || [],
          candidateProcessTitle:
            templateData.candidateProcessTitle || "Our Process",
          candidateProcessDescription:
            templateData.candidateProcessDescription || "",
        },
      };
    }

    case "videoSection": {
      return {
        ...baseMediaData,
        description: templateData.videoTitle || "Video section",
        thumbnail:
          templateData.myVideo ||
          "https://dummyimage.com/600x400/0E7EFF/ffffff&text=Video-Section",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type"
          ),
          { text: "Video", type: "template-type" },
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          videoTitle: templateData.videoTitle || "",
          videoDescription: templateData.videoDescription || "",
          myVideo: templateData.myVideo || "",
          videoAutoPlay: templateData.videoAutoPlay || false,
        },
      };
    }
    case "testimonial": {
      const newRoleTags =
        templateData.testimonials?.map((t) => ({
          text: t.role,
          type: "role",
        })) || [];

      return {
        ...baseMediaData,
        description: templateData.testimonials
          ? `Testimonials section with ${templateData.testimonials.length} testimonials`
          : baseMediaData.description,
        thumbnail:
          templateData.testimonials?.[0]?.avatar || baseMediaData.thumbnail,
        tags: mergeTags(baseMediaData.tags || [], [
          { text: "testimonial", type: "template-type" },
          ...newRoleTags,
        ]),
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          testimonials:
            templateData.testimonials ||
            baseMediaData.templateData?.testimonials ||
            [],
        },
      };
    }

    case "photoCarousel": {
      return {
        ...baseMediaData,
        description: templateData.photoTitle || "Photo carousel section",
        thumbnail:
          templateData.photoImages?.[0] ||
          "https://dummyimage.com/600x400/0E7EFF/ffffff&text=Photo-Carousel",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type"
          ),
          { text: "Image Carousel", type: "template-type" },
          {
            text: `${templateData.photoImages?.length || 0} photos`,
            type: "count",
          },
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          photoTitle: templateData.photoTitle || "Image Carousel",
          photoText: templateData.photoText || "",
          photoImages: templateData.photoImages || [],
        },
      };
    }

    case "aboutCompany": {
      return {
        ...baseMediaData,
        description:
          templateData.aboutTheCompanyTitle || "About company section",
        thumbnail:
          templateData.aboutTheCompanyImages?.[0] ||
          "https://dummyimage.com/600x400/0E7EFF/ffffff&text=About-Company",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type"
          ),
          { text: "About The Company", type: "template-type" },
          {
            text: `${templateData.aboutTheCompanyImages?.length || 0} photos`,
            type: "count",
          },
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          aboutTheCompanyTitle:
            templateData.aboutTheCompanyTitle || "About Our Company",
          aboutTheCompanyText: templateData.aboutTheCompanyText || "",
          aboutTheCompanyDescription:
            templateData.aboutTheCompanyDescription || "",
          aboutTheCompanyImages: templateData.aboutTheCompanyImages || [],
        },
      };
    }

    case "jobSpecification": {
      const specTitles = templateData.specifications
        ?.filter((spec) => spec.enabled)
        ?.map((spec) => spec.title)
        ?.filter(Boolean);

      return {
        ...baseMediaData,
        description:
          templateData.jobSpecificationTitle || "Job specifications section",
        thumbnail:
          "https://dummyimage.com/600x400/0E7EFF/ffffff&text=Job-Specs",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type"
          ),
          { text: "Job Specifications", type: "template-type" },
          ...(specTitles?.map((title) => ({
            text: title,
            type: "spec-category",
          })) || []),
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          specifications: templateData.specifications || [],
          jobSpecificationTitle:
            templateData.jobSpecificationTitle || "Job Specifications",
          jobSpecificationDescription:
            templateData.jobSpecificationDescription || "",
        },
      };
    }

    case "agenda": {
      const scheduleTitles = templateData.dailyScheduleList
        ?.map((schedule) => schedule.eventTitle)
        ?.filter(Boolean);

      return {
        ...baseMediaData,
        description: templateData.agendaTitle || "Daily agenda section",
        thumbnail:
          "https://dummyimage.com/600x400/0E7EFF/ffffff&text=Daily-Agenda",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type"
          ),
          { text: "Agenda", type: "template-type" },
          ...(scheduleTitles?.map((title) => ({
            text: title,
            type: "schedule",
          })) || []),
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          dailyScheduleList: templateData.dailyScheduleList || [],
          agendaTitle: templateData.agendaTitle || "Daily Schedule",
          agendaDescription: templateData.agendaDescription || "",
        },
      };
    }

    case "evpMission": {
      return {
        ...baseMediaData,
        description: templateData.evpMissionTitle || "EVP/Mission section",
        thumbnail:
          templateData.evpMissionAvatar ||
          "https://dummyimage.com/800x400/0E7EFF/ffffff&text=EVP-Mission",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type"
          ),
          { text: "EVP /Mission", type: "template-type" },
          { text: templateData.evpMissionFullname || "", type: "executive" },
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          evpMissionTitle: templateData.evpMissionTitle || "EVP / Mission",
          evpMissionDescription: templateData.evpMissionDescription || "",
          evpMissionFullname: templateData.evpMissionFullname || "",
          evpMissionCompanyName: templateData.evpMissionCompanyName || "",
        },
      };
    }

    case "growthPath": {
      const pathTitles = templateData.growthPath
        ?.map((path) => path.title)
        ?.filter(Boolean);

      return {
        ...baseMediaData,
        description: templateData.growthPathTitle || "Growth path section",
        // thumbnail:
        //   templateData.growthPath?.[0]?.icon ||
        //   "https://dummyimage.com/600x400/0E7EFF/ffffff&text=Growth-Path",
        thumbnail: "https://dummyimage.com/600x400/0E7EFF/ffffff&text=Growth-Path",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type"
          ),
          { text: "Growth Path", type: "template-type" },
          ...(pathTitles?.map((title) => ({
            text: title,
            type: "career-stage",
          })) || []),
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          growthPathTitle: templateData.growthPathTitle || "Growth Path",
          growthPathDescription: templateData.growthPathDescription || "",
          growthPath: templateData.growthPath || [],
        },
      };
    }
    case "textBox":{

        console.log("texxxxxxxxxbox", templateData, baseMediaData)
      return {
        ...baseMediaData,
        description: templateData.textBoxDescription || "EVP/Mission section",
        thumbnail:
          templateData.textBoxImage ||
          "https://dummyimage.com/800x400/0E7EFF/ffffff&text=Text-Box",
        tags: [
          ...(baseMediaData.tags || []).filter(
            (tag) => tag.type !== "template-type"
          ),
          { text: "Text Box", type: "template-type" },
          // { text: templateData.evpMissionFullname || "", type: "executive" },
        ],
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
          textBoxTitle: templateData.textBoxTitle || "EVP / Mission",
          textBoxDescription: templateData.textBoxDescription || "",
          textBoxText: templateData.textBoxText || "",
          textBoxImage: templateData.textBoxImage || "",
        },
      };
    }
    default:
      return {
        ...baseMediaData,
        description: templateData.type
          ? `${templateData.type} section template`
          : baseMediaData.description,
        thumbnail: templateData.thumbnail || baseMediaData.thumbnail,
        tags: mergeTags(
          baseMediaData.tags || [],
          templateData.type
            ? [{ text: templateData.type, type: "template-type" }]
            : []
        ),
        templateData: {
          ...(baseMediaData.templateData || {}),
          ...templateData,
        },
      };
  }
};
