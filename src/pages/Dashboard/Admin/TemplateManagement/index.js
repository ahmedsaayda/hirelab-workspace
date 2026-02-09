import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Spin,
  Switch,
  Upload,
  Card,
  InputNumber,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  CopyOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import TemplateService from "../../../../services/TemplateService";

const { Option } = Select;
const { TextArea } = Input;

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch all templates
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await TemplateService.getAllTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      message.error("Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  // Seed default template
  const handleSeedDefault = async () => {
    setLoading(true);
    try {
      const response = await TemplateService.seedDefaultTemplate();
      
      if (response.data.seeded) {
        message.success("Default Clarity template created");
        fetchTemplates();
      } else {
        message.info(response.data.message);
      }
    } catch (error) {
      console.error("Error seeding template:", error);
      message.error("Failed to seed default template");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle create/update
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        templateId: values.templateId,
        name: values.name,
        description: values.description,
        previewImage: previewUrl || "",
        formats: {
          story: values.storyId,
          portrait: values.portraitId,
          square: values.squareId,
        },
        mediaType: values.mediaType,
        order: values.order || 0,
        isActive: values.isActive !== false,
      };

      if (editingTemplate) {
        await TemplateService.updateTemplate(editingTemplate._id, payload);
        message.success("Template updated successfully");
      } else {
        await TemplateService.createTemplate(payload);
        message.success("Template created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingTemplate(null);
      setPreviewUrl(null);
      fetchTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      message.error(error.response?.data?.message || "Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await TemplateService.deleteTemplate(id);
      message.success("Template deleted successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      message.error("Failed to delete template");
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (id) => {
    try {
      await TemplateService.toggleActive(id);
      message.success("Template status updated");
      fetchTemplates();
    } catch (error) {
      console.error("Error toggling template:", error);
      message.error("Failed to update template status");
    }
  };

  // Handle image upload to Cloudinary
  const handleUpload = async (info) => {
    const { file } = info;
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "hirelab");
      formData.append("folder", "creatomate-templates");

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
      
      const response = await axios.post(cloudinaryUrl, formData);
      setPreviewUrl(response.data.secure_url);
      message.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Open modal for edit
  const openEditModal = (template) => {
    setEditingTemplate(template);
    setPreviewUrl(template.previewImage);
    form.setFieldsValue({
      templateId: template.templateId,
      name: template.name,
      description: template.description,
      previewImage: template.previewImage,
      storyId: template.formats?.story,
      portraitId: template.formats?.portrait,
      squareId: template.formats?.square,
      mediaType: template.mediaType,
      order: template.order,
      isActive: template.isActive,
    });
    setIsModalVisible(true);
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingTemplate(null);
    setPreviewUrl(null);
    form.resetFields();
    form.setFieldsValue({
      mediaType: "both",
      order: templates.length,
      isActive: true,
    });
    setIsModalVisible(true);
  };

  // Copy ID to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard");
  };

  const columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 70,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "Preview",
      dataIndex: "previewImage",
      key: "previewImage",
      width: 100,
      render: (url) => (
        url ? (
          <img 
            src={url} 
            alt="Preview" 
            className="w-16 h-16 object-cover rounded-lg border"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )
      ),
    },
    {
      title: "Template ID",
      dataIndex: "templateId",
      key: "templateId",
      render: (id) => (
        <div className="flex items-center gap-2">
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{id}</code>
          <Tooltip title="Copy ID">
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />} 
              onClick={() => copyToClipboard(id)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div>
          <div className="font-medium">{name}</div>
          {record.description && (
            <div className="text-gray-500 text-xs mt-1 truncate max-w-[200px]">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Media Type",
      dataIndex: "mediaType",
      key: "mediaType",
      width: 100,
      render: (type) => (
        <Tag color={type === "both" ? "blue" : type === "video" ? "purple" : "green"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Formats",
      key: "formats",
      render: (_, record) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-500 w-14">Story:</span>
            <code className="bg-gray-100 px-1 rounded truncate max-w-[120px]" title={record.formats?.story}>
              {record.formats?.story?.slice(0, 12)}...
            </code>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 w-14">Portrait:</span>
            <code className="bg-gray-100 px-1 rounded truncate max-w-[120px]" title={record.formats?.portrait}>
              {record.formats?.portrait?.slice(0, 12)}...
            </code>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 w-14">Square:</span>
            <code className="bg-gray-100 px-1 rounded truncate max-w-[120px]" title={record.formats?.square}>
              {record.formats?.square?.slice(0, 12)}...
            </code>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 90,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleActive(record._id)}
          checkedChildren={<EyeOutlined />}
          unCheckedChildren={<EyeInvisibleOutlined />}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this template?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Template Management</h1>
          <p className="text-gray-500 mt-1">
            Manage Creatomate ad templates for all users
          </p>
        </div>
        <div className="flex items-center gap-3">
          {templates.length === 0 && (
            <Button
              onClick={handleSeedDefault}
              icon={<ReloadOutlined />}
              loading={loading}
            >
              Seed Default Template
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Add Template
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={templates}
          rowKey="_id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <div className="py-12 text-center">
                <div className="text-gray-400 text-lg mb-2">No templates yet</div>
                <p className="text-gray-500 mb-4">
                  Click "Seed Default Template" to create the Clarity template, or add a new one manually.
                </p>
              </div>
            ),
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingTemplate ? "Edit Template" : "Add New Template"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTemplate(null);
          setPreviewUrl(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="templateId"
              label="Template ID"
              rules={[
                { required: true, message: "Template ID is required" },
                { pattern: /^[a-z0-9-]+$/, message: "Only lowercase letters, numbers, and hyphens" },
              ]}
              tooltip="Unique identifier used in code (e.g., 'clarity', 'bold-modern')"
            >
              <Input placeholder="e.g., clarity" disabled={!!editingTemplate} />
            </Form.Item>

            <Form.Item
              name="name"
              label="Display Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="e.g., Clarity" />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea 
              rows={2} 
              placeholder="Brief description of the template style..."
            />
          </Form.Item>

          <Form.Item label="Preview Image">
            <div className="flex items-start gap-4">
              <Upload
                name="file"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleUpload}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Upload Image
                </Button>
              </Upload>
              {previewUrl && (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="text"
                    size="small"
                    danger
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow"
                    onClick={() => setPreviewUrl(null)}
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-3 text-gray-700">Creatomate Template IDs</h4>
            <div className="grid grid-cols-1 gap-3">
              <Form.Item
                name="storyId"
                label="Story Format (9:16)"
                rules={[{ required: true, message: "Story template ID is required" }]}
                className="mb-0"
              >
                <Input placeholder="Creatomate template ID for story format" className="font-mono text-sm" />
              </Form.Item>

              <Form.Item
                name="portraitId"
                label="Portrait Format (4:5)"
                rules={[{ required: true, message: "Portrait template ID is required" }]}
                className="mb-0"
              >
                <Input placeholder="Creatomate template ID for portrait format" className="font-mono text-sm" />
              </Form.Item>

              <Form.Item
                name="squareId"
                label="Square Format (1:1)"
                rules={[{ required: true, message: "Square template ID is required" }]}
                className="mb-0"
              >
                <Input placeholder="Creatomate template ID for square format" className="font-mono text-sm" />
              </Form.Item>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="mediaType"
              label="Media Type"
              initialValue="both"
            >
              <Select>
                <Option value="both">Both (Image & Video)</Option>
                <Option value="image">Image Only</Option>
                <Option value="video">Video Only</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="order"
              label="Display Order"
              initialValue={0}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Active"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button onClick={() => {
              setIsModalVisible(false);
              setEditingTemplate(null);
              setPreviewUrl(null);
              form.resetFields();
            }}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {editingTemplate ? "Update Template" : "Create Template"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplateManagement;
