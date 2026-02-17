import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';


const DropZone = ({ 
  onFilesSelected, 
  isUploading = false,
  multiple = false,
  accept = 'image/*,video/*'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center w-full h-[180px] sm:h-[220px] p-4 sm:p-6 border-2 border-dashed 
        rounded-lg transition-all duration-200 cursor-pointer
        ${isDragging 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 max-w-sm mx-auto">
        <div className="flex items-center justify-center">
          <div className="flex gap-1 sm:gap-2">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-300 w-6 h-6 sm:w-8 sm:h-8 rounded transform rotate-12"></div>
            <div className="bg-gradient-to-br from-purple-500 to-blue-400 w-6 h-6 sm:w-8 sm:h-8 rounded-full"></div>
            <div className="bg-gradient-to-br from-pink-400 to-orange-300 w-6 h-6 sm:w-8 sm:h-8 rounded transform -rotate-12"></div>
          </div>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <p className="text-base sm:text-lg font-medium text-gray-700">Drag & Drop</p>
          <p className="text-xs sm:text-sm font-medium text-gray-500">Click Here to Upload</p>
          <p className="text-xs text-gray-400 px-2">
            {accept.includes('video') && accept.includes('image') 
              ? 'Images & Videos' 
              : accept.includes('video') 
                ? 'Videos' 
                : 'Images'} • Max {multiple ? 'multiple files' : '1 file'}
          </p>
          
          <input
            title="Upload files"
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
          />
          
          {isUploading && (
            <div className="flex items-center justify-center gap-2 px-3 py-2 mt-3 bg-gray-200 text-gray-600 rounded-lg animate-pulse">
              <Upload size={16} className="animate-bounce" />
              <span className="text-xs sm:text-sm">Uploading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropZone;
