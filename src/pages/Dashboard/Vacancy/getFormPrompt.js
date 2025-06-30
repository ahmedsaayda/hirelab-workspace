import React from "react";

const getFormPrompt = ({
  jobName,
  description,
  keyBenefits,
  requiredSkills,
}) => {
  return `Create a detailed and tailored formData configuration for a multistep application form designed to prequalify candidates for the role of "${jobName}". This form should act as an expert recruiter, efficiently filtering candidates based on their skills, qualifications, and compatibility with the job and company culture. The form must be engaging, concise, and focused on high conversion rates. Here are the specific job details to guide your customization:
  ____________
  - Job Name: ${jobName}
  ____________
  - Description: ${description}
  ____________
  - Key Benefits: ${keyBenefits}
  ____________
  - Required Skills: ${requiredSkills}
  ____________

  The form should be divided into the following sections:

  1. "Skills" Section:
     - Purpose: Precisely assess candidates' proficiency and practical experience in the required skills for "${jobName}". Collect in-depth information about the candidate's educational background, certifications, and any special training directly relevant to "${jobName}".
     - Fields: Dynamically generate fields based on the 'requiredSkills' list. Include a mix of rating scales, years of experience, and situational questions where candidates can provide specific examples of their skills in action. Probe deeper with questions that correlate their education and training to real-world job scenarios they might face in this role.

  2. "Compatibility" Section:
     - Purpose: Delve into how the candidate's career goals, personal values, and expectations align with the role, key benefits, and company culture.
     - Fields: Craft questions based on the 'description' and 'keyBenefits' to not only gauge compatibility but also to excite the candidate about the unique aspects of working at your company.

  For each section, ensure:
  - Fields are highly specific and reflective of a talent acquisition expert's inquiry, avoiding generic or irrelevant questions.
  - Questions encourage detailed responses, offering insights into candidates' thinking and problem-solving abilities.
  - The formData is presented in a JSON format with arrays for each step, containing objects for each field that specify the fieldName, label, type, placeholder, and any additional properties such as options for select inputs or validation rules.   


  Please provide the formData in JSON format suitable for an application, ensuring it includes arrays for each step with objects for each field that specify the fieldName, label, type, placeholder, and any additional properties like options for select inputs or validation rules. The form should be structured with steps, and each step should have a unique id, a name, and an array of form fields. Here is example of the format I require:
  [
  {
    id: "step1",
    name: "Step name x",
    form: [
      {
        fieldName: "xy",
        label: "Label for my input",
        type: "input",
        placeholder: "Lorem ipsum",
      },
  {...}
    ],
  },
  {
    id: "step2",
    name: "Step name y",
    form: [
      {
        fieldName: "xxy",
        label: "here number",
        type: "inputNumber",
        min: 0,
        step: 1,
      },
  {...}
    ],
  },
  {...}
]
Use this structure to generate each step, ensuring that all the necessary information is captured as per the description provided.

Here is the rendering logic based on "type" so that you have a better understanding of what different items there are that you can use for each step:
const renderFormItem = (item) => {
  switch (item.type) {
    case "input":
      return (
        <Input
          placeholder={item.placeholder}
          onChange={(e) => onChange(item.fieldName, e.target.value)}
          value={formData?.[item.fieldName]}
          disabled={thinking.includes(item.fieldName)}
        />
      );
    case "textarea":
      return (
        <Input.TextArea
          placeholder={item.placeholder}
          onChange={(e) => onChange(item.fieldName, e.target.value)}
          value={formData?.[item.fieldName]}
          rows={item.rows ?? 2}
          disabled={thinking.includes(item.fieldName)}
        />
      );
    case "inputNumber":
      return (
        <InputNumber
          min={item.min}
          max={item.max}
          step={item.step}
          onChange={(value) => onChange(item.fieldName, value)}
          value={formData?.[item.fieldName]}
        />
      );
    case "radio":
      return (
        <Radio.Group
          onChange={(e) => onChange(item.fieldName, e.target.value)}
          value={formData?.[item.fieldName]}
        >
          {item.options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      );
    case "rate":
      return (
        <Rate
          onChange={(value) => onChange(item.fieldName, value)}
          value={formData?.[item.fieldName]}
        />
      );
    case "select":
      return (
        <ReactSelect
          className="border-[1px] border-[#d8d8d8] font-semibold !shadow-none !outline-none rounded-[5px]  xl:w-auto !w-full "
          options={item.options}
          classNamePrefix={"profile-select"}
          value={{
            value: formData?.[item.fieldName],
            label: item.options?.find?.(
              (e) => e.value === formData?.[item.fieldName]
            )?.label,
          }}
          onChange={(e) => onChange(item.fieldName, e.value)}
          components={{ IndicatorSeparator: "" }}
        >
          {item.options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </ReactSelect>
      );
    case "slider":
      return (
        <Slider
          min={item.min}
          max={item.max}
          step={item.step}
          onChange={(value) => onChange(item.fieldName, value)}
          value={formData?.[item.fieldName]}
        />
      );
    case "switch":
      return (
        <Switch
          checked={formData?.[item.fieldName]}
          onChange={(value) => onChange(item.fieldName, value)}
        />
      );
    case "timepicker":
      return (
        <TimePicker
          onChange={(time, timeString) =>
            onChange(item.fieldName, timeString)
          }
          value={
            formData?.[item.fieldName]
              ? dayjs(formData?.[item.fieldName], "HH:mm:ss")
              : null
          }
        />
      );
    case "datepicker":
      return (
        <DatePicker
          onChange={(date, dateString) =>
            onChange(item.fieldName, dateString)
          }
          value={
            formData?.[item.fieldName]
              ? dayjs(formData?.[item.fieldName])
              : null
          }
        />
      );
    case "checkbox":
      return (
        <Checkbox
          checked={formData?.[item.fieldName]}
          onChange={(e) => {
            onChange(item.fieldName, e.target.checked);
          }}
        >
          {item.label}
        </Checkbox>
      );
  }
};

If you use type "rate", keep in mind that it is on a scale from 1 to 5. If you ask them to rate something, ask them to rate on a scale of 1 to 5.
Fields of type rate, radio, select, inputNumber, slider, switch are more prefered over fields input and textarea. If a question can be answered without typing, let's avoid text input.

Your expert configuration will significantly enhance our recruitment process, helping us identify and engage with the best candidates more efficiently and effectively.
Important! In your answer, please do not write anything other than the barebone JSON array itself.
The form should not include any inputs on fullname / name, email, phone since these informations will be added anyways SEPARATELY! So do not include name, email and phone in the form! Focus instead on the core criteria that determine a candidate's suitability for the role.

It is imperative that the output text does NOT contain any of the following nor similar words: Embarking on, Unveil, Mastering, Master, Crafting, In Conclusion, Unlock, Unleash, Tapestry, Un the realm, Explore
  `;
};

export default getFormPrompt;
