import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Tag,
  Avatar,
  Progress,
  Row,
  Col,
  Select,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  LinkOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";

// Import workspace and category services
import WorkspaceService from "../../../services/WorkspaceService";

const { Title, Text } = Typography;
const { Option } = Select;

const CategoryManagement = ({ workspaceId, workspaceName }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchCategories();
  }, [workspaceId]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await WorkspaceService.getCategories(workspaceId);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingCategory) {
        // Update category
        await axios.put(
          `${BASE_URL}/categories/${editingCategory._id}`,
          values
        );
        message.success("Category updated successfully!");
      } else {
        // Create category
        await axios.post(
          `${BASE_URL}/workspaces/${workspaceId}/categories`,
          values
        );
        message.success("Category created successfully!");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      message.error(
        error.response?.data?.message || "Failed to save category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${BASE_URL}/categories/${categoryId}`);
      message.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={4} className="!mb-2">
            <FolderOutlined className="mr-2" />
            Category Management
          </Title>
          <Text type="secondary">
            Organize your job postings into categories for better discoverability.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateCategory}
        >
          Create Category
        </Button>
      </div>

      {/* Category Cards */}
      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col xs={24} sm={12} lg={8} key={category._id}>
            <Card
              className="h-full hover:shadow-lg transition-shadow duration-200"
              actions={[
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => message.info(`View category: ${category.name}`)}
                >
                  View
                </Button>,
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditCategory(category)}
                >
                  Edit
                </Button>,
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <div className="space-y-4">
                {/* Category Info */}
                <div className="flex items-center gap-3">
                  <Avatar
                    size={48}
                    icon={<FolderOutlined />}
                    className="bg-blue-100"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-lg">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.description}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Associated Funnels</span>
                    <span className="text-sm font-medium">
                      {category.associatedFunnels?.length || 0}
                    </span>
                  </div>
                  <Progress
                    percent={Math.min(((category.associatedFunnels?.length || 0) / 10) * 100, 100)}
                    size="small"
                    showInfo={false}
                    strokeColor={category.associatedFunnels?.length > 0 ? "#3b82f6" : "#e5e7eb"}
                  />
                </div>

                {/* Status */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Status</span>
                  <Tag color={category.published ? "green" : "orange"}>
                    {category.published ? "Published" : "Draft"}
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>
        ))}

        {/* Add Category Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="h-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
            onClick={handleCreateCategory}
          >
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <PlusOutlined className="text-4xl mb-2" />
              <div className="text-lg font-medium">Add Category</div>
              <div className="text-sm">Create a new job category</div>
            </div>
          </Card>
        </Col>
      </Row>

      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <FolderOutlined className="text-6xl text-gray-300 mb-4" />
          <div className="text-xl text-gray-500 mb-2">No categories yet</div>
          <div className="text-gray-400 mb-6">Create your first category to organize your job postings</div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateCategory}
          >
            Create Your First Category
          </Button>
        </div>
      )}

      {/* Category Creation/Edit Modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Create New Category"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="pt-4"
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter category name!" },
            ]}
          >
            <Input placeholder="e.g., Sales, Engineering, Marketing" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={3}
              placeholder="Brief description of this category..."
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;

