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
import Cookies from "js-cookie";

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
  const [fonts, setFonts] = useState([]);
  const [googleFonts, setGoogleFonts] = useState([]);
  const [fontCategories, setFontCategories] = useState({});
  
  // Separate state for font selections (like onboarding pattern) - fixes Select display issue
  const [titleFontValue, setTitleFontValue] = useState("");
  const [subheaderFontValue, setSubheaderFontValue] = useState("");
  const [bodyFontValue, setBodyFontValue] = useState("");

  // DEBUG: Track font value state changes
  useEffect(() => {
    console.log(`[FONT STATE DEBUG] titleFontValue changed to: "${titleFontValue}"`);
  }, [titleFontValue]);
  
  useEffect(() => {
    console.log(`[FONT STATE DEBUG] subheaderFontValue changed to: "${subheaderFontValue}"`);
  }, [subheaderFontValue]);
  
  useEffect(() => {
    console.log(`[FONT STATE DEBUG] bodyFontValue changed to: "${bodyFontValue}"`);
  }, [bodyFontValue]);

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Step configurations
  const steps = [
    {
      title: "Client Information",
      description: "Basic client details",
      step: 1,
    },
    {
      title: "Brand Kit",
      description: "Logo and branding",
      step: 2,
    },
    {
      title: "Settings",
      description: "Funnels and access",
      step: 3,
    },
  ];

  // Load fonts
  useEffect(() => {
    // Fetch Google Fonts
    fetch('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyAOES8EmKhuJEnsn9kS1XKBpxxp-TgN8Jc')
      .then(response => response.json())
      .then(data => {
        // Get the top 100 popular fonts
        const popularFonts = data.items.slice(0, 100);

        // Transform the response into the format needed
        const fontList = popularFonts.map(font => ({
          family: font.family,
          src: `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:wght@400;700&display=swap`,
          category: font.category
        }));

        // Group fonts by category
        const categories = {};
        fontList.forEach(font => {
          if (!categories[font.category]) {
            categories[font.category] = [];
          }
          categories[font.category].push(font);
        });

        setFontCategories(categories);
        setGoogleFonts(fontList);

        // Load web fonts for preview
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${popularFonts.map(f => `family=${f.family.replace(/ /g, '+')}:wght@400;700`).join('&')}&display=swap`;
        document.head.appendChild(link);

        // Merge with any existing custom fonts
        setFonts(prev => {
          const customFonts = prev.filter(f => f.family && f.src);
          return [...customFonts, ...fontList];
        });
      })
      .catch(err => {
        console.error('Error fetching Google Fonts:', err);
        message.error('Failed to load fonts. Using default fonts instead.');
      });
  }, []);

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
      // Set local font state values for Select display
      setTitleFontValue(editingWorkspace.titleFont?.family || "");
      setSubheaderFontValue(editingWorkspace.subheaderFont?.family || "");
      setBodyFontValue(editingWorkspace.bodyFont?.family || "");
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
      // Reset local font state values
      setTitleFontValue("");
      setSubheaderFontValue("");
      setBodyFontValue("");
      form.resetFields();
    }
  }, [editingWorkspace, form]);

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!workspaceData.name || workspaceData.name.trim() === '') {
        message.error('Please enter a workspace name before proceeding');
        return;
      }
    }

    if (currentStep < 3) {
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

  console.log("[debug workspace workspaceData]", );
  const handleSubmit = async (values, options = {}) => {
    // Guard: only allow manual submission in creation flow
    if (!editingWorkspace && options.manual !== true) {
      return;
    }

    console.log("[debug workspace submission on workspace wizard]",{
      workspaceData,
      steps,
      step: currentStep,
    });
    // Validate required fields
    if (!workspaceData.name || workspaceData.name.trim() === '') {
      message.error('Please enter a workspace name');
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("accessToken");

      if (editingWorkspace) {
        // Update existing workspace
        await WorkspaceService.updateWorkspace(editingWorkspace._id, values);
        message.success("Workspace updated successfully!");
      } else {
        // Create new workspace - merge form values with workspaceData branding
        const workspacePayload = {
          clientName: workspaceData.name,
          clientDomain: workspaceData.clientDomain,
          clientEmail: workspaceData.clientEmail,
          companyName: workspaceData.name,
          companyWebsite: workspaceData.clientDomain,
          companyLogo: workspaceData.companyLogo,
          primaryColor: workspaceData.primaryColor,
          secondaryColor: workspaceData.secondaryColor,
          tertiaryColor: workspaceData.tertiaryColor,
          heroBackgroundColor: workspaceData.heroBackgroundColor,
          heroTitleColor: workspaceData.heroTitleColor,
          selectedFont: workspaceData.selectedFont,
          titleFont: workspaceData.titleFont,
          subheaderFont: workspaceData.subheaderFont,
          bodyFont: workspaceData.bodyFont,
          maxFunnels: values?.maxFunnels || 10,
          atsAccess: values?.atsAccess !== false,
          customDomain: values?.customDomain,
          name: workspaceData.name,
          description: `Workspace for ${workspaceData.name}`,
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workspace Name *</label>
                <Input
                  size="large"
                  placeholder="Enter workspace name"
                  value={workspaceData.name}
                  onChange={(e) => setWorkspaceData({...workspaceData, name: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (currentStep < 4) {
                        handleNext();
                      }
                    }
                  }}
                />
                {!workspaceData.name && <div className="text-xs text-red-500 mt-1">Please enter workspace name</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                <Input
                  size="large"
                  placeholder="client.com"
                  value={workspaceData.clientDomain}
                  onChange={(e) => setWorkspaceData({...workspaceData, clientDomain: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (currentStep < 4) {
                        handleNext();
                      }
                    }
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  This will be used for custom domain mapping (optional)
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <Input
                  size="large"
                  type="email"
                  placeholder="contact@client.com"
                  value={workspaceData.clientEmail}
                  onChange={(e) => setWorkspaceData({...workspaceData, clientEmail: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (currentStep < 4) {
                        handleNext();
                      }
                    }
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Primary contact for this workspace
                </div>
              </div>
            </div>
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
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            // Convert to base64 for storage
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setWorkspaceData({...workspaceData, companyLogo: e.target.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ display: 'none' }}
                        id="logo-upload"
                      />
                      <Button
                        type="primary"
                        className="mt-2"
                        onClick={() => document.getElementById('logo-upload').click()}
                      >
                        Select Logo
                      </Button>
                      {workspaceData.companyLogo && (
                        <div className="mt-2">
                          <Avatar src={workspaceData.companyLogo} size={40} />
                          <div className="text-xs text-green-600 mt-1">Logo selected</div>
                        </div>
                      )}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Typography</label>

                  {/* Font Style Selector Cards */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div
                      onClick={() => setSelectedFontStyle("h1")}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedFontStyle === "h1"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">Title Style</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {titleFontValue || "No font selected"}
                      </div>
                    </div>
                    <div
                      onClick={() => setSelectedFontStyle("h2")}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedFontStyle === "h2"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">H2, H3 Style</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {subheaderFontValue || "No font selected"}
                      </div>
                    </div>
                    <div
                      onClick={() => setSelectedFontStyle("h3")}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedFontStyle === "h3"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">Body Style</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {bodyFontValue || "No font selected"}
                      </div>
                    </div>
                  </div>

                  {/* Font Selector */}
                  <div className="mb-4">
                    <div className="flex mb-2">
                      <Typography.Text strong className="text-md text-gray-700">
                        Select a font for {selectedFontStyle === "h1" ? "titles" :
                                          selectedFontStyle === "h2" ? "subheaders" : "body text"}
                      </Typography.Text>
                    </div>

                    <Select
                      showSearch
                      key={`font-select-${selectedFontStyle}`}
                      value={(() => {
                        const val = selectedFontStyle === "h1"
                          ? titleFontValue
                          : selectedFontStyle === "h2"
                          ? subheaderFontValue
                          : bodyFontValue;
                        console.log(`[FONT SELECT DEBUG] style=${selectedFontStyle}, value="${val}", titleFontValue="${titleFontValue}", subheaderFontValue="${subheaderFontValue}", bodyFontValue="${bodyFontValue}"`);
                        return val || undefined;
                      })()}
                      onChange={(value) => {
                        console.log(`[FONT SELECT DEBUG] onChange called: style=${selectedFontStyle}, newValue="${value}"`);
                        const selectedFont = googleFonts.find(f => f.family === value) ||
                                            fonts.find(f => f.family === value);
                        console.log(`[FONT SELECT DEBUG] selectedFont found:`, selectedFont);

                        if (selectedFontStyle === "h1") {
                          console.log(`[FONT SELECT DEBUG] Setting titleFontValue to "${value}"`);
                          setTitleFontValue(value);
                          setWorkspaceData(prev => ({
                            ...prev,
                            titleFont: {
                              family: value,
                              src: selectedFont?.src || "",
                            },
                            selectedFont: {
                              family: value,
                              src: selectedFont?.src || "",
                            },
                          }));
                        } else if (selectedFontStyle === "h2") {
                          console.log(`[FONT SELECT DEBUG] Setting subheaderFontValue to "${value}"`);
                          setSubheaderFontValue(value);
                          setWorkspaceData(prev => ({
                            ...prev,
                            subheaderFont: {
                              family: value,
                              src: selectedFont?.src || "",
                            },
                          }));
                        } else {
                          console.log(`[FONT SELECT DEBUG] Setting bodyFontValue to "${value}"`);
                          setBodyFontValue(value);
                          setWorkspaceData(prev => ({
                            ...prev,
                            bodyFont: {
                              family: value,
                              src: selectedFont?.src || "",
                            },
                          }));
                        }
                      }}
                      className="w-full"
                      placeholder={`Select a font for ${
                        selectedFontStyle === "h1"
                          ? "titles"
                          : selectedFontStyle === "h2"
                          ? "subheaders"
                          : "body text"
                      }`}
                      filterOption={(input, option) =>
                        (option?.label || option?.value || '')
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        ...Object.keys(fontCategories).flatMap(category => 
                          fontCategories[category].map(font => ({
                            value: font.family,
                            label: font.family,
                          }))
                        ),
                        ...fonts
                          .filter(f => !googleFonts.some(gf => gf.family === f.family))
                          .map(font => ({
                            value: font.family,
                            label: font.family,
                          }))
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Preview</h4>
                  <Card
                    className="border border-gray-200 rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: workspaceData.heroBackgroundColor || '#F5F8FC',
                      color: workspaceData.heroTitleColor || '#222222'
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        {workspaceData.companyLogo ? (
                          <img
                            src={workspaceData.companyLogo}
                            alt="Logo"
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Logo</span>
                          </div>
                        )}
                        <div>
                          <div
                            className="font-semibold"
                            style={{
                              fontFamily: workspaceData.titleFont?.family || 'inherit',
                              color: workspaceData.heroTitleColor || '#222222'
                            }}
                          >
                            Senior Frontend Developer
                          </div>
                          <div
                            className="text-sm"
                            style={{
                              fontFamily: workspaceData.subheaderFont?.family || 'inherit',
                              color: workspaceData.secondaryColor || '#4B5563'
                            }}
                          >
                            TechCorp Inc.
                          </div>
                        </div>
                        <div className="ml-auto">
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: workspaceData.primaryColor || '#373AED',
                              color: 'white'
                            }}
                          >
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span style={{ fontFamily: workspaceData.bodyFont?.family || 'inherit' }}>
                            24 Applications
                          </span>
                          <span style={{ fontFamily: workspaceData.bodyFont?.family || 'inherit' }}>
                            156 Views
                          </span>
                        </div>
                      </div>

                      <Button
                        type="primary"
                        block
                        style={{ backgroundColor: workspaceData.primaryColor || '#373AED' }}
                      >
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-600">Configure funnels and access for this workspace.</p>
            </div>

            <div className="space-y-6">
              {/* Funnel Quota Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Funnel Quota</h4>
                <p className="text-gray-600 mb-4">How many recruitment funnels do you need for this workspace?</p>

                {/* Current Plan */}
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600 mb-2">Current Plan</div>
                  <div className="text-2xl font-bold text-gray-900">Professional</div>
                </div>

                {/* Funnel Usage */}
                <div className="space-y-4 mb-4">
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
                  <h5 className="text-md font-medium text-gray-900 mb-3">Increase Funnel Quota</h5>

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
              </div>

              {/* Access Control Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Access Control</h4>

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
            {[1, 2, 3].map((step) => (
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
                  {step === 1 ? 'Client Info' : step === 2 ? 'Brand Kit' : 'Settings'}
                </span>
                {step < 3 && (
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

      {/* Step Content - No form wrapper for intermediate steps */}
      {editingWorkspace ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-6"
        >
          {renderEditForm()}

          {/* Navigation Buttons for Editing */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Update Workspace
            </Button>
          </div>
        </Form>
      ) : (
        <>
          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons for Creation */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                } else {
                  onClose();
                }
              }}
            >
              {currentStep === 1 ? "Cancel" : "Previous"}
            </Button>

            {currentStep < 3 ? (
              <Button
                type="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => handleSubmit({}, { manual: true })}
                loading={loading}
                disabled={loading}
              >
                Create Workspace
              </Button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default WorkspaceCreationWizard;
