
import React from "react";
import { ColorPicker } from "antd";

// Helper function to calculate luminance
const getLuminance = (color) => {
  const rgb = parseInt(color.replace("#", ""), 16); // Convert hex to RGB
  const r = ((rgb >> 16) & 0xff) / 255;
  const g = ((rgb >> 8) & 0xff) / 255;
  const b = (rgb & 0xff) / 255;

  // Applying the luminance formula
  const a = [r, g, b].map((x) =>
    x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  );
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722; // Return luminance
};



const ColorPickerButton = ({
  label,
  color,
  setColor,
}) => {
  // Check luminance to determine text color
  const luminance = getLuminance(color);
  const textColor = luminance > 0.5 ? "#000000" : "#ffffff"; // Dark text for light colors, light text for dark colors

  return (
    <div className="">
      <ColorPicker 
        value={color} 
        onChange={(color) => setColor(color?.toHexString())}
        disabledAlpha={true}
        format="hex"
      >
        <div className="border rounded-full">
          <div
            className="border-2 !border-white  !shadow-lg"
            style={{
              width: "35px",
              height: "35px",
              backgroundColor: color,
              borderRadius: "100%",
              cursor: "pointer",
              // display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
              // fontSize: "14px",
              // color: textColor, // Dynamically set text color based on luminance
              // textAlign: "center",
            }}
          >
            {/* {color} */}
          </div>
        </div>
      </ColorPicker>
    </div>
  );
};

export default ColorPickerButton;

