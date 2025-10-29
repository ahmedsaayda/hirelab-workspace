import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Switch,
  message,
  Typography,
  Row,
  Col,
  Card,
  Progress,
  Avatar,
  Select,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import ColorPickerButton from "../../onboarding/components/ColorPickerButton.jsx";
import WorkspaceUserManagement from "./WorkspaceUserManagement";
import CategoryManagement from "./CategoryManagement";
import WorkspaceService from "../../../services/WorkspaceService";

const { Title, Text } = Typography;
const { Option } = Select;

const WorkspaceCreationWizard = ({
  open,
  onClose,
  onSuccess,
  editingWorkspace = null,
  user,
  currentUserRole = "viewer"
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [workspaceData, setWorkspaceData] = useState({});
  const [selectedFontStyle, setSelectedFontStyle] = useState("h1");

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Step configurations
  const steps = [
    {
      title: "Client Information",
      description: "Tell us about the client/brand you want to manage.",
      step: 1,
    },
    {
      title: "Brand Kit",
      description: "Set up the visual identity for this workspace.",
      step: 2,
    },
    {
      title: "Funnel Quota",
      description: "How many recruitment funnels do you need?",
      step: 3,
    },
    {
      title: "Access Control",
      description: "Configure who can access this workspace.",
      step: 4,
    },
  ];

  useEffect(() => {
    if (editingWorkspace) {
      setCurrentStep(1); // Reset to step 1 for editing
      setWorkspaceData({
        name: editingWorkspace.name,
        clientName: editingWorkspace.clientName,
        clientDomain: editingWorkspace.clientDomain,
        clientEmail: editingWorkspace.clientEmail,
        companyName: editingWorkspace.companyName,
        companyWebsite: editingWorkspace.companyWebsite,
        companyLogo: editingWorkspace.companyLogo,
        primaryColor: editingWorkspace.primaryColor,
        secondaryColor: editingWorkspace.secondaryColor,
        tertiaryColor: editingWorkspace.tertiaryColor,
        selectedFont: editingWorkspace.selectedFont,
        titleFont: editingWorkspace.titleFont,
        subheaderFont: editingWorkspace.subheaderFont,
        bodyFont: editingWorkspace.bodyFont,
        maxFunnels: editingWorkspace.maxFunnels,
        atsAccess: editingWorkspace.atsAccess,
        customDomain: editingWorkspace.customDomain,
      });
      form.setFieldsValue({
        name: editingWorkspace.name,
        clientName: editingWorkspace.clientName,
        clientDomain: editingWorkspace.clientDomain,
        clientEmail: editingWorkspace.clientEmail,
        companyName: editingWorkspace.companyName,
        companyWebsite: editingWorkspace.companyWebsite,
        companyLogo: editingWorkspace.companyLogo,
        primaryColor: editingWorkspace.primaryColor,
        secondaryColor: editingWorkspace.secondaryColor,
        tertiaryColor: editingWorkspace.tertiaryColor,
        selectedFont: editingWorkspace.selectedFont?.family,
        titleFont: editingWorkspace.titleFont?.family,
        subheaderFont: editingWorkspace.subheaderFont?.family,
        bodyFont: editingWorkspace.bodyFont?.family,
        maxFunnels: editingWorkspace.maxFunnels,
        atsAccess: editingWorkspace.atsAccess,
        customDomain: editingWorkspace.customDomain,
      });
    } else {
      setCurrentStep(1);
      setWorkspaceData({});
      form.resetFields();
    }
  }, [editingWorkspace, form]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");

      if (editingWorkspace) {
        // Update existing workspace
        await WorkspaceService.updateWorkspace(editingWorkspace._id, values);
        message.success("Workspace updated successfully!");
      } else {
        // Create new workspace
        const workspacePayload = {
          clientName: values.name,
          clientDomain: values.clientDomain,
          clientEmail: values.clientEmail,
          companyName: values.companyName,
          companyWebsite: values.companyWebsite,
          companyLogo: values.companyLogo,
          primaryColor: values.primaryColor,
          secondaryColor: values.secondaryColor,
          tertiaryColor: values.tertiaryColor,
          selectedFont: {
            family: values.selectedFont,
            src: "",
          },
          titleFont: {
            family: values.titleFont,
            src: "",
          },
          subheaderFont: {
            family: values.subheaderFont,
            src: "",
          },
          bodyFont: {
            family: values.bodyFont,
            src: "",
          },
          maxFunnels: values.maxFunnels,
          atsAccess: values.atsAccess,
          customDomain: values.customDomain,
          name: values.name,
          description: `Workspace for ${values.name}`,
        };

        await WorkspaceService.createWorkspace(workspacePayload);
        message.success("Workspace created successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving workspace:", error);
      message.error(
        error.response?.data?.message || "Failed to save workspace"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderEditForm = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Avatar
              size={64}
              src={workspaceData.companyLogo}
              icon={<UserOutlined />}
              className="bg-blue-100"
            />
            <div>
              <h3 className="text-lg font-semibold">{workspaceData.clientName}</h3>
              <p className="text-gray-600">{workspaceData.description}</p>
              <p className="text-sm text-gray-500">{workspaceData.companyWebsite}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <Row gutter={16}>
          <Col span={8}>
            <Card className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {workspaceData.currentFunnels || 0}
              </div>
              <div className="text-sm text-gray-500">Active Funnels</div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="text-center">
              <div className="text-xl font-bold text-green-600">
                {workspaceData.maxFunnels || 10}
              </div>
              <div className="text-sm text-gray-500">Max Funnels</div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="text-center">
              <div className="text-xl font-bold text-purple-600">
                {workspaceData.members?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Team Members</div>
            </Card>
          </Col>
        </Row>

        {/* Settings Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
              General
            </button>
            <button className="py-2 px-1 text-gray-500 hover:text-gray-700">
              Branding
            </button>
            <button className="py-2 px-1 text-gray-500 hover:text-gray-700">
              Team
            </button>
            <button className="py-2 px-1 text-gray-500 hover:text-gray-700">
              Settings
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">ATS Access</span>
            <Switch
              checked={workspaceData.atsAccess}
              onChange={(checked) => setWorkspaceData({...workspaceData, atsAccess: checked})}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Funnel Quota</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={100}
                value={workspaceData.maxFunnels}
                onChange={(e) => setWorkspaceData({...workspaceData, maxFunnels: parseInt(e.target.value) || 10})}
                style={{ width: '80px' }}
              />
              <span className="text-sm text-gray-500">funnels</span>
            </div>
          </div>
        </div>

        {/* Dynamic Sections */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <CategoryManagement
            workspaceId={editingWorkspace?._id}
            workspaceName={editingWorkspace?.clientName}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <WorkspaceUserManagement
            open={true}
            onClose={() => {}}
            workspaceId={editingWorkspace?._id}
            workspaceName={editingWorkspace?.clientName}
            currentUserRole={currentUserRole}
            embedded={true}
          />
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Client Information</h3>
              <p className="text-gray-600">Tell us about the client/brand you want to manage.</p>
            </div>

            <Form.Item
              name="name"
              label="Workspace Name"
              rules={[{ required: true, message: "Please enter workspace name!" }]}
            >
              <Input
                size="large"
                placeholder="Enter workspace name"
                value={workspaceData.name}
                onChange={(e) => setWorkspaceData({...workspaceData, name: e.target.value})}
              />
            </Form.Item>

            <Form.Item name="clientDomain" label="Domain">
              <Input
                size="large"
                placeholder="client.com"
                value={workspaceData.clientDomain}
                onChange={(e) => setWorkspaceData({...workspaceData, clientDomain: e.target.value})}
              />
              <div className="text-xs text-gray-500 mt-1">
                This will be used for custom domain mapping (optional)
              </div>
            </Form.Item>

            <Form.Item name="clientEmail" label="Contact Email">
              <Input
                size="large"
                type="email"
                placeholder="contact@client.com"
                value={workspaceData.clientEmail}
                onChange={(e) => setWorkspaceData({...workspaceData, clientEmail: e.target.value})}
              />
              <div className="text-xs text-gray-500 mt-1">
                Primary contact for this workspace
              </div>
            </Form.Item>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Kit</h3>
              <p className="text-gray-600">Set up the visual identity for this workspace.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left: Brand Kit Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <div className="space-y-2">
                      <div className="text-gray-600">Click to upload or drag and drop</div>
                      <div className="text-sm text-gray-500">PNG, JPG, SVG up to 2MB</div>
                      <Button type="primary" className="mt-2">
                        Select Logo
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Brand Colors</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Primary</div>
                      <ColorPickerButton
                        color={workspaceData.primaryColor || "#373AED"}
                        setColor={(color) => setWorkspaceData({...workspaceData, primaryColor: color})}
                      />
                      <div className="text-xs text-gray-500 mt-1 font-mono">#373AED</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Secondary</div>
                      <ColorPickerButton
                        color={workspaceData.secondaryColor || "#4B5563"}
                        setColor={(color) => setWorkspaceData({...workspaceData, secondaryColor: color})}
                      />
                      <div className="text-xs text-gray-500 mt-1 font-mono">#4B5563</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Accent</div>
                      <ColorPickerButton
                        color={workspaceData.tertiaryColor || "#8B5CF6"}
                        setColor={(color) => setWorkspaceData({...workspaceData, tertiaryColor: color})}
                      />
                      <div className="text-xs text-gray-500 mt-1 font-mono">#8B5CF6</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Preview</h4>
                  <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Logo</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">Senior Frontend Developer</div>
                          <div className="text-sm text-gray-600">TechCorp Inc.</div>
                        </div>
                        <div className="ml-auto">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>24 Applications</span>
                          <span>156 Views</span>
                        </div>
                      </div>

                      <Button type="primary" block>
                        View Funnel
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Funnel Quota</h3>
              <p className="text-gray-600">How many recruitment funnels do you need for this workspace?</p>
            </div>

            <div className="space-y-6">
              {/* Current Plan */}
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Current Plan</div>
                <div className="text-2xl font-bold text-gray-900">Professional</div>
              </div>

              {/* Funnel Usage */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Funnel Usage</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {workspaceData.maxFunnels || 10} of {workspaceData.maxFunnels || 10} funnels
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((workspaceData.maxFunnels || 10) / (workspaceData.maxFunnels || 10)) * 100}%` }}
                  ></div>
                </div>

                <div className="text-center text-sm text-gray-500">
                  0 / {workspaceData.maxFunnels || 10}
                </div>
              </div>

              {/* Increase Funnel Quota */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Increase Funnel Quota</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Add 5 more funnels (+$25/month)</div>
                      <div className="text-sm text-gray-600">Additional funnels will be billed on your next invoice</div>
                    </div>
                    <Button type="primary" size="small">
                      Select
                    </Button>
                  </div>
                </div>
              </div>

              {/* Upgrade Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🚀</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Upgrade to Enterprise</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Get unlimited funnels, priority support, and advanced analytics for $199/month.
                    </p>
                    <Button type="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      Learn more →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Control</h3>
              <p className="text-gray-600">Configure who can access this workspace's ATS system.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Enable ATS Access</div>
                  <div className="text-sm text-gray-600">Allow workspace members to access applicant data</div>
                </div>
                <Switch
                  checked={workspaceData.atsAccess !== false}
                  onChange={(checked) => setWorkspaceData({...workspaceData, atsAccess: checked})}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={editingWorkspace ? "Edit Workspace" : "Create New Workspace"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnClose
    >
      {/* Step Indicators - Only show for creation, not editing */}
      {!editingWorkspace && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => step <= currentStep && handleStepClick(step)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-blue-600 text-white'
                      : step < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                <span className={`ml-2 text-sm ${step <= currentStep ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step === 1 ? 'Client Info' : step === 2 ? 'Brand Kit' : step === 3 ? 'Funnel Quota' : 'Access Control'}
                </span>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Content */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        {/* Show different content based on editing mode */}
        {editingWorkspace ? renderEditForm() : renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button
            onClick={() => {
              if (editingWorkspace) {
                onClose();
              } else if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                onClose();
              }
            }}
          >
            {editingWorkspace ? "Cancel" : (currentStep === 1 ? "Cancel" : "Previous")}
          </Button>

          {editingWorkspace ? (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Update Workspace
            </Button>
          ) : currentStep < 4 ? (
            <Button
              type="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Create Workspace
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default WorkspaceCreationWizard;
