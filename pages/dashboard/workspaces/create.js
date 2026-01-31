import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Card, Typography, message, Steps, Divider, Modal, Radio, Spin, Select, Progress } from "antd";
import { ArrowLeftOutlined, SaveOutlined, CheckCircleOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ImageUploader from "../../../src/pages/LandingpageEdit/ImageUploader.js";
import ColorPickerButton from "../../../src/pages/onboarding/components/ColorPickerButton.jsx";
import Layout from "../layout";
import { useWorkspace } from "../../../src/contexts/WorkspaceContext";
import { useSelector } from "react-redux";
import { selectUser } from "../../../src/redux/auth/selectors";
import scraperService from "../../../src/services/ScraperService.js";
import AiService from "../../../src/services/AiService.js";

const { Title, Text } = Typography;
const { Step } = Steps;

const WorkspaceCreatePage = () => {
  const router = useRouter();
  const { createWorkspace, loading, purchaseAdditionalFunnels } = useWorkspace();
  const user = useSelector(selectUser);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [funnelsToPurchase, setFunnelsToPurchase] = useState(5);
  const [selectedFontStyle, setSelectedFontStyle] = useState("h1");
  const [googleFonts, setGoogleFonts] = useState([]);
  const [isLoadingFonts, setIsLoadingFonts] = useState(false);
  const [fontCategories, setFontCategories] = useState({});
  const [fonts, setFonts] = useState([]);
  const [primaryColor, setPrimaryColor] = useState("#0066CC");
  const [secondaryColor, setSecondaryColor] = useState("#333333");
  const [tertiaryColor, setTertiaryColor] = useState("#666666");
  
  // Local state for font selections - form.getFieldValue() doesn't trigger re-renders!
  const [titleFont, setTitleFont] = useState("");
  const [subheaderFont, setSubheaderFont] = useState("");
  const [bodyFont, setBodyFont] = useState("");

  // Website scraping state
  const [scraping, setScraping] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [scrapeMessages, setScrapeMessages] = useState([]);

  // Compute remaining funnels from user data (if available)
  const planMaxFunnels = useMemo(() => {
    return user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? null;
  }, [user?.planFeatures, user?.tier]);

  const remainingFunnels = useMemo(() => {
    if (planMaxFunnels === null) return null; // unlimited / unknown
    const allocated = user?.totalAllocatedFunnels ?? 0;
    const rem = planMaxFunnels - allocated;
    return rem < 0 ? 0 : rem;
  }, [planMaxFunnels, user?.totalAllocatedFunnels]);

  const handlePrimaryColorChange = useCallback((color) => {
    console.log("Primary color changed to:", color);
    setPrimaryColor(color);
    form.setFieldsValue({ primaryColor: color });
  }, [form]);

  const handleSecondaryColorChange = useCallback((color) => {
    console.log("Secondary color changed to:", color);
    setSecondaryColor(color);
    form.setFieldsValue({ secondaryColor: color });
  }, [form]);

  const handleTertiaryColorChange = useCallback((color) => {
    console.log("Tertiary color changed to:", color);
    setTertiaryColor(color);
    form.setFieldsValue({ tertiaryColor: color });
  }, [form]);

  // Website scraping to extract brand info
  const handleScrapeWebsite = useCallback(async () => {
    const websiteUrl = form.getFieldValue('companyWebsite')?.trim();
    if (!websiteUrl) {
      message.warning("Please enter a company website URL first");
      return;
    }

    // Format URL
    let formattedUrl = websiteUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setScraping(true);
    setScrapeProgress(0);
    setScrapeMessages(["Starting website scan..."]);

    try {
      setScrapeProgress(10);
      setScrapeMessages(prev => [...prev, "Fetching website data..."]);
      
      const response = await scraperService.scrapeWebsiteOnboarding(formattedUrl);
      let data = response.data;
      console.log("Scraped data:", data);

      setScrapeProgress(40);
      setScrapeMessages(prev => [...prev, "Enhancing with AI..."]);

      // Enhance with AI
      try {
        const aiResponse = await AiService.enhanceCompanyData({
          url: formattedUrl,
          scrapedData: data,
        });
        data = aiResponse?.data?.data || data;
      } catch (aiError) {
        console.error("AI enhancement failed:", aiError);
      }

      setScrapeProgress(60);
      setScrapeMessages(prev => [...prev, "Extracting brand information..."]);

      // Extract and apply company name
      if (data.companyName && data.companyName.trim() !== "") {
        form.setFieldsValue({ clientName: data.companyName });
        setScrapeMessages(prev => [...prev, `Found company name: ${data.companyName}`]);
      }

      // Extract and apply logo (backend returns "logo", AI enhancement may return "companyLogo")
      const logoUrl = data.companyLogo || data.logo;
      if (logoUrl && logoUrl.trim() !== "") {
        form.setFieldsValue({ companyLogo: logoUrl });
        setScrapeMessages(prev => [...prev, `Found logo`]);
      }

      setScrapeProgress(80);
      setScrapeMessages(prev => [...prev, "Extracting brand colors..."]);

      // Extract and apply colors
      if (data.brandColors && Array.isArray(data.brandColors) && data.brandColors.length > 0) {
        const colors = data.brandColors;
        if (colors[0]) {
          setPrimaryColor(colors[0]);
          form.setFieldsValue({ primaryColor: colors[0] });
        }
        if (colors[1]) {
          setSecondaryColor(colors[1]);
          form.setFieldsValue({ secondaryColor: colors[1] });
        }
        if (colors[2]) {
          setTertiaryColor(colors[2]);
          form.setFieldsValue({ tertiaryColor: colors[2] });
        }
        setScrapeMessages(prev => [...prev, `Found ${colors.length} brand color(s)`]);
      }

      // Extract fonts if available
      if (data.fonts && Array.isArray(data.fonts) && data.fonts.length > 0) {
        const extractedFont = data.fonts[0]?.family || data.fonts[0];
        if (extractedFont && typeof extractedFont === 'string') {
          setTitleFont(extractedFont);
          form.setFieldsValue({ titleFont: extractedFont, selectedFont: extractedFont });
          setScrapeMessages(prev => [...prev, `Found font: ${extractedFont}`]);
        }
      }

      setScrapeProgress(100);
      
      // Determine success level
      const foundItems = [];
      if (data.companyName) foundItems.push("company name");
      if (logoUrl) foundItems.push("logo");
      if (data.brandColors?.length > 0) foundItems.push("colors");
      if (data.fonts?.length > 0) foundItems.push("fonts");

      if (foundItems.length > 0) {
        setScrapeMessages(prev => [...prev, `Website scan completed! Found: ${foundItems.join(", ")}`]);
        message.success(`Brand information extracted: ${foundItems.join(", ")}`);
      } else {
        setScrapeMessages(prev => [...prev, "Scan completed, but couldn't extract much data. Try entering info manually."]);
        message.warning("Couldn't extract brand info from this website. Please enter manually.");
      }

    } catch (error) {
      console.error("Scraping failed:", error);
      setScrapeMessages(prev => [...prev, "Scan failed. Please enter information manually."]);
      message.error("Failed to scan website. Please enter brand information manually.");
    } finally {
      setTimeout(() => {
        setScraping(false);
        setScrapeProgress(0);
        setScrapeMessages([]);
      }, 1500);
    }
  }, [form]);

  const safeText = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") return String(val);
    try {
      // Show a short summary instead of rendering raw object
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  };

  const planHighlights = useMemo(() => {
    const features = user?.planFeatures;

    if (Array.isArray(features)) {
      return features.flatMap((feature) => {
        if (typeof feature === 'string') return feature;
        if (feature && typeof feature === 'object') {
          return Object.values(feature).filter((value) => typeof value === 'string');
        }
        return [];
      });
    }

    if (features && typeof features === 'object') {
      const stringValues = Object.values(features).filter((value) => typeof value === 'string');
      if (stringValues.length > 0) {
        return stringValues;
      }
    }

    return [];
  }, [user?.planFeatures]);

  console.log("planHighlights", planHighlights);

  // Fetch Google Fonts
  useEffect(() => {
    setIsLoadingFonts(true);

    // This is using a proxy to avoid needing an API key. For production, use a proper API key from Google.
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
      })
      .finally(() => setIsLoadingFonts(false));
  }, []);


  const steps = [
    {
      title: "Client Info",
      description: "Basic client details",
    },
    {
      title: "Brand Kit",
      description: "Logo and branding",
    },
    {
      title: "Settings",
      description: "Funnels and access",
    },
  ];

  const handleCreateWorkspace = async (values) => {
    try {
      await createWorkspace(values);
      message.success("Workspace created successfully!");
      router.push("/dashboard/workspaces");
    } catch (error) {
      console.error("Error creating workspace:", error);

      // Handle subscription limit errors
      if (error.response?.data?.currentUsage) {
        const { currentUsage } = error.response.data;
        Modal.error({
          title: 'Subscription Limit Exceeded',
          content: (
            <div>
              <p>You've reached your subscription limit of <strong>{currentUsage.subscriptionLimit} funnels</strong>.</p>
              <p>You currently have <strong>{currentUsage.totalCurrentFunnels} funnels</strong> allocated across your workspaces.</p>
              <p>You requested <strong>{currentUsage.requestedMaxFunnels} funnels</strong> for this workspace.</p>
              <p>You have <strong>{currentUsage.availableFunnels} funnels</strong> available.</p>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-800 font-medium">💡 Options:</p>
                <ul className="text-blue-700 text-sm mt-2">
                  <li>• Reduce funnels in existing workspaces</li>
                  <li>• Upgrade your subscription plan</li>
                  <li>• Purchase additional funnels</li>
                </ul>
              </div>
            </div>
          ),
          width: 520,
        });
      } else {
        message.error(error.response?.data?.message || "Failed to create workspace");
      }
    }
  };

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = (values) => {
    // Normalize hex colors and font objects
    const normalizeHex = (hex) => {
      if (!hex) return hex;
      return hex.startsWith('#') ? hex : `#${hex}`;
    };

    const toFontObj = (family) => {
      if (!family) return undefined;
      const match = (googleFonts || []).find((f) => f.family === family) || (fonts || []).find((f) => f.family === family);
      return { family, src: match?.src || '' };
    };

    // Build full payload explicitly so branding always persists
    const workspaceData = {
      // Required
      clientName: values.clientName,
      name: values.clientName,

      // Client info
      clientDomain: values.clientDomain || "",
      clientEmail: values.clientEmail || "",

      // Brand kit
      companyName: values.companyName || values.clientName,
      companyWebsite: values.companyWebsite || "",
      companyAddress: values.companyAddress || "",
      companyLogo: values.companyLogo || "",
      primaryColor: normalizeHex(values.primaryColor || "#0066CC"),
      secondaryColor: normalizeHex(values.secondaryColor || "#333333"),
      tertiaryColor: normalizeHex(values.tertiaryColor || "#666666"),
      heroBackgroundColor: normalizeHex(values.heroBackgroundColor || "#F5F8FC"),
      heroTitleColor: normalizeHex(values.heroTitleColor || "#222222"),
      // Optional font selections (if present)
      ...(values.selectedFont ? { selectedFont: toFontObj(values.selectedFont) } : {}),
      ...(values.titleFont ? { titleFont: toFontObj(values.titleFont) } : {}),
      ...(values.subheaderFont ? { subheaderFont: toFontObj(values.subheaderFont) } : {}),
      ...(values.bodyFont ? { bodyFont: toFontObj(values.bodyFont) } : {}),

      // Settings
      maxFunnels: Number(values.maxFunnels ?? 0),
      atsAccess: values.atsAccess !== false,
      customDomain: values.customDomain || "",
    };

    handleCreateWorkspace(workspaceData);
  };

  return (
    <Layout>
      <div className="flex flex-col lg:min-h-screen min-h-[600px] overflow-hidden bg-white px-4 sm:px-6 md:px-16 w-full py-4 sm:py-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/dashboard/workspaces")}
            className="mb-4 hover:bg-gray-50"
          >
            Back to Workspaces
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8 flex-1">
          {/* Form */}
          <div className="flex-1 max-w-4xl mx-auto w-full">
            {/* Title */}
            <div className="mb-8">
              <Title level={2} className="mb-2">Create New Workspace</Title>
              <Text type="secondary" className="text-base">
                Set up a new workspace for your client with custom branding and access controls.
              </Text>
            </div>

            {/* Steps Progress */}
            <div className="mb-8 hidden md:block">
              <Steps current={currentStep} size="small">
                {steps.map((step, index) => (
                  <Step key={index} title={step.title} description={step.description} />
                ))}
              </Steps>
            </div>

            {/* Form Card */}
            <Card className="shadow-sm">
          <Form
            form={form}
            layout="vertical"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && currentStep < steps.length - 1) {
                e.preventDefault();
              }
            }}
            initialValues={{
              maxFunnels: 0,
              atsAccess: true,
              primaryColor: "#0066CC",
              secondaryColor: "#333333",
              tertiaryColor: "#666666",
              heroBackgroundColor: "#ffffff",
              heroTitleColor: "#000000",
              brandColors: [],
              selectedFont: { family: "", src: "" },
              titleFont: "",
              subheaderFont: "",
              bodyFont: "",
            }}
          >
            {/* Step 1: Client Information */}
            <div className="space-y-6" style={{ display: currentStep === 0 ? 'block' : 'none' }}>
              <div>
                <Title level={4}>Client Information</Title>
                <Text type="secondary">
                  Basic information about your client and their workspace.
                </Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label="Client Name"
                  name="clientName"
                  rules={[{ required: true, message: 'Please enter client name' }]}
                >
                  <Input size="large" placeholder="Enter client name" />
                </Form.Item>

              

                <Form.Item
                  label="Client Email"
                  name="clientEmail"
                  rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                >
                  <Input size="large" placeholder="contact@clientcompany.com" />
                </Form.Item>

                <Form.Item label="Company Website" name="companyWebsite">
                  <Input size="large" placeholder="https://clientcompany.com" />
                </Form.Item>
              </div>

              {/* Scan Website Button */}
              <div className="mb-4">
                <Button
                  type="default"
                  icon={<SearchOutlined />}
                  onClick={handleScrapeWebsite}
                  loading={scraping}
                  disabled={scraping}
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  {scraping ? "Scanning..." : "Scan Website for Brand Info"}
                </Button>
                <Typography.Text type="secondary" className="ml-3 text-sm">
                  Auto-extract logo, colors, and company name from the website
                </Typography.Text>
              </div>

              {/* Scraping Progress */}
              {scraping && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <Progress percent={scrapeProgress} size="small" status="active" />
                  <div className="mt-2 text-sm text-gray-600">
                    {scrapeMessages[scrapeMessages.length - 1]}
                  </div>
                </div>
              )}

              <Form.Item label="Company Address" name="companyAddress">
                <Input.TextArea
                  rows={3}
                  placeholder="Company address (optional)"
                />
              </Form.Item>
            </div>

            {/* Step 2: Brand Kit */}
            <div className="space-y-6" style={{ display: currentStep === 1 ? 'block' : 'none' }}>
              <div>
                <Title level={4}>Branding</Title>
                <Text type="secondary">
                  Customize the branding for this workspace.
                </Text>
              </div>

              {/* Step 2 Content (Brand Assets) */}
              <div className="space-y-6">
                {/* Logo Upload Section */}
                <div>
                  <Typography.Text className="mb-1.5 block text-sm text-gray-700">
                    Upload your logo. Horizontally oriented logos display best. We recommend avoiding logos with too much white space.
                  </Typography.Text>
                  <div className="mt-2">
                    <ImageUploader
                      maxFiles={1}
                      multiple={false}
                      defaultImage={form.getFieldValue('companyLogo')}
                      imageAdjustments={{}}
                      fieldKey="companyLogo"
                      onImageUpload={(url) => {
                        console.log("ImageUploader callback called with:", url);
                        // Handle different formats that ImageUploader might pass
                        const logoUrl = Array.isArray(url) ? url[0] : url;
                        if (logoUrl && logoUrl !== "") {
                          form.setFieldsValue({ companyLogo: logoUrl });
                        }
                      }}
                      isSettingDisabled={false}
                      type="image"
                      accept="image/*"
                      isLogo={true}
                      currentSectionLimits={{
                        images: 1,
                        videos: 0,
                        mediaType: "image",
                      }}
                      allowedTabs={["image"]}
                      onImageAdjustmentChange={(fieldKey, adjustments) => {}}
                    />
                  </div>
                </div>

                {/* Brand Colors Section */}
                <div>
                  <Typography.Text strong className="mb-2 block text-md text-gray-700">
                    Color Palette
                  </Typography.Text>
                  <div className="flex flex-wrap gap-4 justify-start items-start">
                    {/* Main color section */}
                    <Form.Item name="primaryColor" hidden>
                      <Input />
                    </Form.Item>
                    <div className="flex gap-2 justify-center items-center">
                      <ColorPickerButton
                        label="Main"
                        color={primaryColor}
                        setColor={handlePrimaryColorChange}
                      />
                      <div>
                        <Typography.Text className="block text-sm text-gray-700">
                          Primary Color
                        </Typography.Text>
                        <Typography.Text className="block text-sm text-gray-700">
                          {primaryColor}
                        </Typography.Text>
                      </div>
                    </div>
                    {/* Secondary color section */}
                    <Form.Item name="secondaryColor" hidden>
                      <Input />
                    </Form.Item>
                    <div className="flex gap-2 justify-center items-center">
                      <ColorPickerButton
                        label="Secondary"
                        color={secondaryColor}
                        setColor={handleSecondaryColorChange}
                      />
                      <div>
                        <Typography.Text className="block text-sm text-gray-700">
                          Secondary Color
                        </Typography.Text>
                        <Typography.Text className="block text-sm text-gray-700">
                          {secondaryColor}
                        </Typography.Text>
                      </div>
                    </div>
                    {/* Tertiary color section */}
                    <Form.Item name="tertiaryColor" hidden>
                      <Input />
                    </Form.Item>
                    <div className="flex gap-2 justify-center items-center">
                      <ColorPickerButton
                        label="Tertiary"
                        color={tertiaryColor}
                        setColor={handleTertiaryColorChange}
                      />
                      <div>
                        <Typography.Text className="block text-sm text-gray-700">
                          Tertiary Color
                        </Typography.Text>
                        <Typography.Text className="block text-sm text-gray-700">
                          {tertiaryColor}
                        </Typography.Text>
                      </div>
                    </div>
                  </div>

                  {/* Hidden form fields for branding */}
                  <Form.Item name="companyLogo" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="titleFont" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="subheaderFont" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="bodyFont" hidden>
                    <Input />
                  </Form.Item>
                </div>

                {/* Typography Section */}
                <div>
                  <Typography.Text strong className="mb-1.5 block text-md text-gray-700">
                    Text Style
                  </Typography.Text>

                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
                    {/* Title Font Card */}
                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedFontStyle === "h1"
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedFontStyle("h1")}
                    >
                      <div className="flex items-start gap-2">
                        <Radio
                          checked={selectedFontStyle === "h1"}
                          className="mr-2 mt-0.5"
                        />
                        <div>
                          <Typography.Text strong className="text-gray-700">
                            Title Style
                          </Typography.Text>
                          <Typography.Text className="block text-xs text-gray-500">
                            {titleFont || "No font selected"}
                          </Typography.Text>
                        </div>
                      </div>
                    </div>

                    {/* Subheader Font Card */}
                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedFontStyle === "h2"
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedFontStyle("h2")}
                    >
                      <div className="flex items-start gap-2">
                        <Radio
                          checked={selectedFontStyle === "h2"}
                          className="mt-0.5"
                        />
                        <div>
                          <Typography.Text strong className="text-gray-700">
                            H2, H3 Style
                          </Typography.Text>
                          <Typography.Text className="block text-xs text-gray-500">
                            {subheaderFont || "No font selected"}
                          </Typography.Text>
                        </div>
                      </div>
                    </div>

                    {/* Body Font Card */}
                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedFontStyle === "h3"
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedFontStyle("h3")}
                    >
                      <div className="flex items-start gap-2">
                        <Radio
                          checked={selectedFontStyle === "h3"}
                          className="mt-0.5"
                        />
                        <div>
                          <Typography.Text strong className="text-gray-700">
                            Body Style
                          </Typography.Text>
                          <Typography.Text className="block text-xs text-gray-500">
                            {bodyFont || "No font selected"}
                          </Typography.Text>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Font Selection Dropdown */}
                  <div className="mb-6">
                    {isLoadingFonts ? (
                      <div className="flex justify-center items-center py-4">
                        <Spin size="small" />
                        <span className="ml-2 text-sm text-gray-500">Loading fonts...</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex mb-2">
                          <Typography.Text strong className="text-md text-gray-700">
                            Select a font for {selectedFontStyle === "h1" ? "titles" :
                                              selectedFontStyle === "h2" ? "subheaders" : "body text"}
                          </Typography.Text>
                        </div>

                        <Select
                          showSearch
                          value={
                            selectedFontStyle === "h1"
                              ? (titleFont || undefined)
                              : selectedFontStyle === "h2"
                              ? (subheaderFont || undefined)
                              : (bodyFont || undefined)
                          }
                          onChange={(value) => {
                            // Update local state (triggers re-render)
                            if (selectedFontStyle === "h1") {
                              setTitleFont(value);
                              form.setFieldsValue({
                                titleFont: value,
                                selectedFont: value
                              });
                            } else if (selectedFontStyle === "h2") {
                              setSubheaderFont(value);
                              form.setFieldsValue({ subheaderFont: value });
                            } else {
                              setBodyFont(value);
                              form.setFieldsValue({ bodyFont: value });
                            }

                            console.log(`Font ${selectedFontStyle} changed to:`, value);
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
                          optionRender={(option) => (
                            <div className="flex items-center justify-between py-1">
                              <span 
                                style={{ fontFamily: option.value, fontSize: '16px' }}
                              >
                                {option.value}
                              </span>
                              <span 
                                style={{ fontFamily: option.value, fontSize: '14px', color: '#666' }}
                              >
                                Aa Bb Cc
                              </span>
                            </div>
                          )}
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
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Settings */}
            <div className="space-y-6" style={{ display: currentStep === 2 ? 'block' : 'none' }}>
              <div>
                <Title level={4}>Workspace Settings</Title>
                <Text type="secondary">
                  Configure funnels, access controls, and domain settings.
                </Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label="Max Funnels"
                  name="maxFunnels"
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (value === undefined || value === null || value === "") return Promise.resolve();
                        const num = Number(value);
                        if (Number.isNaN(num) || num < 0) {
                          return Promise.reject(new Error('Enter a valid non-negative number'));
                        }
                        if (remainingFunnels !== null && num > remainingFunnels) {
                          return Promise.reject(new Error(`Cannot exceed available limit (${remainingFunnels})`));
                        }
                        return Promise.resolve();
                      }
                    })
                  ]}
                  extra={remainingFunnels !== null ? `Available to allocate: ${remainingFunnels}` : undefined}
                >
                  <Input
                    type="number"
                    size="large"
                    min={0}
                    max={remainingFunnels ?? 100}
                    placeholder="10"
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      if (remainingFunnels !== null && val > remainingFunnels) {
                        message.warning(`Cannot exceed available limit (${remainingFunnels})`);
                        form.setFieldsValue({ maxFunnels: remainingFunnels });
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item label="Custom Domain" name="customDomain">
                  <Input size="large" placeholder="careers.clientcompany.com" />
                </Form.Item>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <Text strong>Access Control Preview:</Text>
                <div className="mt-2 space-y-1 text-sm">
                  <div>• Owner: Full workspace access</div>
                  <div>• Admin: Manage funnels and team</div>
                  <div>• Editor: Create and edit funnels</div>
                  <div>• Viewer: Read-only access</div>
                  <div>• ATS Only: ATS access only (for agencies)</div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Divider />

            <div className="flex justify-between">
              <Button
                disabled={currentStep === 0}
                onClick={prev}
              >
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="primary" onClick={next}>
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    form
                      .validateFields()
                      .then((values) => handleFinish(values))
                      .catch(() => {});
                  }}
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Create Workspace
                </Button>
              )}
            </div>
          </Form>
        </Card>
          </div>

        </div>
      </div>

      {/* Purchase Modal */}
      <Modal
        title="Purchase Additional Funnels"
        open={purchaseModalVisible}
        onCancel={() => {
          setPurchaseModalVisible(false);
          setFunnelsToPurchase(5);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setPurchaseModalVisible(false);
              setFunnelsToPurchase(5);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="purchase"
            type="primary"
            icon={<PlusOutlined />}
            loading={loading}
            onClick={async () => {
              try {
                await purchaseAdditionalFunnels(funnelsToPurchase);
                message.success(`Successfully initiated purchase of ${funnelsToPurchase} additional funnels!`);
                setPurchaseModalVisible(false);
                setFunnelsToPurchase(5);
              } catch (error) {
                message.error('Failed to initiate purchase. Please try again.');
              }
            }}
          >
            Purchase {funnelsToPurchase} Funnels (${funnelsToPurchase * 10})
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <p>You need additional funnels to create this workspace. How many additional funnels would you like to purchase?</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Additional Funnels
              </label>
              <select
                value={funnelsToPurchase}
                onChange={(e) => setFunnelsToPurchase(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 Funnel</option>
                <option value={5}>5 Funnels</option>
                <option value={10}>10 Funnels</option>
                <option value={25}>25 Funnels</option>
                <option value={50}>50 Funnels</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{funnelsToPurchase} Additional Funnels</div>
                  <div className="text-sm text-gray-600">
                    {funnelsToPurchase === 1 && "Perfect for testing new processes"}
                    {funnelsToPurchase === 5 && "Great for growing teams"}
                    {funnelsToPurchase === 10 && "Ideal for expanding your hiring pipeline"}
                    {funnelsToPurchase === 25 && "Perfect for scaling operations"}
                    {funnelsToPurchase === 50 && "Maximum flexibility for large organizations"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${funnelsToPurchase * 10}</div>
                  <div className="text-sm text-gray-500">one-time payment</div>
                  <div className="text-xs text-gray-400">${(funnelsToPurchase * 10 / funnelsToPurchase).toFixed(0)} per funnel</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="text-green-600 mt-0.5">✓</div>
              <div className="text-sm text-green-800">
                <div className="font-medium">What you get:</div>
                <ul className="mt-1 space-y-1">
                  <li>• {funnelsToPurchase} additional recruitment funnels</li>
                  <li>• Can be used across all workspaces</li>
                  <li>• No recurring charges</li>
                  <li>• Lifetime access</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Additional funnels will be added to your account immediately after successful payment and can be used across all your workspaces.
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default WorkspaceCreatePage;
