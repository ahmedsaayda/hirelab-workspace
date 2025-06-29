import { Segmented, Tabs, Typography, Tag } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
const { Title, Paragraph } = Typography;

const bgColors = ['volcano', 'purple', 'geekblue'];


function SkillsTabs({data, lastCall, activeItem, setActiveItem}) {
  const topSkills = data
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);

return (
  <div className="relative w-full self-center">
    <Segmented
      value={activeItem}
      onChange={(value) => setActiveItem(value)}
      options={['Skills', 'Emotional', 'Cultural']}
      block
      style={{ marginBottom: 16 }}
    />
    
    {activeItem === "Skills" && (
      <div>
        <div className="flex justify-between" style={{ marginBottom: 16 }}>
          {topSkills.map((item, index) => (
            <Tag key={item.subject} color={bgColors[index]} className="w-full text-center" style={{ marginBottom: 8, fontSize: 14, borderRadius: "16px" }}>
              {item.subject}
            </Tag>
          ))}
        </div>
        <Paragraph>{lastCall?.aiValidation?.explanation}</Paragraph>
      </div>
    )}
    
    {activeItem === "Emotional" && (
      <div>
        <div className="flex justify-between" style={{ marginBottom: 16 }}>
        {topSkills.map((item, index) => (
            <Tag key={item.subject} color={bgColors[index]} className="w-full text-center" style={{ marginBottom: 8, fontSize: 14, borderRadius: "16px" }}>
              {item.subject}
            </Tag>
          ))}
        </div>
        <Paragraph>{lastCall?.aiValidationEmotional?.explanation}</Paragraph>
      </div>
    )}
    
    {activeItem === "Cultural" && (
      <div>
        <div className="flex justify-between" style={{ marginBottom: 16 }}>
        {topSkills.map((item, index) => (
            <Tag key={item.subject} color={bgColors[index]} className="w-full text-center" style={{ marginBottom: 8, fontSize: 14,  borderRadius: "16px" }}>
              {item.subject}
            </Tag>
          ))}
        </div>
        <Paragraph>{lastCall?.aiValidationCultural?.explanation}</Paragraph>
      </div>
    )}
  </div>
);
};

export default SkillsTabs;
