import React, { useState } from "react";
import { Input, Button, message } from "antd";
// import ImageUploader from "..."; const ImageUploader = () => <div>Image Uploader Placeholder</div>;
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CloseOutlined } from "@ant-design/icons";
import { Img } from "../../../../../../../../dhwise-components";

const { TextArea } = Input;



const AboutCompanyForm = ({ 
  initialData, 
  onSave, 
  isSaving 
}) => {
  const [formData, setFormData] = useState({
    aboutTheCompanyTitle: initialData?.aboutTheCompanyTitle || "About Our Company",
    aboutTheCompanyText: initialData?.aboutTheCompanyText || "",
    aboutTheCompanyDescription: initialData?.aboutTheCompanyDescription || "",
    aboutTheCompanyImages: initialData?.aboutTheCompanyImages || [],
    type: 'aboutCompany'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (urls) => {
    const newImages = [...formData.aboutTheCompanyImages, ...urls].slice(0, 5);
    handleChange('aboutTheCompanyImages', newImages);
  };

  const removeImage = (index) => {
    const newImages = formData.aboutTheCompanyImages.filter((_, i) => i !== index);
    handleChange('aboutTheCompanyImages', newImages);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formData.aboutTheCompanyImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    handleChange('aboutTheCompanyImages', items);
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Company details saved successfully");
    } catch (error) {
      message.error("Failed to save company details");
      console.error("Error saving company details:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Section Title */}
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.aboutTheCompanyTitle.length}/40</p>
      </div>
      <Input
        value={formData.aboutTheCompanyTitle}
        onChange={(e) => handleChange('aboutTheCompanyTitle', e.target.value)}
        maxLength={40}
        className="w-full border border-solid border-blue_gray-100 rounded-md"
      />

      {/* Short Description */}
      <div className="flex justify-between items-center">
        <p>Tagline</p>
        <p>{formData.aboutTheCompanyText.length}/60</p>
      </div>
      <Input
        value={formData.aboutTheCompanyText}
        onChange={(e) => handleChange('aboutTheCompanyText', e.target.value)}
        maxLength={60}
        className="w-full border border-solid border-blue_gray-100 rounded-md"
      />

      {/* Long Description */}
      <div className="flex justify-between items-center">
        <p>Detailed Description</p>
        <p>{formData.aboutTheCompanyDescription.length}/500</p>
      </div>
      <TextArea
        value={formData.aboutTheCompanyDescription}
        onChange={(e) => handleChange('aboutTheCompanyDescription', e.target.value)}
        rows={5}
        maxLength={500}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Image Upload */}
      <div className="mt-4">
        <ImageUploader
          maxFiles={5 - formData.aboutTheCompanyImages.length}
          multiple={true}
          defaultImage={formData.aboutTheCompanyImages[0]}
          onImageUpload={handleImageUpload}
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.aboutTheCompanyImages.length}/5 images uploaded
        </p>

        {/* Image Gallery */}
        {formData.aboutTheCompanyImages.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2">Company Images:</h4>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="images" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-wrap gap-4"
                  >
                    {formData.aboutTheCompanyImages.map((image, index) => (
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
                                alt={`Company image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              title="Remove image"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-white-A700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
          </div>
        )}
      </div>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:bg-[#0B6ECD] transition-colors"
      >
        {initialData ? "Update Company Info" : "Create Company Info"}
      </Button>
    </div>
  );
};

export default AboutCompanyForm;
