import React from "react";
import { useState } from "react";

const ChooseAvatar = ({data}) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleCheckboxChange = (id) => {
        setSelectedOption(id);
    };

  return (
    <div className="relative overflow-hidden rounded-lg">
    <ul className="flex w-full justify-between">
    {data.map((item) => (
        <li key={item.id} className="flex">
                <div className="relative">
                    <label for={item.id}> 
                    <img 
                        alt="avatar" 
                        src={item.img} 
                        className="rounded-lg max-h-[25vh] w-auto object-contain"  
                        fill="currentColor" 
                        aria-hidden="true"  
                    />
                    </label>
                    <input type="checkbox" 
                    id={item.id} 
                    name="avatar" 
                    value=""
                    checked={selectedOption === item.id}
                    onChange={() => handleCheckboxChange(item.id)}  
                    className="absolute top-2 right-2 rounded-full bg-white border-gray-300" />
                </div>
        </li>
    ))}
</ul>

    </div>
  );
};



export default ChooseAvatar
