
import React, { useEffect, useState } from "react";
import { Input, Button, Switch, Form, message } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { SmartTags } from "../../smart-tags.jsx";
// import ImageUploader from "..."; const ImageUploader = () => <div>Image Uploader Placeholder</div>;

const { TextArea } = Input;



export default function TestimonialsForm({ onSave, initialData, isSaving }) {
  const isEditing = !!initialData; 
  const [form] = Form.useForm();
  const [testimonials, setTestimonials] = useState([
    {
      comment: "",
      fullname: "",
      role: "",
      avatar: "",
      avatarEnabled: true,
    },
  ]);

  // Prepopulate form if editing
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.testimonialTitle || "",
        subheader: initialData.testimonialSubheader || "",
        tags: initialData.tags || [],
      });
      setTestimonials(
        initialData.testimonials?.length
          ? initialData.testimonials
          : testimonials
      );
    }
  }, [initialData]);

  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        comment: "",
        fullname: "",
        role: "",
        avatar: "",
        avatarEnabled: true,
      },
    ]);
  };

  const handleRemoveTestimonial = (index) => {
    const updated = testimonials.filter((_, i) => i !== index);
    setTestimonials(updated);
  };

  const handleImageUpload = (imageUrl, index) => {
    const updated = [...testimonials];
    updated[index].avatar = imageUrl;
    setTestimonials(updated);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave({
        testimonialTitle: values.title,
        testimonialSubheader: values.subheader,
        testimonials: testimonials.map((t) => ({
          ...t,
          avatarEnabled: t.avatarEnabled ?? true,
        })),
        tags: values.tags || [],
      });
      message.success("Testimonials saved successfully");
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="flex flex-col gap-6 w-full !text-blue_gray-700"
    >
      <Form.Item
        name="title"
        label="Section Title"
        rules={[{ required: true, message: "Title is required" }]}
      >
        <Input
          placeholder="Testimonials"
          maxLength={60}
          className="rounded-lg border border-solid border-blue_gray-100"
        />
      </Form.Item>

      <Form.Item
        name="subheader"
        label="Section Subheader"
        rules={[{ required: true, message: "Subheader is required" }]}
      >
        <Input
          placeholder="Hear from our team"
          maxLength={100}
          className="rounded-lg border border-solid border-blue_gray-100"
        />
      </Form.Item>

      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="border border-blue_gray-100 rounded-lg p-4 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Testimonial #{index + 1}</h4>
            {testimonials.length > 1 && (
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleRemoveTestimonial(index)}
              />
            )}
          </div>

          <Form.Item label="Full Name" required>
            <Input
              value={testimonial.fullname}
              onChange={(e) => {
                const updated = [...testimonials];
                updated[index].fullname = e.target.value;
                setTestimonials(updated);
              }}
              placeholder="John Doe"
              maxLength={40}
              className="rounded-lg border border-solid border-blue_gray-100"
            />
          </Form.Item>

          <Form.Item label="Role" required>
            <Input
              value={testimonial.role}
              onChange={(e) => {
                const updated = [...testimonials];
                updated[index].role = e.target.value;
                setTestimonials(updated);
              }}
              placeholder="CEO"
              maxLength={40}
              className="rounded-lg border border-solid border-blue_gray-100"
            />
          </Form.Item>

          <Form.Item label="Comment" required>
            <TextArea
              value={testimonial.comment}
              onChange={(e) => {
                const updated = [...testimonials];
                updated[index].comment = e.target.value;
                setTestimonials(updated);
              }}
              rows={4}
              maxLength={400}
              placeholder="Share your experience..."
              className="rounded-lg border border-solid border-blue_gray-100"
            />
          </Form.Item>

          <div className="flex items-center gap-4">
            <span className="text-sm">Enable Avatar</span>
            <Switch
              checked={testimonial.avatarEnabled}
              onChange={(checked) => {
                const updated = [...testimonials];
                updated[index].avatarEnabled = checked;
                setTestimonials(updated);
              }}
            />
          </div>

          {testimonial.avatarEnabled && (
            <Form.Item>
              <ImageUploader
                maxFiles={1}
                multiple={false}
                accept=".svg,.png,.jpg,.gif"
                defaultImage={testimonial.avatar}
                onImageUpload={(url) => handleImageUpload(url, index)}
              />
              <p className="text-xs text-gray-500 mt-2">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </Form.Item>
          )}
        </div>
      ))}

      <Button
        type="dashed"
        onClick={handleAddTestimonial}
        block
        icon={<PlusOutlined />}
        className="rounded-lg border-blue_gray-100"
      >
        Add Testimonial
      </Button>

      <Form.Item name="tags" label="Smart Tags" className="mt-6">
        <SmartTags
          defaultValue={initialData?.tags || []}
          onChange={(tags) => form.setFieldsValue({ tags })}
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        loading={isSaving}
        block
        className="rounded-lg bg-[#0E87FE] text-white hover:bg-[#0B6ECD] transition-colors"
      >
        {isEditing ? "Update Template":"Create Template"}
      </Button>
    </Form>
  );
}
