// a function that accept the landing page data and will have the default fonts for each template and decide what to return from the landing page data and default to the template fonts if not provided

export const getFonts = (landingPageData) => {
    const defaultFontsByTemplateId = {
        "1": {
            titleFont: {
                family: "Inter",
                src: ""
            },
            subheaderFont: {
                family: "Inter",
                src: ""
            },
            bodyFont: {
                family: "Inter",
                src: ""
            }
        },
        "2": {
            titleFont: {
                family: "Inter",
                src: ""
            },
            subheaderFont: {
                family: "Inter",
                src: ""
            },
            bodyFont: {
                family: "Inter",
                src: ""
            }
            
        },
        "3": {
            titleFont: {
                family: "Poppins",
                src: ""
            },
            subheaderFont: {
                family: "Poppins",
                src: ""
            },
            bodyFont: {
                family: "Poppins",
                src: ""
        }

    }

    }

    const templateId = landingPageData?.templateId??"1"
    const defaultFonts = defaultFontsByTemplateId[templateId];
  
    const result = {
        // data from landingPageData can be objects with empty values or objects with family and src

        titleFont: landingPageData?.titleFont?.family && landingPageData?.titleFont?.src ? landingPageData?.titleFont : defaultFonts?.titleFont,
        subheaderFont: landingPageData?.subheaderFont?.family && landingPageData?.subheaderFont?.src ? landingPageData?.subheaderFont : defaultFonts?.subheaderFont,
        bodyFont: landingPageData?.bodyFont?.family && landingPageData?.bodyFont?.src ? landingPageData?.bodyFont : defaultFonts?.bodyFont
    }

    return result;

}





