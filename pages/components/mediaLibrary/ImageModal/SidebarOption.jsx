// hirelab-frontend\src\components\mediaLibrary\ImageModal\SidebarOption.jsx
import React from 'react';


const SidebarOption = ({ 
  icon, 
  label, 
  active = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-left transition-all rounded-lg
        ${active 
          ? 'bg-gray-100 font-medium' 
          : 'hover:bg-gray-50 text-gray-700'
        }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-6 h-6">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
    </button>
  );
};

export default SidebarOption;