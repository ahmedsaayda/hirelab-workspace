

// hirelab-frontend\src\components\mediaLibrary\ImageModal\StockImageBrowse.jsx
import React, { useState } from "react";
import { Spin, Button, message } from "antd";
import { useSelector } from "react-redux";
import MyMediaLibrary from "../index.jsx";



const StockImageBrowser = ({ 
  onSelect, 
  maxFiles,
  currentCount,
}) => {
    const [isOpen, setIsOpen] = useState(false);// not using but require form prop of media library
  const selectMediaLimits = (state) => state.mediaUpload.mediaLimits;
const selectActiveSection = (state) => state.mediaUpload.activeSection;

  // console.log('TM_SELECTED_TEXTTM_SELECTED_TEXT', {  activeSection,
  //   mediaLimits,
  //   landingPageData,});

  const handleMediaSelection = (mediaItems) => {
    // Extract valid URLs from selected media
    const urls = mediaItems
      .filter(item => item.thumbnail || item.url)
      .map(item => item.thumbnail || item.url);

    // Apply max files validation
    if (maxFiles && currentCount + urls.length > maxFiles) {
      const allowed = maxFiles - currentCount;
      message.error(`You can only select ${allowed} more file(s)`);
      return;
    }

    onSelect(urls);
    setIsOpen(false); // Close the media browser modal
  };
  const reduxMediaLimits = useSelector(selectMediaLimits);
  const reduxActiveSection = useSelector(selectActiveSection);

  console.log('reduxActiveSection', reduxActiveSection);

return (
    <div className="">

      <MyMediaLibrary
        // isAddSectionButtonVisible={false}
        getSelectedMedia={handleMediaSelection}
        // //  setGetMediaDataFromChild={setGetMediaDataFromChild}
        activeSection={reduxActiveSection}
        mediaLimits={reduxMediaLimits}
        setIsMediaLiOpen={setIsOpen}
        // landingPageData={landingPageData}
        ImageModal={reduxActiveSection?.key === 'Video'? false : true}
      />
    </div>

   );
 };

 export default StockImageBrowser;