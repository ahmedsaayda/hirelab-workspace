import React, { useState, useRef } from "react";
import { Input, Button, Switch, message } from "antd";
import ImageUploader from "../../../../../pages/LandingpageEdit/ImageUploader";
import { PlayCircleOutlined, SoundOutlined, MutedOutlined, ExpandOutlined } from "@ant-design/icons";

const { TextArea } = Input;


const VideoSectionForm = ({ 
  initialData, 
  onSave, 
  isSaving 
}) => {
  const [formData, setFormData] = useState({
    videoTitle: initialData?.videoTitle || "",
    videoDescription: initialData?.videoDescription || "",
    myVideo: initialData?.myVideo || "",
    videoAutoPlay: initialData?.videoAutoPlay || false,
    type: 'videoSection'
  });

  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleProgressBarClick = (e) => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Video section saved successfully");
    } catch (error) {
      message.error("Failed to save video section");
      console.error("Error saving video section:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Section Title */}
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.videoTitle.length}/40</p>
      </div>
      <Input
        value={formData.videoTitle}
        onChange={(e) => handleChange('videoTitle', e.target.value)}
        maxLength={40}
        className="w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 rounded-md"
      />

      {/* Section Description */}
      <div className="flex justify-between items-center">
        <p>Description</p>
        <p>{formData.videoDescription.length}/120</p>
      </div>
      <TextArea
        value={formData.videoDescription}
        onChange={(e) => handleChange('videoDescription', e.target.value)}
        rows={3}
        maxLength={120}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Video Upload */}
      <div className="mt-4">
        <div className="flex gap-2 items-center mb-4">
          <span>
            Auto Play
          </span>
          <Switch
            checked={formData.videoAutoPlay}
            onChange={(checked) => {
              handleChange('videoAutoPlay', checked);
              message.success(
                checked ? "Autoplay activated" : "Autoplay deactivated"
              );
            }}
          />
        </div>

        <ImageUploader
          maxFiles={1}
          multiple={false}
          defaultImage={formData.myVideo}
          accept="video/*"
          onImageUpload={(url) => {
            handleChange('myVideo', url);
            setIsPlaying(false);
          }}
        />

        {/* Video Preview */}
        {formData.myVideo && (
          <div className="mt-4 relative">
            <video
              ref={videoRef}
              src={formData.myVideo}
              className="w-full h-auto max-h-[400px] rounded-lg border border-solid border-blue_gray-100"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              autoPlay={formData.videoAutoPlay}
              muted={isMuted}
            />
            
            {!isPlaying && (
              <div className="absolute inset-0 flex justify-center items-center">
                <button
                  onClick={togglePlay}
                  className="p-4 bg-white bg-opacity-50 rounded-full transition-opacity hover:bg-opacity-75"
                >
                  <PlayCircleOutlined className="text-4xl text-[#0E87FE]" />
                </button>
              </div>
            )}

            <div className="absolute bottom-2 left-0 right-0 m-auto flex flex-col items-center px-2">
              <div
                ref={progressBarRef}
                className="relative h-[5px] w-full cursor-pointer bg-gray-300 rounded-full"
                onClick={handleProgressBarClick}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-[#0E87FE] rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between w-full mt-1 text-xs text-white">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={toggleMute}
                className="p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
              >
                {isMuted ? (
                  <MutedOutlined className="text-lg" />
                ) : (
                  <SoundOutlined className="text-lg" />
                )}
              </button>
              <button
                onClick={() => videoRef.current?.requestFullscreen()}
                className="p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
              >
                <ExpandOutlined className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:bg-[#0B6ECD] transition-colors"
      >
        {initialData ? "Update Video" : "Create Video"}
      </Button>
    </div>
  );
};

export default VideoSectionForm;