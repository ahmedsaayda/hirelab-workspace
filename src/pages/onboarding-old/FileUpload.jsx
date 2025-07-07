import { useState } from "react";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputClick = () => {
    // This function will trigger the file input click event
    document.getElementById("file-upload").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is of the right type
      const validTypes = [
        "image/svg+xml",
        "image/png",
        "image/jpeg",
        "image/gif",
      ];
      if (validTypes.includes(file.type)) {
        setSelectedFile(URL.createObjectURL(file));
      } else {
        alert("Please select a valid file type: SVG, PNG, JPG, or GIF.");
        setSelectedFile(null); // Reset the selected file
      }
    }
  };

  return (
    <div>
      <div
        className="w-full h-32 relative cursor-pointer border-2 border-dashed border-gray-200 text-sm rounded flex items-center justify-center"
        onClick={handleFileInputClick}
      >
        <img
          className="absolute right-[12px] top-[51px] hidden md:block"
          alt="File"
          src="/images/File.png"
        />
        <div className="text-center">
          {selectedFile && (
            <div className="w-full flex justify-center">
              <img
                src={selectedFile}
                alt="Preview"
                className="h-16 w-16 rounded-full mt-4 "
              />
            </div>
          )}
          <div className="text-[#475467]">
            <span className="text-[#5207CD] font-semibold">
              Click to upload
            </span>{" "}
            or drag and drop
          </div>
          <div className="text-xs font-normal">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </div>
        </div>
      </div>
      <input
        id="file-upload"
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.gif"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
