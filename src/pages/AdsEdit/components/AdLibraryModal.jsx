import React, { useState, useMemo } from "react";
import { Modal, Tabs, Select } from "antd";

const { Option } = Select;

// Mock template library - In real implementation, this would come from backend
const TEMPLATE_LIBRARY = [
  {
    id: "template-1-1",
    name: "Modern Professional",
    preview: "/images/ad-templates/template-1-1.jpg",
    platform: "facebook",
    format: "story",
    adType: "job",
    tags: ["professional", "clean", "corporate"],
  },
  {
    id: "template-1-2",
    name: "Bold & Dynamic",
    preview: "/images/ad-templates/template-1-2.jpg",
    platform: "facebook",
    format: "story",
    adType: "job",
    tags: ["bold", "colorful", "energetic"],
  },
  {
    id: "template-1-3",
    name: "Minimalist Elegant",
    preview: "/images/ad-templates/template-1-3.jpg",
    platform: "facebook",
    format: "story",
    adType: "job",
    tags: ["minimal", "elegant", "simple"],
  },
  {
    id: "template-2-1",
    name: "Team Culture",
    preview: "/images/ad-templates/template-2-1.jpg",
    platform: "facebook",
    format: "story",
    adType: "employer-brand",
    tags: ["culture", "team", "friendly"],
  },
  {
    id: "template-2-2",
    name: "Office Vibes",
    preview: "/images/ad-templates/template-2-2.jpg",
    platform: "facebook",
    format: "story",
    adType: "employer-brand",
    tags: ["workspace", "modern", "collaborative"],
  },
  {
    id: "template-3-1",
    name: "Employee Spotlight",
    preview: "/images/ad-templates/template-3-1.jpg",
    platform: "facebook",
    format: "story",
    adType: "testimonial",
    tags: ["testimonial", "authentic", "personal"],
  },
  {
    id: "template-3-2",
    name: "Success Story",
    preview: "/images/ad-templates/template-3-2.jpg",
    platform: "facebook",
    format: "story",
    adType: "testimonial",
    tags: ["success", "achievement", "inspiring"],
  },
  // Add more templates for different formats and platforms
  {
    id: "template-square-1",
    name: "Classic Square",
    preview: "/images/ad-templates/template-square-1.jpg",
    platform: "facebook",
    format: "square",
    adType: "job",
    tags: ["classic", "professional"],
  },
  {
    id: "template-landscape-1",
    name: "Wide View",
    preview: "/images/ad-templates/template-landscape-1.jpg",
    platform: "facebook",
    format: "landscape",
    adType: "job",
    tags: ["wide", "panoramic"],
  },
];

export default function AdLibraryModal({ open, onClose, onSelect, platform, format, adType }) {
  const [selectedPlatform, setSelectedPlatform] = useState(platform);
  const [selectedFormat, setSelectedFormat] = useState(format);
  const [selectedAdType, setSelectedAdType] = useState(adType);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Filter templates based on selections
  const filteredTemplates = useMemo(() => {
    return TEMPLATE_LIBRARY.filter((template) => {
      const matchesPlatform = !selectedPlatform || template.platform === selectedPlatform;
      const matchesFormat = !selectedFormat || template.format === selectedFormat;
      const matchesAdType = !selectedAdType || template.adType === selectedAdType;
      const matchesSearch = !searchTerm || 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesPlatform && matchesFormat && matchesAdType && matchesSearch;
    });
  }, [selectedPlatform, selectedFormat, selectedAdType, searchTerm]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
  };

  const handleApply = () => {
    const template = TEMPLATE_LIBRARY.find(t => t.id === selectedTemplate);
    if (template) {
      onSelect(template);
    }
  };

  return (
    <Modal
      title="Ad Template Library"
      open={open}
      onCancel={onClose}
      width={900}
      footer={
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredTemplates.length} templates available
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply Template
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <Select
            value={selectedPlatform}
            onChange={setSelectedPlatform}
            className="w-40"
            placeholder="All Platforms"
            allowClear
          >
            <Option value="facebook">Facebook</Option>
            <Option value="instagram">Instagram</Option>
            <Option value="linkedin">LinkedIn</Option>
            <Option value="tiktok">TikTok</Option>
          </Select>

          <Select
            value={selectedFormat}
            onChange={setSelectedFormat}
            className="w-40"
            placeholder="All Formats"
            allowClear
          >
            <Option value="square">Square (1:1)</Option>
            <Option value="story">Story (9:16)</Option>
            <Option value="landscape">Landscape (16:9)</Option>
          </Select>

          <Select
            value={selectedAdType}
            onChange={setSelectedAdType}
            className="w-40"
            placeholder="All Ad Types"
            allowClear
          >
            <Option value="job">Job Ad</Option>
            <Option value="employer-brand">Employer Brand</Option>
            <Option value="testimonial">Testimonial</Option>
            <Option value="company">About Company</Option>
            <Option value="retargeting">Retargeting</Option>
          </Select>
        </div>

        {/* Templates Grid */}
        <div className="max-h-[500px] overflow-y-auto">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">No templates found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`relative group rounded-lg overflow-hidden transition-all ${
                    selectedTemplate === template.id
                      ? "ring-4 ring-blue-500 scale-105"
                      : "hover:scale-105 hover:shadow-lg"
                  }`}
                >
                  {/* Template Preview */}
                  <div className="aspect-[9/16] bg-gray-100 relative">
                    {template.preview ? (
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-sm font-semibold">
                        {selectedTemplate === template.id ? "✓ Selected" : "Click to Select"}
                      </div>
                    </div>

                    {/* Selected Badge */}
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-2 bg-white border-t">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {template.name}
                    </div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {template.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <strong>Tip:</strong> Templates will be automatically customized with your brand colors, fonts, and content from your landing page.
          </div>
        </div>
      </div>
    </Modal>
  );
}
