'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';

const DemoVideoPlayer = ({ compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('auto');
  const [signedUrl, setSignedUrl] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [loadingUrl, setLoadingUrl] = useState(false);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  // Detect connection speed and screen size for adaptive streaming
  useEffect(() => {
    const detectConnectionQuality = () => {
      // Check if Network Information API is available
      if ('connection' in navigator) {
        const connection = navigator.connection;
        const effectiveType = connection.effectiveType;
        
        switch(effectiveType) {
          case '4g':
            setConnectionQuality('high');
            break;
          case '3g':
            setConnectionQuality('medium');
            break;
          case '2g':
          case 'slow-2g':
            setConnectionQuality('low');
            break;
          default:
            setConnectionQuality('auto');
        }
      } else {
        // Default to medium quality if API not available
        setConnectionQuality('medium');
      }
      
      // Also consider screen size
      if (window.innerWidth < 768) {
        setConnectionQuality(prev => prev === 'high' ? 'medium' : prev);
      }
    };
    
    detectConnectionQuality();
    
    // Listen for connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', detectConnectionQuality);
      return () => {
        navigator.connection.removeEventListener('change', detectConnectionQuality);
      };
    }
  }, []);

  // Fetch signed URL for v6 video from backend
  const fetchSignedUrl = async () => {
    const useGCS = process.env.NEXT_PUBLIC_USE_GCS_VIDEOS === 'true';
    if (!useGCS) return null;

    setLoadingUrl(true);
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_PRODUCTION_API_URL 
        : process.env.NEXT_PUBLIC_API_URL;
      
      console.log(`🔗 Fetching signed URL from: ${apiUrl}/video/signed-url?video_version=v6`);
      
      const response = await fetch(`${apiUrl}/video/signed-url?video_version=v6`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Backend API Error: HTTP ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      setSignedUrl(data.signed_url);
      setVideoInfo({ size_mb: data.size_mb, video_version: 'v6' });
      console.log(`✅ Signed URL fetched for v6 video (${data.size_mb}MB)`);
      console.log(`🎥 Video URL: ${data.signed_url.substring(0, 80)}...`);
      return data.signed_url;
      
    } catch (error) {
      console.error('Failed to fetch signed URL:', error);
      return null;
    } finally {
      setLoadingUrl(false);
    }
  };

  // Get video sources with signed URLs - only v6, no fallbacks
  const getVideoSources = () => {
    const useGCS = process.env.NEXT_PUBLIC_USE_GCS_VIDEOS === 'true';
    
    if (useGCS && signedUrl) {
      return [
        // Only v6 video with signed URL - optimized for streaming
        { 
          src: signedUrl, 
          type: "video/mp4", 
          quality: "v6-signed",
          size: videoInfo?.size_mb ? `${videoInfo.size_mb}MB` : "203MB"
        },
      ];
    } else {
      // No video available - signed URL required for v6
      return [];
    }
  };

  // Fetch signed URL on component mount
  useEffect(() => {
    fetchSignedUrl();
  }, []);

  const videoSources = getVideoSources();

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let hideTimer;
    if (showControls && isPlaying) {
      hideTimer = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(hideTimer);
  }, [showControls, isPlaying]);

  // Auto-start video when component mounts (muted for autoplay policy)
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Set initial quality attributes
      video.setAttribute('preload', 'metadata');
      
      // Attempt autoplay (muted)
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log('Video autoplay started successfully');
          })
          .catch(error => {
            console.log('Autoplay was prevented:', error);
            setIsPlaying(false);
            // Show play button for user interaction
            setShowControls(true);
          });
      }
    }
  }, []);

  // Video event handlers
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleLoadedData = () => {
    setVideoLoaded(true);
    setIsBuffering(false);
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      if (!isNaN(videoDuration) && isFinite(videoDuration)) {
        setDuration(videoDuration);
      }
    }
    console.log('Video loaded successfully');
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      if (!isNaN(videoDuration) && isFinite(videoDuration)) {
        setDuration(videoDuration);
      }
      console.log(`Video metadata loaded - Duration: ${videoDuration}s`);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Check buffer status
      const buffered = videoRef.current.buffered;
      if (buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1);
        const currentTime = videoRef.current.currentTime;
        
        // If we have less than 5 seconds buffered ahead, show buffering
        if (bufferedEnd - currentTime < 5 && !videoRef.current.paused) {
          setIsBuffering(true);
        } else {
          setIsBuffering(false);
        }
      }
    }
  };
  
  const handleWaiting = () => {
    console.log('Video buffering...');
    setIsBuffering(true);
  };
  
  const handleCanPlay = () => {
    console.log('Video can play');
    setIsBuffering(false);
  };
  
  const handleError = (e) => {
    console.error('Video error:', e);
    // Try next source if available
    if (videoRef.current) {
      const currentSrc = videoRef.current.currentSrc;
      const currentIndex = videoSources.findIndex(s => currentSrc.includes(s.src));
      if (currentIndex < videoSources.length - 1) {
        console.log('Trying next video source...');
        // Browser will automatically try next source
      }
    }
  };

  // Control handlers
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => {
          console.error('Play failed:', e);
        });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
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
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const containerClassName = compact 
    ? "relative group bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200" 
    : "relative group bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-200";

  const aspectRatioClassName = compact 
    ? "relative aspect-video bg-black" 
    : "relative aspect-video bg-black";

  return (
    <div 
      ref={containerRef}
      className={containerClassName}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying || setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Video Element with optimized attributes */}
      <div className={aspectRatioClassName}>
        <video
          ref={videoRef}
          className="w-full h-full object-contain video-player"
          muted={isMuted}
          autoPlay
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          controls={false}
          disablePictureInPicture={false}
          onPlay={handlePlay}
          onPause={handlePause}
          onLoadedData={handleLoadedData}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
          onError={handleError}
          style={{
            backgroundColor: '#000',
            objectFit: 'contain'
          }}
        >
          {/* Multiple video sources for fallback and quality selection */}
          {videoSources.map((source, index) => (
            <source 
              key={index} 
              src={source.src} 
              type={source.type}
              data-quality={source.quality}
            />
          ))}
          <p className="text-white p-8 text-center">
            Your browser does not support the video tag. 
            <a href={videoSources[0]?.src} className="text-blue-400 underline ml-2">
              Download the demo video
            </a>
          </p>
        </video>

        {/* Loading/Buffering Overlay */}
        {(!videoLoaded || isBuffering || loadingUrl) && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center pointer-events-none">
            <div className="text-center text-white">
              <div className="w-12 h-12 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium">
                {loadingUrl 
                  ? 'Generating secure video URL...' 
                  : !videoLoaded 
                    ? 'Loading PropMatch Demo v6' 
                    : 'Buffering...'}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                {loadingUrl
                  ? 'Authenticating access to latest demo'
                  : !videoLoaded 
                    ? `Loading latest demo ${videoInfo?.size_mb ? `(${videoInfo.size_mb}MB)` : '(203MB)'} • Full HD workflow` 
                    : connectionQuality === 'low' 
                      ? 'Buffering • Please wait' 
                      : 'High-quality streaming • Complete demonstration'}
              </p>
            </div>
          </div>
        )}

        {/* Play Button Overlay (when paused) */}
        {!isPlaying && videoLoaded && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <button
              onClick={togglePlayPause}
              className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-2xl`}
              aria-label="Play video"
            >
              <FaPlay className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-gray-900 ml-1`} />
            </button>
          </div>
        )}

        {/* Video Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent ${compact ? 'p-4' : 'p-6'} transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div className={compact ? 'mb-3' : 'mb-4'}>
            <div 
              className={`${compact ? 'h-1.5' : 'h-2'} bg-gray-600 rounded-full cursor-pointer hover:h-3 transition-all duration-200`}
              onClick={handleSeek}
              role="slider"
              aria-label="Video progress"
              aria-valuemin="0"
              aria-valuemax={duration}
              aria-valuenow={currentTime}
            >
              <div 
                className="h-full bg-blue-500 rounded-full relative transition-all duration-100"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200`}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <FaPause className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                ) : (
                  <FaPlay className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-white ml-0.5`} />
                )}
              </button>

              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200`}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <FaVolumeMute className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                ) : (
                  <FaVolumeUp className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                )}
              </button>

              {/* Time Display */}
              <div className={`text-white ${compact ? 'text-xs' : 'text-sm'} font-medium select-none`}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              {/* Quality Indicator */}
              {connectionQuality !== 'auto' && (
                <span className={`text-white ${compact ? 'text-xs' : 'text-sm'} bg-white bg-opacity-20 px-2 py-1 rounded`}>
                  {connectionQuality === 'high' ? '4K' : connectionQuality === 'medium' ? 'HD' : 'SD'}
                </span>
              )}
              
              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200`}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <FaCompress className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                ) : (
                  <FaExpand className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoPlayer;