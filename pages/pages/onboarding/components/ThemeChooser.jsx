import React from "react";
import { useSelector } from "react-redux";

export default function ThemeChooser() {
  const { baseColors, variants } = useSelector((state) => state.theme);

  const renderColorRow = (label, baseColor, variant) => (
    <div className="flex flex-col">

      <span className=" text-xs text-gray-400">{label}</span>
      <div className="flex items-center  pb-1">

                
        <div className="flex">
          {variant.light.slice().reverse().map((color, index) => (
            <div
              key={index}
              className="p-1 text-sm h-10 w-10 "
              style={{ backgroundColor: color }}
            >
              {/* {color} */}
            </div>
          ))}
        </div>
        <br />
        
        <div
          className="text-sm p-1 h-10 w-[100px] flex justify-center items-center border   text-white"
          style={{ backgroundColor: baseColor }}
        >
          {baseColor}

        </div>
        <br />

        <div className="flex ">
          {variant.dark.map((color, index) => (
            <div
              key={index}
              className="p-1 text-sm h-10 w-10 text-white "
              style={{ backgroundColor: color }}
            >
              {/* {color} */}
            </div>
          ))}
        </div>


      </div>


    </div>
  );

  return (
    <div className="p-2 rounded-lg">
      {/* <h2 className="text-lg font-bold mb-4">Theme Colors</h2> */}

      {renderColorRow("Primary", baseColors.primary, variants.primary)}
      {renderColorRow("Secondary", baseColors.secondary, variants.secondary)}
      {renderColorRow("Tertiary", baseColors.tertiary, variants.tertiary)}
    </div>
  );
}
