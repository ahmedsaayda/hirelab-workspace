import React, { useState, useMemo } from 'react';
import { Modal, Tabs, Alert, Badge, Collapse, Timeline, Card, Input, Button } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ChevronDown, ChevronRight, Search, X, Copy } from 'lucide-react';



const { TabPane } = Tabs;
const { Panel } = Collapse;

const JsonNode = ({ data, keyName, level, isLast, searchTerm, defaultExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getValueType = (value) => {
    if (value === null) return "null";
    if (typeof value === "string") return "string";
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";
    if (Array.isArray(value)) return "array";
    if (typeof value === "object") return "object";
    return "unknown";
  };

  const getValueColor = (type) => {
    switch (type) {
      case "string":
        return "text-green-600";
      case "number":
        return "text-blue-600";
      case "boolean":
        return "text-purple-600";
      case "null":
        return "text-gray-500";
      default:
        return "text-gray-800";
    }
  };

  const highlightSearchTerm = (text, term) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const renderValue = (value) => {
    const type = getValueType(value);
    const colorClass = getValueColor(type);

    switch (type) {
      case "string":
        return <span className={colorClass}>"{highlightSearchTerm(value, searchTerm)}"</span>;
      case "number":
      case "boolean":
        return <span className={colorClass}>{String(value)}</span>;
      case "null":
        return <span className={colorClass}>null</span>;
      default:
        return <span className={colorClass}>{String(value)}</span>;
    }
  };

  const isExpandable = (value) => {
    return (
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "object" && value !== null && Object.keys(value).length > 0)
    );
  };

  const getPreview = (value) => {
    if (Array.isArray(value)) {
      return `Array(${value.length})`;
    }
    if (typeof value === "object" && value !== null) {
      const keys = Object.keys(value);
      return `Object(${keys.length})`;
    }
    return "";
  };

  const indent = "  ".repeat(level);

  if (!isExpandable(data)) {
    return (
      <div className="font-mono text-sm">
        <span className="text-gray-400">{indent}</span>
        {keyName && (
          <>
            <span className="text-blue-800 font-medium">"{highlightSearchTerm(keyName, searchTerm)}"</span>
            <span className="text-gray-600">: </span>
          </>
        )}
        {renderValue(data)}
        {!isLast && <span className="text-gray-600">,</span>}
      </div>
    );
  }

  const entries = Array.isArray(data) ? data.map((item, index) => [index.toString(), item]) : Object.entries(data);

  return (
    <div className="font-mono text-sm">
      <div className="flex items-center">
        <span className="text-gray-400">{indent}</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center hover:bg-gray-100 rounded px-1 -ml-1"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {keyName && (
          <>
            <span className="text-blue-800 font-medium ml-1">"{highlightSearchTerm(keyName, searchTerm)}"</span>
            <span className="text-gray-600">: </span>
          </>
        )}
        <span className="text-gray-600">{Array.isArray(data) ? "[" : "{"}</span>
        {!isExpanded && (
          <>
            <span className="text-gray-500 text-xs ml-2">{getPreview(data)}</span>
            <span className="text-gray-600 ml-1">{Array.isArray(data) ? "]" : "}"}</span>
          </>
        )}
      </div>

      {isExpanded && (
        <>
          {entries.map(([key, value], index) => (
            <JsonNode
              key={key}
              data={value}
              keyName={Array.isArray(data) ? undefined : key}
              level={level + 1}
              isLast={index === entries.length - 1}
              searchTerm={searchTerm}
              defaultExpanded={defaultExpanded}
            />
          ))}
          <div className="font-mono text-sm">
            <span className="text-gray-400">{indent}</span>
            <span className="text-gray-600">{Array.isArray(data) ? "]" : "}"}</span>
            {!isLast && <span className="text-gray-600">,</span>}
          </div>
        </>
      )}
    </div>
  );
};

const JsonViewer = ({
  data,
  title = "JSON Viewer",
  searchable = true,
  copyable = true,
  defaultExpanded = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const jsonString = useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return "Invalid JSON data";
    }
  }, [data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="w-full">
      <div className="border rounded-lg">
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 pr-7 w-40 h-7 text-xs"
                  size="small"
                />
                {searchTerm && (
                  <button onClick={clearSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            )}
            {copyable && (
              <Button 
                size="small" 
                onClick={handleCopy} 
                className="h-7 text-xs"
                type={copied ? "primary" : "default"}
              >
                <Copy className="w-3 h-3 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-4 max-h-80 overflow-auto">
          <JsonNode 
            data={data} 
            level={0} 
            isLast={true} 
            searchTerm={searchTerm} 
            defaultExpanded={defaultExpanded} 
          />
        </div>
      </div>
    </div>
  );
};

function VacancyCreationDebugModal({ isOpen, onClose, debugData }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!debugData) return null;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'error':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'in_progress':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#666' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'in_progress': return 'processing';
      default: return 'default';
    }
  };

  const OverviewTab = () => (
    <div className="space-y-4">
      <Alert
        message="Vacancy Creation Debug Information"
        description={`This modal shows detailed information about the vacancy creation process for debugging purposes.`}
        type="info"
        showIcon
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Basic Info</h3>
          <div className="mt-2 space-y-1 text-sm">
            <div><strong>URL:</strong> {debugData.url}</div>
            <div><strong>Started:</strong> {formatTimestamp(debugData.startTime)}</div>
            {debugData.endTime && (
              <div><strong>Completed:</strong> {formatTimestamp(debugData.endTime)}</div>
            )}
            {debugData.totalProcessingTime && (
              <div><strong>Total Time:</strong> {formatDuration(debugData.totalProcessingTime)}</div>
            )}
            <div><strong>Version:</strong> {debugData.version || 'N/A'}</div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Process Summary</h3>
          <div className="mt-2 space-y-1 text-sm">
            <div><strong>Total Steps:</strong> {debugData.steps.length}</div>
            <div><strong>Successful Steps:</strong> {debugData.steps.filter(s => s.status === 'success').length}</div>
            <div><strong>Errors:</strong> {debugData.errors.length}</div>
            <div><strong>Status:</strong> 
              <Badge 
                status={debugData.errors.length > 0 ? 'error' : 'success'} 
                text={debugData.errors.length > 0 ? 'Failed' : 'Success'} 
                className="ml-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const StepsTab = () => (
    <div>
      <Timeline>
        {debugData.steps.map((step, index) => (
          <Timeline.Item
            key={index}
            dot={getStatusIcon(step.status)}
            color={step.status === 'success' ? 'green' : step.status === 'error' ? 'red' : 'blue'}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{step.name}</h4>
                <Badge status={getStatusColor(step.status)} />
              </div>
              <div className="text-xs text-gray-500">
                Step {step.step} • {formatTimestamp(step.timestamp)}
              </div>
              {step.data && (
                <Collapse size="small">
                  <Panel header="View Step Data" key="1">
                    <JsonViewer data={step.data} title="Step Data" defaultExpanded={false} />
                  </Panel>
                </Collapse>
              )}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );

  const ErrorsTab = () => (
    <div className="space-y-4">
      {debugData.errors.length === 0 ? (
        <Alert message="No errors occurred during the process" type="success" showIcon />
      ) : (
        debugData.errors.map((error, index) => (
          <Alert
            key={index}
            message={error.error}
            description={
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Step:</strong> {error.step} • <strong>Time:</strong> {formatTimestamp(error.timestamp)}
                </div>
                <div className="text-sm">
                  <strong>Details:</strong> {error.details}
                </div>
                {error.stack && (
                  <Collapse size="small">
                    <Panel header="Stack Trace" key="1">
                      <pre className="text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </Panel>
                  </Collapse>
                )}
                {error.data && (
                  <Collapse size="small">
                    <Panel header="Error Data" key="2">
                      <JsonViewer data={error.data} title="Error Data" defaultExpanded={false} />
                    </Panel>
                  </Collapse>
                )}
              </div>
            }
            type="error"
            showIcon
          />
        ))
      )}
    </div>
  );

  const FinalResultTab = () => (
    <div className="space-y-4">
      <Alert
        message="Final AI Result"
        description="This is the final processed result that was used to create the vacancy."
        type="info"
        showIcon
      />
      {debugData.finalResult ? (
        <JsonViewer data={debugData.finalResult} title="Final AI Generated Content" defaultExpanded={false} />
      ) : (
        <Alert message="No final result available" type="warning" showIcon />
      )}
    </div>
  );

  const PromptTab = () => {
    // Extract the prompt from debug data
    const promptData = debugData.steps.find(step => 
      step.name === "AI Result Retrieved" && step.data?.rawResult?.prompt
    )?.data?.rawResult?.prompt;

    return (
      <div className="space-y-4">
        <Alert
          message="AI Prompt"
          description="This is the exact prompt that was sent to GPT for processing the vacancy content."
          type="info"
          showIcon
        />
        {promptData ? (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-800">Prompt Content</h4>
              <Button 
                size="small" 
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(promptData);
                    // Could add a toast notification here
                  } catch (error) {
                    console.error("Failed to copy:", error);
                  }
                }}
                className="h-7 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy Prompt
              </Button>
            </div>
            <div className="bg-white p-4 rounded border max-h-80 overflow-auto">
              <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700">
                {promptData}
              </pre>
            </div>
          </div>
        ) : (
          <Alert message="No prompt data available" type="warning" showIcon />
        )}
      </div>
    );
  };

  const RawDataTab = () => (
    <div className="space-y-4">
      <Alert
        message="Complete Debug Data"
        description="This is the complete raw debug data structure."
        type="info"
        showIcon
      />
      <JsonViewer data={debugData} title="Complete Debug Data" defaultExpanded={false} />
    </div>
  );

  return (
    <Modal
      title="Vacancy Creation Debug Information"
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
      className="debug-modal"
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Overview" key="overview">
          <OverviewTab />
        </TabPane>
        <TabPane tab={`Steps (${debugData.steps.length})`} key="steps">
          <StepsTab />
        </TabPane>
        <TabPane tab={`Errors (${debugData.errors.length})`} key="errors">
          <ErrorsTab />
        </TabPane>
        <TabPane tab="Final Result" key="result">
          <FinalResultTab />
        </TabPane>
        <TabPane tab="Prompt" key="prompt">
          <PromptTab />
        </TabPane>
        <TabPane tab="Raw Data" key="raw">
          <RawDataTab />
        </TabPane>
      </Tabs>
    </Modal>
  );
}

export default VacancyCreationDebugModal;
