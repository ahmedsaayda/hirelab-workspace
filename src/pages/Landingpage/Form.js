import { Button, Form, Input, Modal, Radio, message, Select } from "antd";
import React, { useState } from "react";
import PublicService from "../../services/PublicService";
import { formItems } from "../Dashboard/Vacancies/modals/ApplicationformAddQuestions";
import { Img } from "./components/Img";
import MultipleChoice, { MultiSelectChoice, DropdownChoice, CustomDropdown, YesNoQuestion } from "../FormEdit/Common_components/MultipleChoice";
import ImageUploader from "../LandingpageEdit/ImageUploader";
import { PhoneInput } from 'react-international-phone';

const { TextArea } = Input;

const Content = ({ landingPageData, onSubmit, setShowFormEditor }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dateFormat, setDateFormat] = useState("MMDDYYYY");
  const [dateSeparator, setDateSeparator] = useState("/");

  const mapFormDataToSubmission = (values) => {
    const formData = {};

    landingPageData?.form?.fields.forEach((field) => {
      if (field.type === "contact") {
        formData[`firstname`] = values[field.id]?.firstName || "";
        formData[`lastname`] = values[field.id]?.lastName || "";
      } else if (field.type === "email") {
        formData[`email`] = values[field.id] || "";
      } else if (field.type === "phone") {
        formData[`phone`] = values[field.id] || "";
      } else if (field.type === "address") {
        //line1 line2 city state zip country
        formData[`line1`] = values[field.id]?.line1 || "";
        formData[`line2`] = values[field.id]?.line2 || "";
        formData[`city`] = values[field.id]?.city || "";
        formData[`state`] = values[field.id]?.state || "";
        formData[`zip`] = values[field.id]?.zip || "";
        formData[`country`] = values[field.id]?.country || "";
      } else {
        formData[field.id] = values[field.id];
      }
    });

    return formData;
  };

  const handleSubmit = async (values) => {
    if (loading) return;
    setLoading(true);

    try {
      const formData = mapFormDataToSubmission(values);

      const submission = {
        LandingPageDataId: landingPageData._id,
        formData,
        funnelUUID: localStorage?.getItem(`funnelUUID_${landingPageData._id}`),
      };

      const response = await onSubmit(submission);
      if (response?.data) {
        form.resetFields();
        localStorage.setItem(`vacancyApplied_${landingPageData._id}`, "true");
        message.success(
          landingPageData?.formSuccessMessage ??
            "Application submitted successfully!"
        );
        setShowFormEditor(false);
      } else {
        throw new Error(
          landingPageData?.formErrorMessage ?? "Failed to submit application"
        );
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      message.error(
        landingPageData?.formErrorMessage ??
          "Failed to submit application. Please try again."
      );
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "contact":
        return (
          <Input.Group className="grid grid-cols-2 gap-4">
            {field.firstName?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  First Name
                  {field.firstName?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Form.Item
                  name={[field.id, "firstName"]}
                  noStyle
                  rules={[
                    {
                      required: field.firstName?.required,
                      message: "First name is required",
                    },
                  ]}
                >
                  <Input
                    placeholder={field.firstName?.placeholder || "First name"}
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            )}
            {field.lastName?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  Last Name
                  {field.lastName?.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <Form.Item
                  name={[field.id, "lastName"]}
                  noStyle
                  rules={[
                    {
                      required: field.lastName?.required,
                      message: "Last name is required",
                    },
                  ]}
                >
                  <Input
                    placeholder={field.lastName?.placeholder || "Last name"}
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            )}
          </Input.Group>
        );
      case "email":
        return (
          <Input
            type="email"
            placeholder={field.placeholder || "Email address"}
            className="rounded-lg"
          />
        );
      case "phone":
        // Use react-international-phone for phone input with country flags
        return (
          <Form.Item
            name={field.id}
            // rules={[{ required: field.required, message: "Phone number is required" }]}
            noStyle
          >
            <PhoneInput
              defaultCountry="us"
              inputClassName="rounded-lg w-full"
              placeholder={field.placeholder || "Phone number"}
              value={form.getFieldValue(field.id) || ''}
              onChange={value => form.setFieldsValue({ [field.id]: value })}
              className="p-1"
            />
          </Form.Item>
        );
      case "text":
        return (
          <Input
            placeholder={field.placeholder || "Your answer"}
            className="rounded-lg"
          />
        );
      case "motivation":
        return (
          <TextArea
            placeholder={field.placeholder || "Write your motivation letter"}
            className="h-32 rounded-lg"
          />
        );
      case "multichoice":
        return (
          <MultipleChoice
            field={field}
            value={form.getFieldValue(field.id)}
            onChange={e => form.setFieldsValue({ [field.id]: e.target.value })}
          />
        );
      case "dropdown":
        return (
          <CustomDropdown
            field={field}
            value={form.getFieldValue(field.id)}
            onChange={idx => form.setFieldsValue({ [field.id]: idx })}
          />
        );
      case "multiselect":
        return (
          <MultiSelectChoice
            field={field}
            value={form.getFieldValue(field.id) || []}
            onChange={value => form.setFieldsValue({ [field.id]: value })}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder || "Enter a number"}
            min={field.min}
            max={field.max}
            className="rounded-lg"
          />
        );
      case "address":
        return (
          <div className="space-y-2">
            {field.line1?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  {field.line1?.label || "Address Line 1"}
                  {field.line1?.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>
                <Form.Item
                  name={[field.id, "line1"]}
                  noStyle
                  rules={[
                    {
                      required: !!field.line1?.required,
                      message: `${field.line1?.label || "Address Line 1"} is required`,
                    },
                  ]}
                >
                  <Input
                    placeholder={field.line1?.placeholder || "Address Line 1"}
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            )}

            {field.line2?.visible !== false && (
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  {field.line2?.label || "Address Line 2"}
                  {field.line2?.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>
                <Form.Item
                  name={[field.id, "line2"]}
                  noStyle
                  rules={[
                    {
                      required: !!field.line2?.required,
                      message: `${field.line2?.label || "Address Line 2"} is required`,
                    },
                  ]}
                >
                  <Input
                    placeholder={field.line2?.placeholder || "Address Line 2"}
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {field.city?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    {field.city?.label || "City"}
                    {field.city?.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>
                  <Form.Item
                    name={[field.id, "city"]}
                    noStyle
                    rules={[
                      {
                        required: !!field.city?.required,
                        message: `${field.city?.label || "City"} is required`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={field.city?.placeholder || "City"}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              )}
              {field.state?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    {field.state?.label || "State/Province"}
                    {field.state?.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>
                  <Form.Item
                    name={[field.id, "state"]}
                    noStyle
                    rules={[
                      {
                        required: !!field.state?.required,
                        message: `${field.state?.label || "State/Province"} is required`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={field.state?.placeholder || "State/Province"}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {field.zip?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    {field.zip?.label || "ZIP/Postal Code"}
                    {field.zip?.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>
                  <Form.Item
                    name={[field.id, "zip"]}
                    noStyle
                    rules={[
                      {
                        required: !!field.zip?.required,
                        message: `${field.zip?.label || "ZIP/Postal Code"} is required`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={field.zip?.placeholder || "ZIP/Postal Code"}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              )}
              {field.country?.visible !== false && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    {field.country?.label || "Country"}
                    {field.country?.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>
                  <Form.Item
                    name={[field.id, "country"]}
                    noStyle
                    rules={[
                      {
                        required: !!field.country?.required,
                        message: `${field.country?.label || "Country"} is required`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={field.country?.placeholder || "Country"}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              )}
            </div>
          </div>
        );
      case "file":
        return (
        
          <ImageUploader
            onImageUpload={url => form.setFieldsValue({ [field.id]: url })}
            accept="*"
            defaultImage={form.getFieldValue(field.id)}
            multiple={false}
            allowedTabs={["image","video"]}
          />
        );
      case "website":
        return (
          <Form.Item label={field.id} className="flex-1">
            <Input
              value={form.getFieldValue(field.id) || ""}
              onChange={e => form.setFieldsValue({ [field.id]: e.target.value })}
              className="rounded-lg"
              addonBefore={<span style={{ fontSize: 14, color: '#000000' }}>https://</span>}
            />
          </Form.Item>
        );
      case "boolean":
        return (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => form.setFieldsValue({ [field.id]: 'yes' })}
                className={`
                  relative flex items-center justify-center px-6 py-3 rounded-lg border transition-all duration-200 text-sm
                  ${form.getFieldValue(field.id) === 'yes' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-25 hover:text-green-600'}
                `}
              >
                <span>{field.yesLabel || 'Yes'}</span>
              </button>
              <button
                type="button"
                onClick={() => form.setFieldsValue({ [field.id]: 'no' })}
                className={`
                  relative flex items-center justify-center px-6 py-3 rounded-lg border transition-all duration-200 text-sm
                  ${form.getFieldValue(field.id) === 'no' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-25 hover:text-red-600'}
                `}
              >
                <span>{field.noLabel || 'No'}</span>
              </button>
            </div>
          </div>
        );
      case "date":
        // Use format and separator from field config
        const dateFormat = field.dateFormat || "MMDDYYYY";
        const dateSeparator = field.dateSeparator || "/";
        const dateValue = form.getFieldValue(field.id) || {};
        const { month = '', day = '', year = '' } = dateValue;
        let preview = '';
        if (month || day || year) {
          if (dateFormat === 'MMDDYYYY') {
            preview = [month, day, year].filter(Boolean).join(dateSeparator);
          } else if (dateFormat === 'DDMMYYYY') {
            preview = [day, month, year].filter(Boolean).join(dateSeparator);
          } else if (dateFormat === 'YYYYMMDD') {
            preview = [year, month, day].filter(Boolean).join(dateSeparator);
          }
        }
        // Helper to render input by type
        const renderDateInput = (type) => {
          if (type === 'month') {
            return (
              <div key="month">
                <label className="block mb-1 text-sm">Month</label>
                <Form.Item
                  name={[field.id, "month"]}
                  noStyle
                  rules={[{ required: field.required, message: "Month is required" }]}
                >
                  <Input
                    placeholder="MM"
                    maxLength={2}
                    className="w-[70px] h-[42px] text-xl bg-transparent border-b border-gray-400 rounded-lg text-gray-400"
                  />
                </Form.Item>
              </div>
            );
          } else if (type === 'day') {
            return (
              <div key="day">
                <label className="block mb-1 text-sm">Day</label>
                <Form.Item
                  name={[field.id, "day"]}
                  noStyle
                  rules={[{ required: field.required, message: "Day is required" }]}
                >
                  <Input
                    placeholder="DD"
                    maxLength={2}
                    className="w-16 text-xl h-[42px] bg-transparent border-b border-gray-400 rounded-lg text-gray-400"
                  />
                </Form.Item>
              </div>
            );
          } else if (type === 'year') {
            return (
              <div key="year">
                <label className="block mb-1 text-sm">Year</label>
                <Form.Item
                  name={[field.id, "year"]}
                  noStyle
                  rules={[{ required: field.required, message: "Year is required" }]}
                >
                  <Input
                    placeholder="YYYY"
                    maxLength={4}
                    className="w-[80px] text-xl h-[42px] bg-transparent border-b border-gray-400 rounded-lg  text-gray-400"
                  />
                </Form.Item>
              </div>
            );
          }
          return null;
        };
        // Determine order based on dateFormat
        let order = [];
        if (dateFormat === 'MMDDYYYY') order = ['month', 'day', 'year'];
        else if (dateFormat === 'DDMMYYYY') order = ['day', 'month', 'year'];
        else if (dateFormat === 'YYYYMMDD') order = ['year', 'month', 'day'];
        return (
          <div>
            <div className="flex space-x-4 items-end">
              {order.map((type, idx) => (
                <React.Fragment key={type}>
                  {renderDateInput(type)}
                  {idx < order.length - 1 && (
                    <span className="text-2xl text-gray-400 pb-[8px]">{dateSeparator}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <Input
            placeholder={field.placeholder || "Your answer"}
            className="rounded-lg"
          />
        );
    }
  };

  return (
    <>
      <p className="mb-6 text-gray-600 smx:w-[100vw] ">{landingPageData?.form?.description}</p>

      <Form
        form={form}
        layout="vertical"
        className="space-y-6 scrollbar-hide overflow-x-hidden"
        onFinish={handleSubmit}
      >
        {landingPageData?.form?.fields
          .filter(field => {
            if (field.type === "contact") {
              return field.firstName?.visible || field.lastName?.visible;
            }
            return field.visible !== false;
          })
          .map((field) => (
            <Form.Item
              key={field.id}
              name={field.id}
              label={
                field.type === "contact" ? null : (
                  <span className="font-medium">
                    {field.label ||
                      formItems.find((item) => item.type === field.type)?.text}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                  </span>
                )
              }
              required={field.required}
              rules={
                field.type !== "contact"
                  ? [
                      {
                        required: field.required,
                        message: `${field.label || "This field"} is required`,
                      },
                    ]
                  : []
              }
              className="p-2 transition-all rounded-lg hover:bg-gray-50"
            >
              {renderField(field)}
            </Form.Item>
          ))}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full rounded-lg"
            loading={loading}
          >
            {landingPageData?.form?.submitText || "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const FormE = ({
  landingPageData,
  showFormEditor,
  setShowFormEditor,
  noModal,
  maxH,
}) => {
  const handleSubmit = async (submission) => {
    if (noModal) return;

    try {
      return await PublicService.createVacancySubmission(submission);
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error;
    }
  };

  const renderContent = () => (
    <div className="pt-2 overflow-y-scroll overflow-x-hidden scrollbar-hide" style={{ maxHeight: maxH }}>
      {landingPageData?.heroImage && (
        <Img
          src={landingPageData.heroImage}
          alt="Hero"
          className="mx-auto mb-4 max-h-[400px] w-[100%] "
          style={{ objectFit: "cover",objectPosition: "0% 20%" }}
        />
      )}
      <h1 className="mb-4 text-2xl font-bold">
        {landingPageData?.form?.title || "Application Form"}
      </h1>
      <Content
        setShowFormEditor={setShowFormEditor}
        landingPageData={landingPageData}
        onSubmit={handleSubmit}
      />
    </div>
  );

  if (noModal) {
    return <div className="p-4">{renderContent()}</div>;
  }

  return (
    <Modal
      open={showFormEditor}
      onCancel={() => setShowFormEditor(false)}
      footer={null}
      width={800}
    >
      {renderContent()}
    </Modal>
  );
};

export default FormE;
