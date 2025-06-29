import React from "react";
import { Button, Img, Text } from "..";
import { Sparkles } from 'lucide-react';
export default function CreateANewVacancyInput({
  text = "Start from scratch",
  subtext,
  imageIcon,
  locked,
  ...props
}) {

  console.log('locked:true,', locked);
  return (
    <div
      {...props}
      className={ `group ${props.className} hover:bg-[#Eff8ff] relative flex flex-col items-center w-full gap-[18px] px-3.5 py-[26px] sm:py-5 border-light_blue-A700 border  bg-white-A700 shadow-sm rounded-lg ${locked ? 'filter grayscale pointer-events-none cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {locked && (
        <div className="flex items-center gap-1 justify-start m-[2px] absolute top-0 right-0 rounded-lg bg-gray-600 text-white px-2 py-[4px] text-[12px] rounded-tl-none rounded-br-none">
          <Sparkles size={15} />
          <span>Premium Feature</span>
        </div>          
      )}

      <Button
        size="4xl"
        shape="circle"
        className="w-[40px] !rounded-[20px] bg-[#EFF8FF] group-hover:bg-blue-500 transition-colors duration-200 ease-in-out"
      >
        <Img 
          src={imageIcon ?? "/images/img_plus.svg"} 
          className="transition-all duration-200 ease-in-out group-hover:brightness-0 group-hover:invert" 
        />
      </Button>

      <div className="flex justify-center">
        <Text
          size="3xl"
          as="p"
          className="!font-xl !text-light_blue-A700 text-center group-hover:text-light_blue-700 transition-colors duration-200 ease-in-out"
        >
          {text}
          {subtext && (
            <>
              <br />
              <span className="text-[#87CEEB] text-sm">{subtext}</span>
            </>
          )}
        </Text>
      </div>
    </div>
  );
}
