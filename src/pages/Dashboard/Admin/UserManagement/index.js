import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Card,
  Pagination,
  Tag,
  Tooltip,
  Spin,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
  FilterOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined,
  MoreOutlined,
  CrownOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import TransferModal from "./TransferModal";
import { useDispatch } from "react-redux";
import { login } from "../../../../redux/auth/actions";
import { refreshUserData } from "../../../../utils/userRefresh";
import AuthService from "../../../../services/AuthService";

const { Option } = Select;

const UserManagement = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  // Client-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Client-side filtering and search
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState([]);
  const [accessLevelFilter, setAccessLevelFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [visiblePopconfirm, setVisiblePopconfirm] = useState(null);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [selectedUserForTransfer, setSelectedUserForTransfer] = useState(null);
  const [isGrantFunnelsModalVisible, setIsGrantFunnelsModalVisible] = useState(false);
  const [selectedUserForFunnels, setSelectedUserForFunnels] = useState(null);
  const [grantFunnelsForm] = Form.useForm();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");

      const response = await axios.get(
        `${BASE_URL}/admin/users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);
      applyFiltersAndSearch(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search to users
  const applyFiltersAndSearch = (usersList) => {
    let result = [...usersList];

    // Apply search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchLower) ||
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          // Check for "active" or "inactive" status search
          (searchLower === "active" &&
            (!user.lastLogout ||
              (user.lastLogin &&
                new Date(user.lastLogin) > new Date(user.lastLogout)))) ||
          (searchLower === "inactive" &&
            user.lastLogout &&
            (!user.lastLogin ||
              new Date(user.lastLogout) > new Date(user.lastLogin)))
      );
    }

    // Apply role filter
    if (roleFilter.length > 0) {
      result = result.filter((user) => roleFilter.includes(user.role));
    }

    // Apply access level filter
    if (accessLevelFilter.length > 0) {
      result = result.filter((user) =>
        accessLevelFilter.includes(user.accessLevel)
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter((user) => {
        const isActive =
          !user.lastLogout ||
          (user.lastLogin &&
            new Date(user.lastLogin) > new Date(user.lastLogout));
        return (
          (statusFilter.includes("active") && isActive) ||
          (statusFilter.includes("inactive") && !isActive)
        );
      });
    }

    setFilteredUsers(result);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch(users);
  }, [searchText, roleFilter, accessLevelFilter, statusFilter]);

  // Handle user update
  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");

      await axios.put(
        `${BASE_URL}/admin/users/${editingUser._id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("User updated successfully");
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Handle user creation
  const handleCreate = async (values) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");

      await axios.post(`${BASE_URL}/admin/users`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("User created successfully");
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      message.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");

      await axios.delete(`${BASE_URL}/admin/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Handle user impersonation
  const handleImpersonate = async (userId) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");

      // Save current admin info to localStorage before impersonation
      const currentAdminToken = token;
      const currentRefreshToken = Cookies.get("refreshToken");
      
      // Get current admin data from the /me endpoint
      const currentAdminResponse = await AuthService.me();

      // Store admin session info in localStorage
      localStorage.setItem("adminSessionBackup", JSON.stringify({
        accessToken: currentAdminToken,
        refreshToken: currentRefreshToken,
        adminData: currentAdminResponse.data.me
      }));

      // Set impersonation flag
      localStorage.setItem("isImpersonating", "true");

      const response = await axios.post(
        `${BASE_URL}/admin/users/${userId}/impersonate`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store new tokens
      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);

      // Update Redux store with the impersonated user data (like a login action)
      dispatch(login(response.data.user));

      // Refresh user data to ensure all components have the latest data
      await refreshUserData();

      message.success(`Successfully accessing ${response.data.user.firstName}'s account`);
      
      // Small delay to ensure all data is updated, then redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
      
    } catch (error) {
      console.error("Error impersonating user:", error);
      message.error(error.response?.data?.message || "Failed to access user account");
    } finally {
      setLoading(false);
    }
  };

  // Handle granting additional funnels
  const handleGrantFunnels = async (values) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");

      const response = await axios.post(
        `${BASE_URL}/admin/grant-funnels`,
        {
          userId: selectedUserForFunnels._id,
          additionalFunnels: parseInt(values.additionalFunnels),
          reason: values.reason
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success(response.data.message);
      setIsGrantFunnelsModalVisible(false);
      grantFunnelsForm.resetFields();
      fetchUsers(); // Refresh the user list
      
    } catch (error) {
      console.error("Error granting funnels:", error);
      message.error(error.response?.data?.message || "Failed to grant funnels");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission based on whether editing or creating
  const handleFormSubmit = (values) => {
    if (editingUser) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
  };

  // Calculate pagination
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {record.avatar ? (
              <img
                src={record.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold">
                {record.firstName?.[0]?.toUpperCase() ||
                  record.email?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="font-semibold">{`${record.firstName || ""} ${
              record.lastName || ""
            }`}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "admin"
              ? "red"
              : role === "partner"
              ? "blue"
              : role === "recruiter"
              ? "green"
              : "default"
          }
        >
          {role?.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Partner", value: "partner" },
        { text: "Recruiter", value: "recruiter" },
        { text: "Team Member", value: "team-member" },
      ],
      onFilter: (value, record) => record.role === value,
      filterDropdownProps: {
        okButtonProps: {
          className: "bg-light_blue-A700 !text-white !border-gray-300",
        },
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const lastLoginDate = record.lastLogin
          ? moment(record.lastLogin)
          : null;
        const lastLogoutDate = record.lastLogout
          ? moment(record.lastLogout)
          : null;

        // Determine if user is active or inactive
        let isActive = false;
        let statusDate = null;

        if (lastLoginDate && lastLogoutDate) {
          // Both timestamps exist, compare them
          isActive = lastLoginDate.isAfter(lastLogoutDate);
          statusDate = isActive ? lastLoginDate : lastLogoutDate;
        } else if (lastLoginDate) {
          // Only login timestamp exists
          isActive = true;
          statusDate = lastLoginDate;
        } else if (lastLogoutDate) {
          // Only logout timestamp exists
          isActive = false;
          statusDate = lastLogoutDate;
        }

        if (!statusDate) {
          return <Tag color="default">Unknown</Tag>;
        }

        return (
          <div>
            <Tag color={isActive ? "green" : "red"}>
              {isActive ? "Active" : "Inactive"}
            </Tag>
            {/* <div className="text-xs text-gray-500 mt-1">
              {statusDate.format("MMM DD, YYYY h:mm A")}
            </div> */}
          </div>
        );
      },
      sorter: (a, b) => {
        const aLoginTime = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const aLogoutTime = a.lastLogout ? new Date(a.lastLogout).getTime() : 0;
        const bLoginTime = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        const bLogoutTime = b.lastLogout ? new Date(b.lastLogout).getTime() : 0;

        const aStatus = aLoginTime > aLogoutTime;
        const bStatus = bLoginTime > bLogoutTime;

        if (aStatus === bStatus) {
          return (
            Math.max(aLoginTime, aLogoutTime) -
            Math.max(bLoginTime, bLogoutTime)
          );
        }

        return aStatus ? -1 : 1;
      },
    },
    {
      title: "Access Level",
      dataIndex: "accessLevel",
      key: "accessLevel",
      render: (level) => (
        <Tag color={level === "read-write" ? "blue" : "orange"}>
          {level?.toUpperCase() || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Workspaces",
      dataIndex: "allowWorkspaces",
      key: "allowWorkspaces",
      render: (allowed) => (
        <Tag 
          color={allowed ? "green" : "default"} 
          icon={allowed ? <ApartmentOutlined /> : null}
        >
          {allowed ? "ENABLED" : "DISABLED"}
        </Tag>
      ),
    },
    {
      title: "Plan Info",
      key: "planInfo",
      render: (_, record) => {
        const tier = record.subscription?.tier || 'start';
        const additionalFunnels = record.subscription?.additionalFunnels || 0;
        
        return (
          <div>
            <div>
              <Tag color={tier === 'start' ? 'default' : tier === 'create' ? 'blue' : 'purple'}>
                {tier.toUpperCase()}
              </Tag>
            </div>
            {additionalFunnels > 0 && (
              <div className="mt-1">
                <Tag color="gold" icon={<CrownOutlined />} className="text-xs">
                  +{additionalFunnels} funnels
                </Tag>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      render: (date) => {
        if (!date) return <Tag color="default">Never</Tag>;

        const lastActiveDate = moment(date);
        const now = moment();

        let tagContent = "";
        let tagColor = "default";

        if (now.diff(lastActiveDate, "minutes") < 5) {
          tagContent = "Now";
          tagColor = "green";
        } else if (lastActiveDate.isSame(now, "day")) {
          tagContent = `Today, ${lastActiveDate.format("h:mm A")}`;
          tagColor = "blue";
        } else if (
          lastActiveDate.isSame(now.clone().subtract(1, "day"), "day")
        ) {
          tagContent = `Yesterday, ${lastActiveDate.format("h:mm A")}`;
          tagColor = "orange";
        } else {
          tagContent = lastActiveDate.format("MMM DD, YYYY h:mm A");
          tagColor = "default";
        }

        return <Tag color={tagColor}>{tagContent}</Tag>;
      },
      sorter: (a, b) =>
        new Date(b.lastActive || 0) - new Date(a.lastActive || 0),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("MMM DD, YYYY"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type=""
            icon={<EditOutlined />}
            className="!bg-green-100 !text-green-500 font-semibold !border-green-300 shadow-sm !hover:bg-green-300 hover-fix"
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({
                email: record.email,
                firstName: record.firstName || "",
                lastName: record.lastName || "",
                role: record.role,
                accessLevel: record.accessLevel,
                allowWorkspaces: record.allowWorkspaces || false,
              });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            type=""
            icon={<LockOutlined />}
            className="!bg-blue-100 !text-blue-500 font-semibold !border-blue-300 shadow-sm !hover:bg-blue-300 hover-fix"
            onClick={() => handleImpersonate(record._id)}
            loading={loading}
          >
            Access Account
          </Button>
          <Button
            type=""
            onClick={() => {
              setSelectedUserForTransfer(record);
              setIsTransferModalVisible(true);
            }}
          >
            Transfer Pages
          </Button>
          <Button
            type=""
            icon={<CrownOutlined />}
            className="!bg-yellow-100 !text-yellow-600 font-semibold !border-yellow-300 shadow-sm !hover:bg-yellow-300 hover-fix"
            onClick={() => {
              setSelectedUserForFunnels(record);
              grantFunnelsForm.resetFields();
              setIsGrantFunnelsModalVisible(true);
            }}
          >
            Grant Funnels
          </Button>
          <Popconfirm
            title="Are you sure?"
            open={visiblePopconfirm === record._id}
            onOpenChange={(open) =>
              setVisiblePopconfirm(open ? record._id : null)
            }
            showCancel={false}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
            description={
              <div className="flex gap-2 justify-end mt-3">
                <button
                  className="px-3 py-1 text-black bg-gray-300 rounded"
                  onClick={() => setVisiblePopconfirm(null)}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete(record._id);
                    setVisiblePopconfirm(null);
                  }}
                  className="px-3 py-1 text-white bg-red-500 rounded "
                >
                  Delete
                </button>
              </div>
            }
          >
            <Button
              className="!bg-red-100 !text-red-500 font-semibold !border-red-300 shadow-sm !hover:bg-red-300 hover-fix "
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">User Management</span>
            <Button
              type=""
              className="!bg-light_blue-A700 !border-gray-300 hover-fix text-white"
              icon={<UserAddOutlined />}
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Add User
            </Button>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-4">
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-xs"
            allowClear
          />

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <Select
              mode="multiple"
              placeholder="Filter by role"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ minWidth: 180 }}
              allowClear
            >
              <Option value="admin">Admin</Option>
              <Option value="partner">Partner</Option>
              <Option value="recruiter">Recruiter</Option>
              <Option value="team-member">Team Member</Option>
            </Select>

            <Select
              mode="multiple"
              placeholder="Filter by access level"
              value={accessLevelFilter}
              onChange={setAccessLevelFilter}
              style={{ minWidth: 180 }}
              allowClear
            >
              <Option value="read-write">Read-Write</Option>
              <Option value="read">Read Only</Option>
            </Select>

            <Select
              mode="multiple"
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ minWidth: 180 }}
              allowClear
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>

          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchText("");
              setRoleFilter([]);
              setAccessLevelFilter([]);
              setStatusFilter([]);
            }}
            type={
              searchText ||
              roleFilter.length > 0 ||
              accessLevelFilter.length > 0 ||
              statusFilter.length > 0
                ? "primary"
                : "default"
            }
          >
            Clear Filters
          </Button>
        </div>

        {loading && users.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <Spin size="large" />
          </div>
        ) : (
          <div
            className="overflow-auto no-scrollbar "
            style={{ scrollbarWidth: "none" }}
          >
            <Table
              columns={columns}
              dataSource={paginatedUsers}
              rowKey="_id"
              pagination={false}
              className="custom-table"
              scroll={{
                x:600
              }}
            />

            <div className="mt-4 flex justify-end">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredUsers.length}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                }}
                showSizeChanger
                pageSizeOptions={["10", "20", "50", "100"]}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} users`
                }
              />
            </div>
          </div>
        )}
      </Card>

      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
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
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please input first name!" }]}
            >
              <Input className="!border-gray-300 !rounded-lg" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please input last name!" }]}
            >
              <Input className="!border-gray-300 !rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input className="!border-gray-300 !rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role!" }]}
            >
              <Select>
                <Option value="admin">Admin</Option>
                <Option value="partner">Partner</Option>
                <Option value="recruiter">Recruiter</Option>
                <Option value="team-member">Team Member</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="accessLevel"
              label="Access Level"
              rules={[
                { required: true, message: "Please select access level!" },
              ]}
            >
              <Select>
                <Option value="read-write">Read-Write</Option>
                <Option value="read">Read Only</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="allowWorkspaces"
            label={
              <div className="flex items-center gap-2">
                <ApartmentOutlined />
                <span>Allow Workspaces</span>
              </div>
            }
            valuePropName="checked"
            extra="Enable this user to create and manage multiple brand workspaces"
          >
            <Switch />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password className="!border-gray-300 !rounded-lg" />
            </Form.Item>
          )}

          {editingUser && (
            <Form.Item
              name="password"
              label="Password (leave blank to keep current)"
              rules={[
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password className="!border-gray-300 !rounded-lg" />
            </Form.Item>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button
              type=""
              className="bg-light_blue-A700 hover-fix !text-white !border-gray-300"
              htmlType="submit"
              loading={loading}
            >
              {editingUser ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>

      {isTransferModalVisible && (
        <TransferModal
          visible={isTransferModalVisible}
          onClose={() => setIsTransferModalVisible(false)}
          user={selectedUserForTransfer}
          onTransferSuccess={() => {
            fetchUsers();
            setIsTransferModalVisible(false);
          }}
        />
      )}

      {/* Grant Funnels Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CrownOutlined className="text-yellow-500" />
            <span>Grant Additional Funnels</span>
          </div>
        }
        open={isGrantFunnelsModalVisible}
        onCancel={() => {
          setIsGrantFunnelsModalVisible(false);
          grantFunnelsForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        {selectedUserForFunnels && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">User Information</h4>
            <div className="text-sm text-gray-600">
              <div><strong>Name:</strong> {selectedUserForFunnels.firstName} {selectedUserForFunnels.lastName}</div>
              <div><strong>Email:</strong> {selectedUserForFunnels.email}</div>
              <div><strong>Current Plan:</strong> {selectedUserForFunnels.subscription?.tier || 'start'}</div>
              <div><strong>Base Plan Funnels:</strong> {(() => {
                const tier = selectedUserForFunnels.subscription?.tier || 'start';
                const baseLimits = { start: 1, create: 5, scale: 15 };
                return baseLimits[tier] || 1;
              })()}</div>
              <div><strong>Additional Funnels:</strong> {selectedUserForFunnels.subscription?.additionalFunnels || 0}</div>
              <div><strong>Total Funnel Limit:</strong> {(() => {
                const tier = selectedUserForFunnels.subscription?.tier || 'start';
                const baseLimits = { start: 1, create: 5, scale: 15 };
                const base = baseLimits[tier] || 1;
                const additional = selectedUserForFunnels.subscription?.additionalFunnels || 0;
                return base + additional;
              })()}</div>
            </div>
          </div>
        )}

        <Form
          form={grantFunnelsForm}
          layout="vertical"
          onFinish={handleGrantFunnels}
          className="pt-4"
        >
          <Form.Item
            name="additionalFunnels"
            label="Number of Additional Funnels to Grant"
            rules={[
              { required: true, message: "Please enter the number of funnels!" },
              { 
                validator: (_, value) => {
                  const num = parseInt(value);
                  if (isNaN(num) || num < 1 || num > 100) {
                    return Promise.reject(new Error("Please enter a number between 1 and 100!"));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              type="number" 
              placeholder="e.g., 5"
              className="!border-gray-300 !rounded-lg"
              min={1}
              max={100}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason for Granting Funnels"
            rules={[
              { required: true, message: "Please provide a reason!" }
            ]}
          >
            <Input.TextArea
              placeholder="e.g., Customer upgrade request, special promotion, beta tester..."
              rows={3}
              className="!border-gray-300 !rounded-lg"
            />
          </Form.Item>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <div className="text-yellow-600 mt-0.5">⚠️</div>
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> This action will permanently increase the user's funnel limit. 
                The additional funnels will be added to their current plan's base limit and will persist 
                even if they change plans.
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button 
              onClick={() => {
                setIsGrantFunnelsModalVisible(false);
                grantFunnelsForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type=""
              className="bg-yellow-500 hover-fix !text-white !border-yellow-500"
              htmlType="submit"
              loading={loading}
              icon={<CrownOutlined />}
            >
              Grant Funnels
            </Button>
          </div>
        </Form>
      </Modal>

      <style jsx>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          font-weight: 600;
        }

        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: #f3f4f6;
        }

        .hover-fix:hover {
          color: #000 !important;
          border-color: #d9d9d9 !important;
        }

        .hover-fix:hover span {
          color: #000 !important;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
