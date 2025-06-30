import { useState } from "react";
import {
  Input,
  Button,
  Modal,
  Upload,
  Tag,
  Menu,
  Checkbox,
  Select,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";

const sampleData = [
  {
    id: "1",
    title: "Finance Dept. Brand Video London",
    description:
      "Office tour video in London Office finance department showcasing a day in the life of a financial controller",
    tags: ["New York", "Finance", "Controller"],
    thumbnail: "/placeholder.svg?height=200&width=300",
    type: "video",
  },
  // Add more sample items as needed
];

const smartTags = ["New York", "Finance", "Controller", "London", "Office"];

export default function MediaLibrary() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMultipleModalOpen, setIsAddMultipleModalOpen] = useState(false);
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
    useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleItemSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleCreateTemplate = () => {
    setIsCreateTemplateModalOpen(true);
  };

  const menuItems = [
    { key: "all", label: "All" },
    { key: "images", label: "Images" },
    { key: "videos", label: "Videos" },
    { key: "templates", label: "Section templates" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Media Library</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search"
                className="w-64"
              />
              <Button.Group>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add single
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsAddMultipleModalOpen(true)}
                >
                  Add multiple
                </Button>
              </Button.Group>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <Menu
            mode="horizontal"
            items={menuItems}
            defaultSelectedKeys={["all"]}
          />
          <div className="flex items-center space-x-4">
            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filters
            </Button>
            {selectedItems.length > 0 && (
              <Button type="primary" icon={<DownloadOutlined />}>
                Use selected
              </Button>
            )}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleData.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden transition-shadow bg-white rounded-lg shadow hover:shadow-md"
            >
              <div className="relative aspect-video">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-75 rounded-full">
                      <div className="w-4 h-4 border-l-2 border-gray-800" />
                    </div>
                  </div>
                )}
                <Checkbox
                  className="absolute top-2 left-2"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemSelect(item.id)}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEditItem(item)}
                  />
                </div>
                <p className="mb-2 text-sm text-gray-500">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Tag key={tag} className="m-0">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modals */}
      <Modal
        title="Add Media"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Upload.Dragger multiple={false} listType="picture">
          <p className="ant-upload-drag-icon">
            <PlusOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
        <div className="mt-4">
          <Input placeholder="File Name" className="mb-2" />
          <Input.TextArea placeholder="Meta Description" className="mb-2" />
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Add Smart Tags"
            options={smartTags.map((tag) => ({ value: tag, label: tag }))}
          />
        </div>
      </Modal>

      <Modal
        title="Add Multiple Media"
        open={isAddMultipleModalOpen}
        onCancel={() => setIsAddMultipleModalOpen(false)}
        footer={null}
      >
        <Upload.Dragger multiple listType="picture">
          <p className="ant-upload-drag-icon">
            <PlusOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag files to this area to upload
          </p>
        </Upload.Dragger>
      </Modal>

      <Modal
        title="Edit Media"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => {
          setIsEditModalOpen(false);
          message.success("Media updated successfully");
        }}
      >
        {editItem && (
          <div>
            <Input defaultValue={editItem.title} className="mb-2" />
            <Input.TextArea
              defaultValue={editItem.description}
              className="mb-2"
            />
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Smart Tags"
              defaultValue={editItem.tags}
              options={smartTags.map((tag) => ({ value: tag, label: tag }))}
            />
            <Upload
              listType="picture-card"
              className="mt-4"
              fileList={[
                {
                  uid: "-1",
                  name: "image.png",
                  status: "done",
                  url: editItem.thumbnail,
                },
              ]}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </div>
        )}
      </Modal>

      <Modal
        title="Filters"
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsFilterModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => setIsFilterModalOpen(false)}
          >
            Apply
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Location
            </label>
            <Select style={{ width: "100%" }} placeholder="Select location">
              <Select.Option value="new-york">New York</Select.Option>
              <Select.Option value="london">London</Select.Option>
              <Select.Option value="tokyo">Tokyo</Select.Option>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Department
            </label>
            <Select style={{ width: "100%" }} placeholder="Select department">
              <Select.Option value="finance">Finance</Select.Option>
              <Select.Option value="marketing">Marketing</Select.Option>
              <Select.Option value="hr">Human Resources</Select.Option>
            </Select>
          </div>
        </div>
      </Modal>

      <Modal
        title="Create New Section Template"
        open={isCreateTemplateModalOpen}
        onCancel={() => setIsCreateTemplateModalOpen(false)}
        onOk={() => {
          setIsCreateTemplateModalOpen(false);
          message.success("New section template created successfully");
        }}
      >
        <div className="space-y-4">
          <Input placeholder="Template Name" />
          <Select style={{ width: "100%" }} placeholder="Select Template Type">
            <Select.Option value="testimonial">Testimonial</Select.Option>
            <Select.Option value="hero">Hero Section</Select.Option>
            <Select.Option value="feature">Feature Section</Select.Option>
          </Select>
          <Input.TextArea placeholder="Template Content" rows={4} />
          <Upload listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </div>
      </Modal>
    </div>
  );
}
