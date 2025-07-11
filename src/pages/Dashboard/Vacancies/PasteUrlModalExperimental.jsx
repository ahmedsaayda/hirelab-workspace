import { Modal, Tabs, Input, Button, Spin, Alert, Checkbox, Steps, Card } from "antd";
import React, { useState, useEffect } from "react";
import { Heading } from "./components/components/index.jsx";
import AiService from "../../../services/AiService.js";
import HeroSection from "../../Landingpage/HeroSection.js";
import NavBar from "../../Landingpage/NavBar.jsx";
import { renderSection } from "../../LandingpageEdit/renderSection.js";
import Footer from "../../Landingpage/Footer.js";
import { PreviewContainer } from "./components/preview-container.jsx";


// Logger utility
const logger = {
  info: (component, message, data = {}) => {
    console.log(`[INFO] [${component}] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },
  error: (component, message, error = {}) => {
    console.error(`[ERROR] [${component}] ${message}`, {
      timestamp: new Date().toISOString(),
      error: error.message || error,
      stack: error.stack,
    });
  },
  debug: (component, message, data = {}) => {
    console.debug(`[DEBUG] [${component}] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },
  performance: (component, action, startTime) => {
    const duration = Date.now() - startTime;
    console.log(`[PERFORMANCE] [${component}] ${action} took ${duration}ms`);
  }
};



// Custom JSON viewer component with syntax highlighting and collapsible sections
const JsonViewer = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState({});

  const toggleCollapse = (key) => {
    setIsCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderValue = (value, key, depth = 0) => {
    const indent = "  ".repeat(depth);
    
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === "boolean") return <span className="text-purple-600">{value.toString()}</span>;
    if (typeof value === "number") return <span className="text-blue-600">{value}</span>;
    if (typeof value === "string") return <span className="text-green-600">"{value}"</span>;
    
    if (Array.isArray(value)) {
      const isCollapsedState = isCollapsed[key];
      return (
        <div>
          <span 
            className="cursor-pointer hover:text-blue-500" 
            onClick={() => toggleCollapse(key)}
          >
            [{isCollapsedState ? '...' : ''}]
          </span>
          {!isCollapsedState && (
            <div style={{ marginLeft: '1rem' }}>
              {value.map((item, index) => (
                <div key={`${key}-${index}`}>
                  {indent}{renderValue(item, `${key}-${index}`, depth + 1)}
                  {index < value.length - 1 && ','}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (typeof value === "object") {
      const isCollapsedState = isCollapsed[key];
      return (
        <div>
          <span 
            className="cursor-pointer hover:text-blue-500" 
            onClick={() => toggleCollapse(key)}
          >
            {'{'}
            {isCollapsedState ? '...' : ''}
            {isCollapsedState && '}'}
          </span>
          {!isCollapsedState && (
            <>
              <div style={{ marginLeft: '1rem' }}>
                {Object.entries(value).map(([k, v], index, arr) => (
                  <div key={`${key}-${k}`}>
                    {indent}<span className="text-red-600">"{k}"</span>: {renderValue(v, `${key}-${k}`, depth + 1)}
                    {index < arr.length - 1 && ','}
                  </div>
                ))}
              </div>
              <div>{indent}{'}'}</div>
            </>
          )}
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  return (
    <div className="font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
      {renderValue(data, 'root')}
    </div>
  );
};

// Prompt viewer component
const PromptViewer = ({ prompt }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold mb-2">AI Prompt:</h4>
      <div className={`bg-gray-50 p-4 rounded border border-gray-200 text-sm font-mono ${!isExpanded ? 'max-h-[100px]' : ''} overflow-y-auto`}>
        {prompt}
      </div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-blue-600 text-sm hover:text-blue-800"
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};

function PasteUrlModalExperimental({ onClose ,onRefresh}) {
  const COMPONENT_NAME = 'PasteUrlModalExperimental';
  
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Scraping state
  const [scrapingState, setScrapingState] = useState({
    loading: false,
    error: null,
    data: null
  });

  // AI processing state
  const [processingState, setProcessingState] = useState({
    loading: false,
    error: null
  });

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [activePreview, setActivePreview] = useState(null);

  // AI model selection
  const [selectedAiModel, setSelectedAiModel] = useState('gpt');

  // Log component mount and cleanup
  useEffect(() => {
    logger.info(COMPONENT_NAME, 'Component mounted');
    return () => {
      logger.info(COMPONENT_NAME, 'Component unmounted');
    };
  }, []);

  // URL validation
  const validateUrl = (url) => {
    logger.debug(COMPONENT_NAME, 'Validating URL', { url });
    try {
      const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

      if (!url || url.trim() === "") {
        logger.debug(COMPONENT_NAME, 'URL validation failed: empty URL');
        setUrlError("Please enter a URL");
        return false;
      }

      if (!urlPattern.test(url)) {
        logger.debug(COMPONENT_NAME, 'URL validation failed: invalid format', { url });
        setUrlError("Please enter a valid URL");
        return false;
      }

      logger.debug(COMPONENT_NAME, 'URL validation successful', { url });
      setUrlError(null);
      return true;
    } catch (error) {
      logger.error(COMPONENT_NAME, 'URL validation error', error);
      setUrlError("Invalid URL format");
      return false;
    }
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    logger.debug(COMPONENT_NAME, 'URL input changed', { newUrl });
    setUrl(newUrl);
    if (urlError) {
      setUrlError(null);
    }
  };

  // Step 1: Scrape URL
  const handleScrapeUrl = async () => {
    logger.info(COMPONENT_NAME, 'Starting scraping process', { url });
    if (!validateUrl(url)) return;

    const startTime = Date.now();
    setScrapingState({
      loading: true,
      error: null,
      data: null,
      startTime
    });

    try {
      logger.debug(COMPONENT_NAME, 'Calling scrape URL API');
      const response = await AiService.scrapeUrl(url, 'both');
      const endTime = Date.now();

      if (response.data.success) {
        logger.info(COMPONENT_NAME, 'Scraping completed successfully');
        setScrapingState({
          loading: false,
          error: null,
          data: response.data.data,
          startTime,
          endTime
        });
        setCurrentStep(1); // Move to step 2
        logger.performance(COMPONENT_NAME, 'Scraping', startTime);
      } else {
        throw new Error(response.data.error || 'Scraping failed');
      }
    } catch (error) {
      logger.error(COMPONENT_NAME, 'Scraping failed', error);
      setScrapingState({
        loading: false,
        error: error.message || 'Failed to scrape URL',
        data: null
      });
    }
  };

  // Step 2: Process with AI
  const handleProcessWithAI = async () => {
    if (!scrapingState.data) {
      logger.error(COMPONENT_NAME, 'No scraped data available for AI processing');
      return;
    }

    logger.info(COMPONENT_NAME, 'Starting AI processing', { aiModel: selectedAiModel });
    const startTime = Date.now();
    setProcessingState({
      loading: true,
      error: null,
      startTime
    });

    try {
      logger.debug(COMPONENT_NAME, 'Calling AI processing API');
      const response = await AiService.processContentWithAI(
        url,
        scrapingState.data.scrapeContent,
        scrapingState.data.copyTextContent,
        selectedAiModel
      );
      const endTime = Date.now();

      if (response.data.success) {
        logger.info(COMPONENT_NAME, 'AI processing completed successfully');
        setProcessingState({
          loading: false,
          error: null,
          data: response.data.data,
          startTime,
          endTime
        });
        setCurrentStep(2); // Move to results step
        logger.performance(COMPONENT_NAME, 'AI Processing', startTime);
      } else {
        throw new Error(response.data.error || 'AI processing failed');
      }
    } catch (error) {
      logger.error(COMPONENT_NAME, 'AI processing failed', error);
      setProcessingState({
        loading: false,
        error: error.message || 'Failed to process content with AI'
      });
    }
  };

  // Reset to start over
  const handleStartOver = () => {
    setCurrentStep(0);
    setScrapingState({ loading: false, error: null, data: null });
    setProcessingState({ loading: false, error: null });
    setShowPreview(false);
    setPreviewData(null);
    setActivePreview(null);
  };

  // Preview component
  const Preview = ({ initdata }) => {
    const menuItems = [
      { "key": "Job Specifications" },
      { "key": "Recruiter Contact" },
      { "key": "Job Description" },
      { "key": "Agenda" },
      { "key": "About The Company" },
      { "key": "Company Facts" },
      { "key": "Leader Introduction" },
      { "key": "Employee Testimonials" },
      { "key": "Growth Path" },
      { "key": "Video" }
    ];

    const data = {
      ...initdata,
      menuItems: menuItems,
      templateId: "1",
      "primaryColor": "#f2ff00",
      "secondaryColor": "#636302",
      "tertiaryColor": "#3e359f",
      "heroBackgroundColor": "#092a26",
      "heroTitleColor": "#222222",
      "selectedFont": {
        "family": "Oxygen",
        "src": "https://fonts.googleapis.com/css2?family=Oxygen:wght@400;700&display=swap"
      },
      "titleFont": {
        "family": "Oxygen",
        "src": "https://fonts.googleapis.com/css2?family=Oxygen:wght@400;700&display=swap"
      },
      "subheaderFont": {
        "family": "Fjalla One",
        "src": "https://fonts.googleapis.com/css2?family=Fjalla+One:wght@400;700&display=swap"
      },
      "bodyFont": {
        "family": "Public Sans",
        "src": "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;700&display=swap"
      },
      "brandColors": []
    };

    if (!data) return null;

    return (
      <div className="mx-auto ] overflow-x-hidden overflow-y-auto scrollbar-hide lg:h-[calc(100vh-50px)] lg:min-h-[450px] xl:h-[calc(100vh-50px)] xl:min-h-[700px] min-h-[450px] mt-4 text-sm text-center text-gray-400  rounded-lg">

      </div>
    );
  };

  // Render result section
  const renderProcessingResult = (result, type) => {
    if (!result) return null;

    const processingTime = processingState.startTime && processingState.endTime 
      ? `Processing time: ${(processingState.endTime - processingState.startTime) / 1000}s`
      : '';

    return (
      <Card 
        title={`${type === 'scrape' ? 'Scrape' : 'Copy Text'} + GPT Result`}
        className="mb-4" 
        extra={
          <Button 
            type="primary"
            size="small"
            onClick={() => {
              setPreviewData(result.data);
              setActivePreview(type);
            }}
          >
            Preview Result
          </Button>
        }
      >
        {processingTime && (
          <div className="mb-2 text-sm text-gray-500">{processingTime}</div>
        )}
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Raw Content:</h4>
          <div className="max-h-[200px] overflow-y-auto bg-gray-50 p-4 rounded border border-gray-200 text-sm font-mono">
            {result.rawContent}
          </div>
        </div>

        {result.prompt && <PromptViewer prompt={result.prompt} />}

        <div className="mb-2">
          <h4 className="text-sm font-semibold">AI Analysis:</h4>
        </div>
        <JsonViewer data={result.data} />
      </Card>
    );
  };

  return (
    <Modal
      title=""
      open={true}
      onCancel={() => {
        logger.info(COMPONENT_NAME, 'Modal closed');
        onClose();
      }}
      width={activePreview ? "90%" : 900}
      footer={null}
    >
      <div className="mb-6">
        <Heading size="7xl" as="h1" className="!text-black-900_01 text-center">
          URL Analysis - Scrape + AI
        </Heading>

        {/* Steps indicator */}
        <div className="mt-6 mb-6">
          <Steps
            current={currentStep}
            items={[
              {
                title: 'Enter URL',
                description: 'Paste the URL to analyze',
              },
              {
                title: 'Scrape Content',
                description: 'Extract content from the URL',
              },
              {
                title: 'Process with AI',
                description: 'Generate structured vacancy page',
              },
            ]}
          />
        </div>

        {activePreview ? (
          <div className="relative">
            <Button 
              type="link" 
              className="absolute right-0 top-0 z-10"
              onClick={() => setActivePreview(null)}
            >
              Back to Analysis
            </Button>
            <div className="h-[calc(100vh-300px)] overflow-auto">
              <Preview initdata={JSON.parse(previewData)} />
            </div>
          </div>
        ) : (
          <>
            {/* Step 0: URL Input */}
            {currentStep === 0 && (
              <div>
                <div className="mt-4">
                  <Input
                    type="url"
                    className={`w-full ${urlError ? 'border-red-500' : ''}`}
                    placeholder="Enter Job Post URL"
                    value={url}
                    onChange={handleUrlChange}
                  />
                  {urlError && (
                    <p className="mt-1 text-xs text-red-500">{urlError}</p>
                  )}
                </div>

                <Button
                  type="primary"
                  className="mt-4 w-full"
                  onClick={handleScrapeUrl}
                  disabled={!url || scrapingState.loading}
                  loading={scrapingState.loading}
                >
                  {scrapingState.loading ? 'Scraping URL...' : 'Start Analysis'}
                </Button>

                {scrapingState.error && (
                  <Alert 
                    type="error" 
                    message={scrapingState.error} 
                    className="mt-4"
                    action={
                      <Button size="small" onClick={handleScrapeUrl}>
                        Retry
                      </Button>
                    }
                  />
                )}
              </div>
            )}

            {/* Step 1: Show scraped content and AI processing options */}
            {currentStep === 1 && scrapingState.data && (
              <div>
                <Alert 
                  type="success" 
                  message="Content scraped successfully!" 
                  description={`Scrape content: ${scrapingState.data.scrapeContent?.length || 0} chars, Copy text content: ${scrapingState.data.copyTextContent?.length || 0} chars`}
                  className="mb-4"
                />

                <Card title="Scraped Content Preview" className="mb-4">
                  <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Raw Scrape" key="1">
                      <div className="max-h-[200px] overflow-y-auto bg-gray-50 p-4 rounded border border-gray-200 text-sm font-mono">
                        {scrapingState.data.scrapeContent || 'No content available'}
                      </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Copy Text" key="2">
                      <div className="max-h-[200px] overflow-y-auto bg-gray-50 p-4 rounded border border-gray-200 text-sm font-mono">
                        {scrapingState.data.copyTextContent || 'No content available'}
                      </div>
                    </Tabs.TabPane>
                  </Tabs>
                </Card>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Select AI Model:</h4>
                  <div className="flex gap-2">
                    <Checkbox
                      checked={selectedAiModel === 'gpt'}
                      onChange={() => setSelectedAiModel('gpt')}
                    >
                      GPT-4
                    </Checkbox>
                    <Checkbox
                      checked={selectedAiModel === 'gemini'}
                      onChange={() => setSelectedAiModel('gemini')}
                    >
                      Google Gemini
                    </Checkbox>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="primary"
                    className="flex-1"
                    onClick={handleProcessWithAI}
                    disabled={processingState.loading}
                    loading={processingState.loading}
                  >
                    {processingState.loading ? 'Processing with AI...' : 'Process with AI'}
                  </Button>
                  <Button onClick={handleStartOver}>
                    Start Over
                  </Button>
                </div>

                {processingState.error && (
                  <Alert 
                    type="error" 
                    message={processingState.error} 
                    className="mt-4"
                    action={
                      <Button size="small" onClick={handleProcessWithAI}>
                        Retry
                      </Button>
                    }
                  />
                )}
              </div>
            )}

            {/* Step 2: Show AI processing results */}
            {currentStep === 2 && processingState.data && (
              <div>
                <Alert 
                  type="success" 
                  message="AI processing completed!" 
                  className="mb-4"
                  action={
                    <Button size="small" onClick={handleStartOver}>
                      Start Over
                    </Button>
                  }
                />

                {processingState.data.scrapeResult && 
                  renderProcessingResult(processingState.data.scrapeResult, 'scrape')}
                
                {processingState.data.copyTextResult && 
                  renderProcessingResult(processingState.data.copyTextResult, 'copyText')}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

export default PasteUrlModalExperimental;
