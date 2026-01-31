import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Heading, Img, Text } from "./components/index.jsx";
import { Play, Volume2, VolumeX, Maximize } from "lucide-react";
import { ExpandOutlined } from "@ant-design/icons";
import { getThemeData } from "../../utils/destructureTheme.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";

import { useFocusContext } from "../../contexts/FocusContext.js";
import { useHover } from "../../contexts/HoverContext.js";
import { getFonts } from "./getFonts.js";
import { scrollToElement } from "./scrollUtils.js";

const useVideoHover = () => {
  const { hoveredField, scrollToSection,setLastScrollToSection,lastScrollToSection } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const textRef = useRef();

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      videoTitle: titleRef,
      videoDescription: textRef,
    };
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
    }
  }, [hoveredField]);

  useEffect(() => {
    if (scrollToSection === "video" && sectionRef?.current&&lastScrollToSection !== "video") {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("video")
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    textRef,
  };
};
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const Template3 = ({
  landingPageData,
  videoRef,
  togglePlay,
  handleTimeUpdate,
  isPlaying,
  progressBarRef,
  handleProgressBarClick,
  currentTime,
  duration,
  isMuted,
  toggleMute,
}) => {
  const { sectionRef } = useVideoHover();
  const themeData = getThemeData(landingPageData?.theme);

  const { basePrimary, baseSecondary, baseTertiary } = themeData;
  const { variantPl1, variantPl2, variantPl3, variantPl4 } = themeData;
  const { variantPd1, variantPd2, variantPd3, variantPd4, variantPd5 } =
    themeData;
  const { variantSl1, variantSl2, variantSl3, variantSl4 } = themeData;
  const { variantSd1, variantSd2, variantSd3, variantSd4, variantSd5 } =
    themeData;
  const { variantTl1, variantTl2, variantTl3, variantTl4 } = themeData;
  const { variantTd1, variantTd2, variantTd3, variantTd4, variantTd5 } =
    themeData;
  const { textHeadingColor, textSubHeadingColor } = themeData;

  
  useEffect(() => {
    if (landingPageData.videoAutoPlay && videoRef?.current) {
      videoRef.current.play();
    }
  }, [landingPageData.videoAutoPlay, videoRef]);

  return (
    <>
      <div
        className="flex flex-col items-center justify-center gap-[46px]  py-24 mdx:py-5"
        style={{ backgroundColor: variantPl4 }}
        ref={sectionRef}
        id="video"
      >
        <div className="flex flex-col items-center self-stretch">
          <div className="container flex flex-col items-center gap-[22px] px-14 mdx:px-5">
            <Heading
              as="h2"
              className="text-[36px] font-semibold tracking-[-0.72px]  mdx:text-[34px] smx:text-[32px]"
              style={{ color: variantPd5 }}
            >
              {landingPageData?.videoTitle}
            </Heading>
            <Text
              size="text_xl_regular"
              as="p"
              className="text-[20px] font-normal "
              style={{ color: variantPd4 }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: landingPageData?.videoDescription?.replace?.(
                    /\n/g,
                    "<br></br>"
                  ),
                }}
              />
            </Text>
          </div>
        </div>
        <div className="container flex flex-col items-center px-14 mdx:px-5">
          <div className="flex w-[50%] flex-col items-center mdx:w-full">
            <div className="self-stretch">
              <div className="lenscolumn_border flex flex-col items-center gap-1 rounded-tl-lg rounded-tr-[10px] bg-[#edeef0]">
                <Img
                  src="/images3/img_lens.svg"
                  alt="Lens Image"
                  className="h-[4px] w-[4px]"
                />
                <div className="relative mb-2 h-[316px] content-center self-stretch mdx:h-auto">
                  {landingPageData.myVideo && (
                    <video
                      ref={videoRef}
                      src={landingPageData.myVideo}
                      className="mx-auto h-[316px] w-full flex-1 object-cover"
                      onClick={togglePlay}
                      onTimeUpdate={handleTimeUpdate}
                      autoPlay={landingPageData.videoAutoPlay}
                      muted={isMuted}
                    />
                  )}
                  {!isPlaying && (
                    <div className="flex absolute inset-0 justify-center items-center">
                      <button
                        onClick={togglePlay}
                        className="p-4 bg-white bg-opacity-50 rounded-full transition-opacity hover:bg-opacity-75"
                      >
                        <Img
                          src="/images3/img_text_input.svg"
                          alt="Play button"
                          className="h-[80px] w-[80px]"
                        />
                      </button>
                    </div>
                  )}
                  <div className="absolute bottom-[8.23px] left-0 right-0 m-auto flex flex-1 flex-col items-center px-2">
                    <div
                      ref={progressBarRef}
                      className="relative mt-[60px] h-[5px] w-full cursor-pointer"
                      onClick={handleProgressBarClick}
                    >
                      <div className="absolute inset-0 bg-gray-300 rounded-full"></div>
                      <div
                        className="absolute inset-y-0 left-0 bg-[#ffffff] rounded-full "
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex flex-wrap gap-5 justify-between self-stretch mt-2">
                      <Heading
                        size="text_xs_semibold"
                        as="h3"
                        className="text-[12px] font-semibold text-[#ffffff]"
                      >
                        {formatTime(currentTime)}
                      </Heading>
                      <Heading
                        size="text_xs_semibold"
                        as="h4"
                        className="text-[12px] font-semibold text-[#ffffff]"
                      >
                        {formatTime(duration)}
                      </Heading>
                    </div>
                  </div>
                  <div className="flex absolute top-0 right-0 gap-2 justify-center items-center p-2">
                    <button
                      onClick={toggleMute}
                      className="top-2 right-2 p-1 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
                    >
                      {isMuted ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      className="top-2 right-2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
                      onClick={() => {
                        const videoElement = videoRef.current;
                        if (videoElement !== null) {
                          if (videoElement.requestFullscreen) {
                            videoElement.requestFullscreen();
                          } else if (videoElement.mozRequestFullScreen) {
                            videoElement.mozRequestFullScreen();
                          } else if (videoElement.webkitRequestFullScreen) {
                            videoElement.webkitRequestFullScreen();
                          }
                        }
                      }}
                    >
                      <ExpandOutlined width={"40px"} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-[58px] rounded-bl-lg rounded-br-lg bg-[#d4d5d7]" />
            </div>
            <Img
              src="/images3/img_stand.png"
              alt="Stand Image"
              className="h-[92px] w-[24%] object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const Template2 = ({
  landingPageData,
  videoRef,
  togglePlay,
  handleTimeUpdate,
  isPlaying,
  progressBarRef,
  handleProgressBarClick,
  currentTime,
  duration,
  isMuted,
  toggleMute,
}) => {
  const { sectionRef } = useVideoHover();
  const themeData = getThemeData(landingPageData?.theme);

  const { basePrimary, baseSecondary, baseTertiary } = themeData;
  const { variantPl1, variantPl2, variantPl3, variantPl4 } = themeData;
  const { variantPd1, variantPd2, variantPd3, variantPd4, variantPd5 } =
    themeData;
  const { variantSl1, variantSl2, variantSl3, variantSl4 } = themeData;
  const { variantSd1, variantSd2, variantSd3, variantSd4, variantSd5 } =
    themeData;
  const { variantTl1, variantTl2, variantTl3, variantTl4 } = themeData;
  const { variantTd1, variantTd2, variantTd3, variantTd4, variantTd5 } =
    themeData;
  const { textHeadingColor, textSubHeadingColor } = themeData;

  
  useEffect(() => {
    if (landingPageData.videoAutoPlay && videoRef?.current) {
      videoRef.current.play();
    }
  }, [landingPageData.videoAutoPlay, videoRef]);

  const handleFullscreen = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullScreen) {
        videoElement.webkitRequestFullScreen();
      }
    }
  };
  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-gradient-to-b from-gray-50 to-gray-100"
        style={{
          backgroundImage: "url(/images3/img_group_20.png)",
        }}
        ref={sectionRef}
        id="video"
      >
        <section className="flex overflow-hidden relative flex-col justify-center items-center px-4 py-12 w-full">
          {/* Background elements */}
          {/* <div className="absolute left-[10%] top-1/4 h-[180px] w-[180px] rotate-[15deg] rounded-[90px] bg-blue-400/20 blur-[50px]" />
          <div className="absolute right-[15%] bottom-1/4 h-[220px] w-[220px] rounded-full bg-indigo-300/20 blur-[80px]" />
          <div className="absolute top-[10%] right-[20%] h-[30px] w-[30px] rotate-[15deg] rounded-[14px] bg-blue-400/30" /> */}

          {/* Background elements */}
          {/* <div
            className="absolute left-[10%] top-1/4 h-[180px] w-[180px] rotate-[15deg] rounded-[90px]"
            style={{ background: `${variantPl1}`, filter: 'blur(50px)' }}
          /> */}
          {/* <div
            className="absolute right-[15%] bottom-1/4 h-[220px] w-[220px] rounded-full"
            style={{ background: `${variantPl2}`, filter: 'blur(80px)' }}
          /> */}
          <div
            className="absolute top-[10%] right-[20%] h-[30px] w-[30px] rotate-[15deg] rounded-[14px]"
            style={{ background: `${variantPl3}` }}
          />

          {/* Content container */}
          <div className="container z-10 mx-auto max-w-6xl">
            {/* Header section */}

            <div className="flex flex-col items-center self-stretch mb-1">
              <div className="container flex flex-col gap-2 items-center px-14 mdx:px-5">
                <Heading
                  as="h1"
                  className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] sm:text-[32px]"
                >
                  {landingPageData?.videoTitle}
                </Heading>
                <Text
                  size="text_xl_regular"
                  as="p"
                  className="text-[20px] font-normal text-[#475466]"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: landingPageData?.videoDescription?.replace?.(
                        /\n/g,
                        "<br></br>"
                      ),
                    }}
                  />{" "}
                </Text>
              </div>
            </div>

            {/* Video player */}
            <div className="relative pt-20 mx-auto w-full max-w-4xl">
              <div className="bg-[#5207CD] bg-opacity-20 h-[150px] w-[150px] rounded-full absolute left-[-60px] top-[30px]"></div>
              <div className="relative aspect-video rounded-xl  shadow-2xl bg-gray-400  border-[1rem] border-white">
                {/* Video element */}
                {landingPageData.myVideo && (
                  <video
                    ref={videoRef}
                    src={landingPageData.myVideo}
                    className="object-cover w-full h-full"
                    onTimeUpdate={handleTimeUpdate}
                    autoPlay={landingPageData.videoAutoPlay}
                    muted={isMuted}
                    playsInline
                  />
                )}

                {/* Overlay for controls */}
                <div
                  className="absolute inset-0 hover:opacity-100"
                  onClick={togglePlay}
                >
                  {/* Play button (only shown when paused) */}
                  {!isPlaying && (
                    <div className="flex absolute inset-0 justify-center items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        className="p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform bg-white/30 hover:bg-white/50 hover:scale-105"
                      >
                        {/* <Play size={32} className="text-white fill-white" /> */}
                        <Img
                          src="/images3/img_text_input.svg"
                          alt="Play button"
                          width={60}
                          height={60}
                        />
                      </button>
                    </div>
                  )}

                  {/* Bottom controls bar */}
                  <div className="absolute right-0 bottom-0 left-0 p-4 transition-transform duration-300 smx:p-1">
                    {/* Progress bar */}
                    <div
                      ref={progressBarRef}
                      className="relative mb-3 w-full h-2 cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProgressBarClick(e);
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gray-300/50"></div>
                      <div
                        className="absolute inset-y-0 left-0 bg-white rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                      <div
                        className="absolute w-4 h-4 bg-white rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        style={{
                          left: `calc(${
                            (currentTime / duration) * 100
                          }% - 8px)`,
                          top: "-4px",
                        }}
                      ></div>
                    </div>

                    {/* Time and controls */}
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Mute button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                          className="p-2 rounded-full transition-colors hover:bg-white/20"
                        >
                          {isMuted ? (
                            <VolumeX size={20} className="text-white" />
                          ) : (
                            <Volume2 size={20} className="text-white" />
                          )}
                        </button>

                        {/* Fullscreen button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFullscreen();
                          }}
                          className="p-2 rounded-full transition-colors hover:bg-white/20"
                        >
                          <Maximize size={20} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute  right-0 w-[254px] h-[254px] z-[-1]">
                <div
                  className="absolute inset-0 rounded-full filter blur-[200px]"
                  style={{
                    background:
                      "radial-gradient(circle, #5207CD 100%, transparent 100%)",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const Template1 = ({
  landingPageData,
  videoRef,
  togglePlay,
  handleTimeUpdate,
  isPlaying,
  progressBarRef,
  handleProgressBarClick,
  currentTime,
  duration,
  isMuted,
  toggleMute,
}) => {
  const { handleItemClick } = useFocusContext();

  const { sectionRef, titleRef, textRef } = useVideoHover();
  // Extract colors for dependency tracking
  const primaryColor = landingPageData?.primaryColor || "#26B0C6";
  const secondaryColor = landingPageData?.secondaryColor || "#F7E733";
  const tertiaryColor = landingPageData?.tertiaryColor || "#44b566";

  // Use our template palette hook with the default colors
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#26B0C6",
      secondaryColor: "#F7E733",
      tertiaryColor: "#44b566",
    },
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  const {  subheaderFont, bodyFont } = getFonts(landingPageData);

  return (
    <div className="px-4 py-16 w-full bg-white md:px-8" ref={sectionRef} id="video"
    style={{color:"black",fontFamily: bodyFont?.family}}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3 w-fit mx-auto"
            onClick={() => handleItemClick("videoTitle")}
            ref={titleRef}
            style={{fontFamily: subheaderFont?.family }}
          >
            {landingPageData?.videoTitle?.split(" ")[0] || "Interview"}{" "}
            <span style={{ fontFamily: subheaderFont?.family }}>
              {landingPageData?.videoTitle?.split(" ").slice(1).join(" ") ||
                "Tips"}
            </span>
          </h2>
          <h3
            className=" w-fit mx-auto"
            onClick={() => handleItemClick("videoDescription")}
            ref={textRef}
            style={{ fontFamily: subheaderFont?.family }}
            dangerouslySetInnerHTML={{
              __html: (landingPageData?.videoDescription ||
                ""
              )?.replace?.(/\n/g, "<br>")
            }}
          >
          </h3>
        </div>

        <div className="overflow-hidden relative rounded-2xl shadow-lg aspect-video">
          {/* Video or Thumbnail */}
          <div className="absolute inset-0 bg-black">
            {landingPageData.myVideo ? (
              <video
                ref={videoRef}
                src={landingPageData.myVideo}
                className="object-cover w-full h-full opacity-90"
                onTimeUpdate={handleTimeUpdate}
                autoPlay={landingPageData.videoAutoPlay}
                muted={isMuted}
                playsInline
              />
            ) : (
              <img
                src="/placeholder.svg?height=720&width=1280" // Consider using a fallback image from landingPageData
                alt="Video thumbnail"
                className="object-cover w-full h-full opacity-90"
              />
            )}
          </div>

          {/* Play Button (when paused) */}
          {!isPlaying && (
            <div className="flex absolute inset-0 justify-center items-center">
              <button
                className="flex justify-center items-center w-16 h-16 bg-white bg-opacity-80 rounded-full transition-transform md:w-20 md:h-20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ boxShadow: `0 0 0 2px ${getColor("primary", 500)}` }}
                aria-label="Play video"
                onClick={togglePlay}
              >
                <Play
                  className="ml-1 w-8 h-8 md:w-10 md:h-10"
                  style={{ color: getColor("primary", 500) }}
                />
              </button>
            </div>
          )}

          {/* Video Controls (when playing) */}
          {isPlaying && (
            <div className="absolute right-0 bottom-0 left-0 p-4 bg-gradient-to-t to-transparent from-black/70">
              {/* Progress bar */}
              <div
                ref={progressBarRef}
                className="relative mb-3 w-full h-1.5 cursor-pointer"
                onClick={handleProgressBarClick}
              >
                <div className="absolute inset-0 rounded-full bg-gray-300/50"></div>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    backgroundColor: getColor("primary", 500),
                    width: `${(currentTime / duration) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 text-white rounded-full hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <button
                    onClick={() => {
                      const videoElement = videoRef.current;
                      if (videoElement) {
                        if (videoElement.requestFullscreen) {
                          videoElement.requestFullscreen();
                        } else if (videoElement.mozRequestFullScreen) {
                          videoElement.mozRequestFullScreen();
                        } else if (videoElement.webkitRequestFullScreen) {
                          videoElement.webkitRequestFullScreen();
                        }
                      }
                    }}
                    className="p-1.5 text-white rounded-full hover:bg-white/20"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Video({ landingPageData, fetchData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(!!landingPageData.videoAutoPlay);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        setDuration(videoRef?.current?.duration);
      });
    }
  }, [landingPageData?.myVideo]);

  useEffect(() => {
    if (landingPageData.videoAutoPlay && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (!landingPageData.videoAutoPlay && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [landingPageData.videoAutoPlay, videoRef]);

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
    }
  };

  const handleProgressBarClick = (e) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = (x / rect.width) * duration;
      videoRef.current.currentTime = clickedValue;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const props = {
    landingPageData,
    videoRef,
    togglePlay,
    handleTimeUpdate,
    isPlaying,
    progressBarRef,
    handleProgressBarClick,
    currentTime,
    duration,
    isMuted,
    toggleMute,
  };

  if (landingPageData?.templateId === "3") return <Template3 {...props} />;
  if (landingPageData?.templateId === "2") return <Template2 {...props} />;
  if (landingPageData?.templateId === "1") return <Template1 {...props} />;

  return <Template3 {...props} />;
}
