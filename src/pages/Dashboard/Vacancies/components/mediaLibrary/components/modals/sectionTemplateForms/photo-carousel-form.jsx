import React, { useState } from "react";
import { Input, Button, message } from "antd";
// import ImageUploader from "..."; const ImageUploader = () => <div>Image Uploader Placeholder</div>;
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Img } from "../../../../../../../../dhwise-components";

const { TextArea } = Input;



const PhotoCarouselForm = ({ 
  initialData, 
  onSave, 
  isSaving 
}) => {
  const [formData, setFormData] = useState({
    photoTitle: initialData?.photoTitle || "Image Carousel",
    photoText: initialData?.photoText || "",
    photoImages: initialData?.photoImages || [],
    type: 'photoCarousel'
  });

  console.log('formDataPhotoImage', formData);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (urls) => {
    const newImages = [...formData.photoImages, ...urls].slice(0, 12); // Limit to 12 images
    handleChange('photoImages', newImages);
  };

  const removeImage = (index) => {
    const newImages = formData.photoImages.filter((_, i) => i !== index);
    handleChange('photoImages', newImages);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formData.photoImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    handleChange('photoImages', items);
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Photo carousel saved successfully");
    } catch (error) {
      message.error("Failed to save photo carousel");
      console.error("Error saving photo carousel:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Section Title */}
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.photoTitle.length}/40</p>
      </div>
      <Input
        value={formData.photoTitle}
        onChange={(e) => handleChange('photoTitle', e.target.value)}
        maxLength={40}
        className="w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 rounded-md"
      />

      {/* Section Description */}
      <div className="flex justify-between items-center">
        <p>Description</p>
        <p>{formData.photoText.length}/120</p>
      </div>
      <TextArea
        value={formData.photoText}
        onChange={(e) => handleChange('photoText', e.target.value)}
        rows={3}
        maxLength={120}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Image Upload */}
      <div className="mt-4">
        <ImageUploader
          maxFiles={12 - formData.photoImages.length}
          multiple={true}
          defaultImage={formData.photoImages[0]}
          onImageUpload={handleImageUpload}
        //   showUploadList={false}
        />

        {/* Display uploaded images with remove and drag support */}
        {/* {formData.photoImages.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  className="flex gap-4 flex-wrap mt-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {formData.photoImages.map((url, index) => (
                    <Draggable key={url} draggableId={url} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative w-32 h-32 border rounded overflow-hidden"
                        >
                          <img
                            src={url}
                            alt={`uploaded-${index}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            title="Remove Image"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                          >
                            <CloseOutlined />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )} */}

        {formData.photoImages.length > 0 && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="images" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-wrap gap-4 mt-4"
                  >
                    {formData.photoImages.map((image, index) => (
                      <Draggable key={image} draggableId={image} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="relative group"
                          >
                            <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={image}
                                alt={`Carousel image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              title="Remove image"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-white text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                              <Img
                                src="/images2/img_trash_01_red_700.svg"
                                alt="trash-01"
                                className="h-[20px] w-[20px] cursor-pointer ml-auto"
                                // onClick={(e) =>
                                //   handleDeleteClick(e, idx, item.key)
                                // }
                              />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}



      </div>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:bg-[#0B6ECD] transition-colors"
      >
        {initialData ? "Update Carousel" : "Create Carousel"}
      </Button>
    </div>
  );
};

export default PhotoCarouselForm;
