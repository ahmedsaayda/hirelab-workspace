// hirelab-frontend\src\components\mediaLibrary\ImageModal\StockImageBrowse.jsx
import React, { useState } from "react";
import { Spin, Button, message } from "antd";
import { useSelector } from "react-redux";
import MyMediaLibrary from "../index.jsx";

const StockImageBrowser = ({ 
  onSelect, 
  maxFiles,
  currentCount,
  type, 
  currentSectionLimits=Infinity,
  allowedTabs =["all","image","video","section-template"]
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectMediaLimits = (state) => state.mediaUpload.mediaLimits;
  const selectActiveSection = (state) => state.mediaUpload.activeSection;

  // console.log('TM_SELECTED_TEXTTM_SELECTED_TEXT', {  activeSection,
  //   mediaLimits,
  //   landingPageData,});

  const handleMediaSelection = (mediaItems) => {
    // Filter items based on type
    const filteredItems = type !== "all" 
      ? mediaItems.filter(item => {
          const itemType = item.type?.toLowerCase() || 
            (item.thumbnail?.toLowerCase().includes('.mp4') ? 'video' : 'image');
          return itemType === type.toLowerCase();
        })
      : mediaItems;

    // Extract valid URLs from selected media
    const urls = filteredItems
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
    <div className="w-full">
      <MyMediaLibrary
        // isAddSectionButtonVisible={false}
        getSelectedMedia={handleMediaSelection}
        activeSection={reduxActiveSection}
        mediaLimits={reduxMediaLimits}
        setIsMediaLiOpen={setIsOpen}
        ImageModal={true}
        currentSectionLimits={currentSectionLimits}
        type={type}
        allowedTabs={allowedTabs}
      />
    </div>
  );
};

export default StockImageBrowser;
