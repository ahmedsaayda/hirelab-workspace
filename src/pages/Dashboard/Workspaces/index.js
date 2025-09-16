import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Table,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ApartmentOutlined,
  SwapOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/auth/actions";
import { selectUser } from "../../../redux/auth/selectors";

const { Title, Text } = Typography;
const { TextArea } = Input;

const WorkspaceManagement = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingWorkspace, setEditingWorkspace] = useState(null);

  // Use Redux user state instead of parsing token
  const isWorkspaceSession = user?.isWorkspaceSession || false;
  const currentWorkspace = isWorkspaceSession ? {
    id: user.workspaceId,
    name: user.workspaceName || 'Current Workspace'
  } : null;

  useEffect(() => {
    // Only fetch workspaces if not in workspace session
    if (!isWorkspaceSession) {
      fetchWorkspaces();
    }
  }, [isWorkspaceSession]);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${BASE_URL}/workspaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkspaces(response.data);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      if (error.response?.status === 403) {
        message.error("Workspace feature not enabled for your account. Please contact admin.");
      } else {
        message.error("Failed to fetch workspaces");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = () => {
    setEditingWorkspace(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditWorkspace = (workspace) => {
    setEditingWorkspace(workspace);
    form.setFieldsValue({
      name: workspace.name,
      description: workspace.description,
      email: workspace.email,
      companyName: workspace.companyName,
      companyWebsite: workspace.companyWebsite,
      companyAddress: workspace.companyAddress,
    });
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      
      if (editingWorkspace) {
        // Update workspace
        await axios.put(
          `${BASE_URL}/workspaces/${editingWorkspace._id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        message.success("Workspace updated successfully!");
      } else {
        // Create workspace
        await axios.post(`${BASE_URL}/workspaces`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Workspace created successfully!");
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchWorkspaces();
    } catch (error) {
      console.error("Error saving workspace:", error);
      message.error(
        error.response?.data?.message || "Failed to save workspace"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      const token = Cookies.get("accessToken");
      await axios.delete(`${BASE_URL}/workspaces/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Workspace deleted successfully!");
      fetchWorkspaces();
    } catch (error) {
      console.error("Error deleting workspace:", error);
      message.error("Failed to delete workspace");
    }
  };

  const handleSwitchToWorkspace = async (workspaceId) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${BASE_URL}/workspaces/${workspaceId}/switch`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update cookies with new tokens
      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);

      // Update Redux store
      dispatch(login(response.data.user));

      message.success(`Switched to workspace successfully!`);
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error switching to workspace:", error);
      message.error("Failed to switch to workspace");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnFromWorkspace = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${BASE_URL}/workspaces/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update cookies with new tokens
      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);

      // Update Redux store
      dispatch(login(response.data.user));

      message.success("Returned to main account successfully!");
      
      // Redirect to workspaces page
      window.location.href = "/dashboard/workspaces";
    } catch (error) {
      console.error("Error returning from workspace:", error);
      message.error("Failed to return from workspace");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Workspace",
      key: "workspace",
      render: (_, record) => (
        <div>
          <div className="font-semibold text-gray-800">{record.name}</div>
          {record.description && (
            <div className="text-sm text-gray-500">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <div className="flex items-center gap-1">
          <MailOutlined className="text-gray-400" />
          <span>{email}</span>
        </div>
      ),
    },
    {
      title: "Company",
      key: "company",
      render: (_, record) => (
        <div>
          {record.companyName && (
            <div className="flex items-center gap-1 mb-1">
              <BankOutlined className="text-gray-400" />
              <span className="text-sm">{record.companyName}</span>
            </div>
          )}
          {record.companyWebsite && (
            <div className="flex items-center gap-1">
              <GlobalOutlined className="text-gray-400" />
              <a
                href={record.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:underline"
              >
                {record.companyWebsite}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Switch to this workspace">
            <Button
              type="primary"
              size="small"
              icon={<SwapOutlined />}
              onClick={() => handleSwitchToWorkspace(record._id)}
              className="!bg-blue-500"
            >
              Switch
            </Button>
          </Tooltip>
          <Tooltip title="Edit workspace">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditWorkspace(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete workspace"
            description="Are you sure you want to delete this workspace? This action cannot be undone."
            onConfirm={() => handleDeleteWorkspace(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // If user is in workspace session, show return option
  if (isWorkspaceSession) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <ApartmentOutlined className="text-4xl text-blue-500 mb-4" />
            <Title level={3}>Workspace Session Active</Title>
            <Text type="secondary" className="block mb-6">
              You are currently working in: <strong>{currentWorkspace?.name}</strong>
            </Text>
            <Button
              type="primary"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handleReturnFromWorkspace}
              loading={loading}
            >
              Return to Main Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="!mb-2">
          <ApartmentOutlined className="mr-2" />
          Workspace Management
        </Title>
        <Text type="secondary">
          Create and manage multiple brand workspaces. Each workspace operates as an independent entity with its own branding, job funnels, and data.
        </Text>
      </div>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Title level={4} className="!mb-0">
            Your Workspaces
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateWorkspace}
          >
            Create Workspace
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={workspaces}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} workspaces`,
          }}
          locale={{
            emptyText: (
              <div className="py-8">
                <ApartmentOutlined className="text-4xl text-gray-300 mb-2" />
                <div className="text-gray-500">No workspaces created yet</div>
                <div className="text-sm text-gray-400">
                  Create your first workspace to get started
                </div>
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title={editingWorkspace ? "Edit Workspace" : "Create New Workspace"}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Workspace Name"
                rules={[
                  { required: true, message: "Please enter workspace name!" },
                ]}
              >
                <Input placeholder="e.g., Tech Company Brand" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Workspace Email"
                rules={[
                  { required: true, message: "Please enter workspace email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="workspace@company.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea
              rows={3}
              placeholder="Brief description of this workspace..."
            />
          </Form.Item>

          <Divider orientation="left">Company Information</Divider>

          <Form.Item name="companyName" label="Company Name">
            <Input placeholder="Company Name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="companyWebsite" label="Company Website">
                <Input placeholder="https://company.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="companyAddress" label="Company Address">
                <Input placeholder="Company Address" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {editingWorkspace ? "Update Workspace" : "Create Workspace"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkspaceManagement;
