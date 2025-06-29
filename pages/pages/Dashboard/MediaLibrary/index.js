import { Button, Popconfirm } from "antd";
import React, { createContext, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors";

import { Cloudinary } from "@cloudinary/url-gen";
import { useState } from "react";
import PublicService from "../../../service/PublicService";
import UploadService from "../../../service/UploadService";
import UserService from "../../../service/UserService";

const CloudinaryScriptContext = createContext();

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  },
});

const MediaLibrary = ({ onSelect }) => {
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
  const user = useSelector(selectUser);
  const [resources, setResources] = useState([]);
  const [myWidget, setMyWidget] = useState(null);
  const [cloudName] = useState(cloudinaryCloudName);
  const [uploadPreset] = useState(cloudinaryPreset);

  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    showPoweredBy: false,
    showAdvancedOptions: true, //add advanced options (public_id and tag)
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    // multiple: false,  //restrict upload to a single file
    folder: `hirelab_${user?._id}`, //upload files to the specified folder
    tags: ["media_library"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    // clientAllowedFormats: ["mp4"], //restrict uploading to image files only
    maxImageFileSize: 2000000, //restrict file size to less than 2MB
    // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    // theme: "purple", //change to a purple theme
  });

  const queryImages = useCallback(async () => {
    if (!user) return;
    const result = await PublicService.cloudinarySearch({
      expression: `hirelab_${user?._id}`,
    });
    const resources = result?.data?.result?.resources;
    if (resources) setResources(resources);
  }, [user]);

  useEffect(() => {
    queryImages();
  }, [queryImages]);

  const [loaded, setLoaded] = useState(false);

  const widgetId = `hirelab_${user?._id}`;

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "false");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  useEffect(() => {
    // Initialize Cloudinary widget once script is loaded
    if (loaded) {
      if (myWidget) return;
      const newWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            const public_id = result.info.public_id;
            const secure_link = result.info?.secure_url;
            console.log("Done! Here is the link: ", secure_link);

            setTimeout(() => queryImages(), 2000);
          }
        }
      );
      setMyWidget(newWidget);
    }
  }, [loaded, widgetId, uwConfig, myWidget, queryImages]);

  if (!user) return <></>;
  if (!myWidget) return <></>;
  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <div className="clodudinary-app">
        <div className="text-3xl font-semibold leading-9">Media Library</div>

        <Button
          onClick={() => {
            myWidget.open();
          }}
          className="px-2 py-1 text-sm text-indigo-500 rounded border border-indigo-500 bg-white-500"
        >
          Upload Files
        </Button>

        <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {resources.map((resource, i) => (
            <div
              key={i}
              className={`flex flex-col items-center relative ${
                onSelect ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (onSelect) onSelect(resource);
              }}
            >
              <img
                width={150}
                src={resource.secure_url}
                className="rounded-lg"
              />

              {!onSelect && (
                <Popconfirm
                  title="Are you sure?"
                  onConfirm={async () => {
                    await UserService.deleteFile(resource.public_id);
                    await queryImages();
                  }}
                >
                  <button className="absolute top-1 right-1 p-1 text-white bg-red-500 rounded-full transition duration-300 hover:bg-red-600">
                    Delete
                  </button>
                </Popconfirm>
              )}
            </div>
          ))}
        </div>
      </div>
    </CloudinaryScriptContext.Provider>
  );
};

export default MediaLibrary;
