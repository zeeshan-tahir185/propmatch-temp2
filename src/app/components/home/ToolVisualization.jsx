"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
} from "react-icons/fa";

const ToolVisualization = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true); // Always visible now
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  // Only use v6 videos via signed URL - no fallbacks
  const useGCSVideos = process.env.NEXT_PUBLIC_USE_GCS_VIDEOS === "true";
  const [signedVideoUrl, setSignedVideoUrl] = useState(null);
  const [isLoadingSignedUrl, setIsLoadingSignedUrl] = useState(false);
  const [signedUrlError, setSignedUrlError] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  // Fetch signed URL from backend API
  const fetchSignedUrl = async () => {
    if (!useGCSVideos) return null;

    setIsLoadingSignedUrl(true);
    setSignedUrlError(null);

    try {
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_PRODUCTION_API_URL
          : process.env.NEXT_PUBLIC_API_URL;

      console.log(
        `🔗 Fetching signed URL from: ${apiUrl}/video/signed-url?video_version=v6`
      );

      const response = await fetch(
        `${apiUrl}/video/signed-url?video_version=v6`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend API Error: HTTP ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      setSignedVideoUrl(data.signed_url);
      setVideoInfo({ size_mb: data.size_mb, video_version: "v6" });
      console.log(`✅ Signed URL fetched for v6 video (${data.size_mb}MB)`);
      console.log(`🎥 Video URL: ${data.signed_url.substring(0, 80)}...`);
      return data.signed_url;
    } catch (error) {
      console.error("❌ Failed to fetch signed URL:", error);
      setSignedUrlError(error.message);

      // In production, don't fall back silently - show the error
      if (process.env.NODE_ENV === "production") {
        console.error(
          "🚨 Production video loading failed - check backend deployment"
        );
      }
      return null;
    } finally {
      setIsLoadingSignedUrl(false);
    }
  };

  // Auto-refresh signed URL before expiry
  useEffect(() => {
    if (!useGCSVideos) return;

    // Initial fetch
    fetchSignedUrl();

    // Set up auto-refresh (every 50 minutes)
    const refreshInterval = setInterval(() => {
      console.log("🔄 Auto-refreshing signed URL...");
      fetchSignedUrl();
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(refreshInterval);
  }, [useGCSVideos]);

  const videoSources =
    useGCSVideos && signedVideoUrl
      ? [
          // Only v6 video with signed URL - optimized for streaming
          {
            src: signedVideoUrl,
            type: "video/mp4",
            quality: "v6-signed",
            size: videoInfo?.size_mb ? `${videoInfo.size_mb}MB` : "203MB",
          },
        ]
      : [
          // No video available - signed URL required for v6
        ];

  // Load video immediately for testing
  useEffect(() => {
    console.log("🚀 Video configuration:");
    console.log("useGCSVideos:", useGCSVideos);
    console.log("Environment:", process.env.NODE_ENV);
    console.log(
      "NEXT_PUBLIC_USE_GCS_VIDEOS:",
      process.env.NEXT_PUBLIC_USE_GCS_VIDEOS
    );
    console.log("signedVideoUrl exists:", !!signedVideoUrl);
    console.log("isLoadingSignedUrl:", isLoadingSignedUrl);
    console.log("signedUrlError:", signedUrlError);
    console.log("videoSources:", videoSources);
    if (videoSources[0]?.src) {
      console.log(
        "Primary video source:",
        videoSources[0].src.substring(0, 80) + "...",
        `(${videoSources[0].quality})`
      );
    }
    setShouldLoadVideo(true);

    // Set a timeout to show error message if video takes too long
    if (useGCSVideos && !signedVideoUrl && !signedUrlError) {
      const timeout = setTimeout(() => {
        if (!signedVideoUrl && !signedUrlError) {
          console.log("⏰ Video loading timeout - may indicate backend issues");
          setSignedUrlError("Video loading timeout - check backend connection");
        }
      }, 30000); // 30 seconds timeout for signed URL fetch

      return () => clearTimeout(timeout);
    }
  }, [useGCSVideos, videoLoaded, signedVideoUrl, signedUrlError]);

  // Simplified controls - no auto-hide to prevent conflicts

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  // Video initialization - Manual control only (no autoplay)
  useEffect(() => {
    if (videoRef.current && shouldLoadVideo) {
      const video = videoRef.current;
      console.log("🎬 Desktop video initialized - manual control only");

      // Set up video for manual control
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
    }
  }, [shouldLoadVideo]);

  // Simplified video event handlers
  const handlePlay = () => {
    console.log("🎬 Video: Play event");
    setIsPlaying(true);
  };
  const handlePause = () => {
    console.log("⏸️ Video: Pause event");
    setIsPlaying(false);
  };
  const handleLoadedData = () => {
    console.log("✅ Video: Loaded data event");
    setVideoLoaded(true);
    setIsBuffering(false);
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (!isNaN(duration) && isFinite(duration)) {
        setDuration(duration);
        console.log(`📊 Video duration: ${duration}s`);
      }
    }
  };

  const handleError = (e) => {
    console.error("❌ Video error:", e);
    console.log("🚨 v6 video failed to load - check backend connection");

    // Set error state to show user what happened
    if (!signedUrlError) {
      setSignedUrlError("Video playback failed - may be a network issue");
    }
  };

  const handleLoadStart = () => {
    console.log("🔄 Video: Load start");
    setIsBuffering(true);
  };

  const handleCanPlayThrough = () => {
    console.log("🎯 Video: Can play through");
    setIsBuffering(false);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (!isNaN(duration) && isFinite(duration)) {
        setDuration(duration);
      }
    }
  };
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  const handleWaiting = () => setIsBuffering(true);
  const handleCanPlay = () => setIsBuffering(false);

  // Control handlers with debounce
  const togglePlayPause = async () => {
    if (!videoRef.current) {
      console.warn("⚠️ Desktop video ref is null");
      return;
    }

    // Prevent rapid multiple calls
    if (isToggling) {
      console.log("🚫 Desktop togglePlayPause blocked - already toggling");
      return;
    }

    setIsToggling(true);
    console.log(
      "🎮 Desktop togglePlayPause called, current isPlaying:",
      isPlaying
    );

    try {
      if (isPlaying) {
        console.log("⏸️ Desktop attempting to pause video");
        videoRef.current.pause();
      } else {
        console.log("▶️ Desktop attempting to play video");
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          console.log("✅ Desktop video play promise resolved");
        }
      }
    } catch (error) {
      console.error("❌ Desktop Play/Pause failed:", error);
      // Try to recover from play failure
      if (!isPlaying) {
        setIsPlaying(false);
        setShowControls(true);
      }
    } finally {
      // Reset debounce flag after a short delay
      setTimeout(() => {
        setIsToggling(false);
      }, 500);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current.msRequestFullscreen) {
          await containerRef.current.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log("Fullscreen toggle failed:", error);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-br from-blue-50/30 to-indigo-50/50 py-20 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container-responsive relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            See How PropMatch Turns Cold Leads into Listings
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Watch PropMatch transform your cold leads into a ranked, deal-ready
            pipeline in just 90 seconds.
          </p>
        </div>

        {/* Video Player Container - Enterprise Style - Professional Grade */}
        <div className="max-w-6xl mx-auto">
          <div
            ref={containerRef}
            className="relative group bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-700/30 backdrop-blur-sm ring-1 ring-white/10 transition-all duration-300 hover:shadow-3xl hover:ring-white/20"
            onMouseEnter={() => setShowControls(true)}
            onMouseMove={() => setShowControls(true)}
          >
            {/* Video Element */}
            <div className="relative aspect-video bg-black">
              {/* Loading/Buffering Overlay for v6 video */}
              {(isLoadingSignedUrl ||
                (!videoLoaded && videoSources.length > 0) ||
                isBuffering) && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center pointer-events-none z-10">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium">
                      {isLoadingSignedUrl
                        ? "Generating secure video URL..."
                        : !videoLoaded
                        ? "Loading PropMatch Demo v6"
                        : "Buffering..."}
                    </p>
                    <p className="text-sm text-gray-300 mt-2">
                      {isLoadingSignedUrl
                        ? "Authenticating access to latest demo"
                        : !videoLoaded
                        ? `Loading latest demo ${
                            videoInfo?.size_mb
                              ? `(${videoInfo.size_mb}MB)`
                              : "(203MB)"
                          } • Full HD workflow`
                        : "High-quality streaming • Complete demonstration"}
                    </p>
                  </div>
                </div>
              )}

              {shouldLoadVideo && videoSources.length > 0 ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain video-player"
                  style={{
                    backgroundColor: "#000",
                    objectFit: isFullscreen ? "contain" : "contain",
                    transform: isFullscreen ? "none" : "none",
                    willChange: "transform",
                  }}
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  crossOrigin="anonymous"
                  controls={false}
                  disablePictureInPicture={false}
                  poster="/demo/poster.png"
                  x-webkit-airplay="allow"
                  webkit-playsinline="true"
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onLoadedData={handleLoadedData}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onWaiting={handleWaiting}
                  onCanPlay={handleCanPlay}
                  onError={handleError}
                  onLoadStart={handleLoadStart}
                  onCanPlayThrough={handleCanPlayThrough}
                >
                  {/* Dynamic video sources from configuration */}
                  {videoSources.map((source, index) => (
                    <source key={index} src={source.src} type={source.type} />
                  ))}
                  <p className="text-white p-8 text-center">
                    {videoSources.length === 0 ? (
                      signedUrlError ? (
                        <>
                          Video unavailable: {signedUrlError}
                          <br />
                          <span className="text-sm text-gray-300 mt-2 block">
                            {process.env.NODE_ENV === "production"
                              ? "Check backend deployment"
                              : "Check backend connection"}
                          </span>
                        </>
                      ) : isLoadingSignedUrl ? (
                        <>
                          <div className="w-12 h-12 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          Loading PropMatch Demo v6...
                          <br />
                          <span className="text-sm text-gray-300 mt-2 block">
                            Generating secure video URL (203MB)
                          </span>
                        </>
                      ) : (
                        <>
                          PropMatch Demo v6
                          <br />
                          <span className="text-sm text-gray-300 mt-2 block">
                            Initializing video player...
                          </span>
                        </>
                      )
                    ) : (
                      <>
                        Your browser does not support the video tag.
                        <br />
                        <a
                          href={videoSources[0]?.src}
                          className="text-blue-400 underline mt-2 inline-block"
                        >
                          Download the demo video
                        </a>
                      </>
                    )}
                  </p>
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaPlay className="w-8 h-8 text-white ml-1" />
                    </div>
                    <p className="text-lg font-medium">PropMatch Demo Ready</p>
                    <p className="text-sm text-gray-300 mt-2">
                      High-quality 4K video • Full workflow demonstration
                    </p>
                  </div>
                </div>
              )}

              {/* Loading Overlay */}
              {(!videoLoaded || isBuffering || isLoadingSignedUrl) && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium">
                      {isLoadingSignedUrl
                        ? "Loading PropMatch Demo v6..."
                        : signedUrlError
                        ? "v6 Demo Unavailable"
                        : signedVideoUrl
                        ? "Loading PropMatch Demo v6"
                        : "Preparing v6 Demo..."}
                    </p>
                    <p className="text-sm text-gray-300 mt-2">
                      {isLoadingSignedUrl
                        ? "Fetching secure video URL from backend..."
                        : signedUrlError
                        ? `Backend Error: ${signedUrlError}`
                        : signedVideoUrl
                        ? "Loading latest v6 demo (203MB) • Full HD workflow"
                        : "Only v6 demo available • Requires backend connection"}
                    </p>
                    {signedUrlError && (
                      <p className="text-xs text-red-300 mt-2">
                        Check browser console for details
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Play Button Overlay (when paused) */}
              {!isPlaying && videoLoaded && !isBuffering && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                >
                  <div className="w-20 h-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl animate-pulse">
                    <FaPlay className="w-8 h-8 text-gray-900 ml-1" />
                  </div>
                </div>
              )}

              {/* Video Controls - Professional Grade */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-8 transition-all duration-300 backdrop-blur-md opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress Bar - Enhanced */}
                <div className="mb-6">
                  <div
                    className="h-1.5 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all duration-300 group"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full relative transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                    </div>
                  </div>
                </div>

                {/* Control Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    {/* Play/Pause - Enhanced */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                      className="w-12 h-12 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border border-white/10"
                    >
                      {isPlaying ? (
                        <FaPause className="w-5 h-5 text-white drop-shadow-sm" />
                      ) : (
                        <FaPlay className="w-5 h-5 text-white ml-0.5 drop-shadow-sm" />
                      )}
                    </button>

                    {/* Mute/Unmute - Enhanced */}
                    <button
                      onClick={toggleMute}
                      className="w-12 h-12 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border border-white/10"
                    >
                      {isMuted ? (
                        <FaVolumeMute className="w-5 h-5 text-white drop-shadow-sm" />
                      ) : (
                        <FaVolumeUp className="w-5 h-5 text-white drop-shadow-sm" />
                      )}
                    </button>

                    {/* Time Display - Enhanced */}
                    <div className="text-white text-sm font-semibold tracking-wide drop-shadow-sm">
                      <span className="tabular-nums">
                        {formatTime(currentTime)}
                      </span>
                      <span className="mx-1 text-white/60">/</span>
                      <span className="tabular-nums text-white/80">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center space-x-5">
                    {/* Video Quality Indicator */}
                    <div className="hidden sm:flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white/70 font-medium tracking-wide uppercase">
                        HD
                      </span>
                    </div>

                    {/* Fullscreen - Enhanced */}
                    <button
                      onClick={toggleFullscreen}
                      className="w-12 h-12 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border border-white/10"
                    >
                      {isFullscreen ? (
                        <FaCompress className="w-5 h-5 text-white drop-shadow-sm" />
                      ) : (
                        <FaExpand className="w-5 h-5 text-white drop-shadow-sm" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Description */}
          {/* <div className="text-center mt-8 max-w-2xl mx-auto">
            <p className="text-gray-600 text-lg leading-relaxed">
              This demo shows the complete PropMatch workflow: upload leads, get AI-powered rankings, 
              and generate personalized outreach messages - all in under a minute.
            </p>
          </div> */}
        </div>
        {/* Call-to-Action */}
        <div className="mt-16 text-center max-w-6xl mx-auto">
          <div
            className="relative rounded-2xl p-8 text-white overflow-hidden w-full"
            style={{
              background: "#1A2B6C",
            }}
          >
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                Ready to transform your lead generation?
              </h3>
              <p className="text-blue-100 text-lg mb-6">
                Start your free trial and see results in minutes.
              </p>
              <a
                href="/login?redirect=dashboard"
                className="bg-white text-[#1A2B6C] hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Secure Your Spot Now – Free 14-Day Trial
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolVisualization;
