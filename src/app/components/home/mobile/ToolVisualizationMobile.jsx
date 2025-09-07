'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';

const ToolVisualizationMobile = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true); // Always visible now
  const [videoLoaded, setVideoLoaded] = useState(true); // Set to true by default to bypass mobile loading issues
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Removed isBuffering state - no buffering indicators on mobile
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  // Removed controlsTimeoutRef - no longer needed

  const [signedVideoUrl, setSignedVideoUrl] = useState(null);
  const [isLoadingSignedUrl, setIsLoadingSignedUrl] = useState(false);
  const [signedUrlError, setSignedUrlError] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  const useGCSVideos = process.env.NEXT_PUBLIC_USE_GCS_VIDEOS === 'true';

  // Fetch signed URL for video - Enhanced mobile production debugging
  const fetchSignedUrl = async () => {
    if (!useGCSVideos) {
      console.log('📱 MOBILE: GCS videos disabled, skipping signed URL fetch');
      return null;
    }

    console.log('📱 MOBILE PRODUCTION DEBUG: Starting signed URL fetch...');
    console.log('📱 MOBILE: NODE_ENV:', process.env.NODE_ENV);
    console.log('📱 MOBILE: NEXT_PUBLIC_USE_GCS_VIDEOS:', process.env.NEXT_PUBLIC_USE_GCS_VIDEOS);
    console.log('📱 MOBILE: NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('📱 MOBILE: NEXT_PUBLIC_PRODUCTION_API_URL:', process.env.NEXT_PUBLIC_PRODUCTION_API_URL);

    setIsLoadingSignedUrl(true);
    setSignedUrlError(null);

    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_PRODUCTION_API_URL 
        : process.env.NEXT_PUBLIC_API_URL;
      
      console.log(`📱 MOBILE: Selected API URL: ${apiUrl}`);
      console.log(`📱 MOBILE: Full fetch URL: ${apiUrl}/video/signed-url?video_version=v6`);
      console.log(`📱 MOBILE: User Agent: ${navigator.userAgent}`);
      
      if (!apiUrl) {
        throw new Error('API URL is undefined - check environment variables');
      }
      
      const fetchStart = Date.now();
      const response = await fetch(`${apiUrl}/video/signed-url?video_version=v6`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'User-Agent': navigator.userAgent
        },
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit' // Don't send cookies/credentials
      });
      
      const fetchDuration = Date.now() - fetchStart;
      console.log(`📱 MOBILE: Fetch completed in ${fetchDuration}ms`);
      console.log(`📱 MOBILE: Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`Backend API Error: HTTP ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`📱 MOBILE: Response data received:`, { 
        has_signed_url: !!data.signed_url, 
        size_mb: data.size_mb,
        video_version: data.video_version 
      });
      
      setSignedVideoUrl(data.signed_url);
      setVideoInfo({ size_mb: data.size_mb, video_version: 'v6' });
      console.log(`✅ MOBILE: Signed URL fetched for v6 video (${data.size_mb}MB)`);
      console.log(`🎥 MOBILE: Video URL preview: ${data.signed_url.substring(0, 80)}...`);
      return data.signed_url;
      
    } catch (error) {
      console.error('❌ MOBILE: Failed to fetch signed URL:', error);
      console.error('📱 MOBILE: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200)
      });
      setSignedUrlError(`Mobile: ${error.message}`);
      
      // In production, don't fall back silently - show the error
      if (process.env.NODE_ENV === 'production') {
        console.error('🚨 MOBILE PRODUCTION: Video loading failed - check backend deployment and CORS');
      }
      return null;
    } finally {
      setIsLoadingSignedUrl(false);
      console.log('📱 MOBILE: Fetch process completed');
    }
  };

  // Auto-refresh signed URL before expiry - Enhanced for mobile
  useEffect(() => {
    if (!useGCSVideos) {
      console.log('📱 MOBILE: GCS videos disabled, no fetch needed');
      return;
    }
    
    console.log('📱 MOBILE: Starting initial signed URL fetch...');
    // Initial fetch with retry
    const initialFetch = async () => {
      try {
        await fetchSignedUrl();
      } catch (error) {
        console.error('📱 MOBILE: Initial fetch failed, retrying in 5s...', error);
        // Retry once after 5 seconds
        setTimeout(() => {
          console.log('📱 MOBILE: Retrying signed URL fetch...');
          fetchSignedUrl().catch(e => {
            console.error('📱 MOBILE: Retry also failed:', e);
          });
        }, 5000);
      }
    };
    
    initialFetch();
    
    // Set up auto-refresh (every 50 minutes)
    const refreshInterval = setInterval(() => {
      console.log('🔄 MOBILE: Auto-refreshing signed URL...');
      fetchSignedUrl();
    }, 50 * 60 * 1000); // 50 minutes
    
    return () => clearInterval(refreshInterval);
  }, [useGCSVideos]);
  
  // Load video configuration - Enhanced mobile production debugging
  useEffect(() => {
    if (!isClient) return;
    
    console.log('🚀 MOBILE PRODUCTION DEBUG - Video configuration:');
    console.log('📱 useGCSVideos:', useGCSVideos);
    console.log('📱 Environment:', process.env.NODE_ENV);
    console.log('📱 NEXT_PUBLIC_USE_GCS_VIDEOS:', process.env.NEXT_PUBLIC_USE_GCS_VIDEOS);
    console.log('📱 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('📱 NEXT_PUBLIC_PRODUCTION_API_URL:', process.env.NEXT_PUBLIC_PRODUCTION_API_URL);
    console.log('📱 signedVideoUrl exists:', !!signedVideoUrl);
    console.log('📱 signedVideoUrl length:', signedVideoUrl?.length || 0);
    console.log('📱 isLoadingSignedUrl:', isLoadingSignedUrl);
    console.log('📱 signedUrlError:', signedUrlError);
    console.log('📱 videoLoaded:', videoLoaded);
    console.log('📱 shouldLoadVideo:', shouldLoadVideo);
    console.log('📱 isClient:', isClient);
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('📱 Is Mobile Device:', /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    
    setShouldLoadVideo(true);
    
    // Set a timeout to show error message if video takes too long
    if (useGCSVideos && !signedVideoUrl && !signedUrlError) {
      console.log('📱 MOBILE: Setting timeout for signed URL fetch (20s for mobile)...');
      const timeout = setTimeout(() => {
        if (!signedVideoUrl && !signedUrlError) {
          console.error('⏰ MOBILE: Video loading timeout - backend connection issue');
          setSignedUrlError('Mobile video loading timeout - check backend connection and CORS');
        }
      }, 20000); // Reduced to 20 seconds for mobile
      
      return () => clearTimeout(timeout);
    }
  }, [isClient, useGCSVideos, videoLoaded, signedVideoUrl, signedUrlError]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || 
                                      document.webkitFullscreenElement || 
                                      document.mozFullScreenElement ||
                                      document.msFullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Video sources configuration - matches desktop
  const videoSources = useGCSVideos && signedVideoUrl ? [
    // Only v6 video with signed URL - optimized for streaming
    { 
      src: signedVideoUrl, 
      type: "video/mp4", 
      quality: "v6-signed",
      size: videoInfo?.size_mb ? `${videoInfo.size_mb}MB` : "203MB"
    }
  ] : [
    // No video available - signed URL required for v6
  ];

  // Handle client-side hydration - Prevent hydration mismatch
  useEffect(() => {
    // Delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsClient(true);
      console.log('📱 MOBILE: Client-side hydration completed');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // No cleanup needed - simplified approach

  // Mobile video initialization - Enhanced for iOS/mobile
  useEffect(() => {
    if (videoRef.current && shouldLoadVideo && isClient) {
      const video = videoRef.current;
      console.log('📱 Mobile video initialized - manual control only');
      console.log('📱 MOBILE VIDEO ELEMENT STATE:', {
        readyState: video.readyState,
        networkState: video.networkState,
        src: video.src?.substring(0, 100) + '...',
        preload: video.preload
      });
      
      // Enhanced mobile video setup
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x-webkit-airplay', 'allow');
      
      // Force load on mobile if needed
      if (video.readyState === 0 && video.src) {
        console.log('📱 MOBILE: Force loading video...');
        video.load();
      }
      
      // No need for timeout since videoLoaded is true by default
      console.log('📱 MOBILE: Video element initialized, videoLoaded already true');
    }
  }, [shouldLoadVideo, isClient, videoLoaded]);

  // Simplified mobile video event handlers
  const handlePlay = () => {
    console.log('🎬 Mobile Video: Play event');
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    console.log('⏸️ Mobile Video: Pause event');
    setIsPlaying(false);
  };
  
  const handleLoadedData = () => {
    console.log('✅ Mobile Video: Loaded data event');
    // Keep videoLoaded as true (already set by default)
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (!isNaN(duration) && isFinite(duration)) {
        setDuration(duration);
        console.log(`📊 Mobile Video duration: ${duration}s`);
      }
    }
  };

  const handleError = (e) => {
    console.error('❌ Mobile Video error:', e);
    console.error('📱 MOBILE VIDEO ERROR DETAILS:', {
      error: e.target?.error,
      networkState: e.target?.networkState,
      readyState: e.target?.readyState,
      src: e.target?.src?.substring(0, 100) + '...'
    });
    setSignedUrlError('Video playback failed');
  };

  const handleLoadStart = () => {
    console.log('🔄 Mobile Video: Load start');
  };

  const handleCanPlayThrough = () => {
    console.log('🎯 Mobile Video: Can play through');
  };

  const handleLoadedMetadata = () => {
    console.log('📊 Mobile Video: Loaded metadata event');
    if (videoRef.current) {
      const video = videoRef.current;
      const duration = video.duration;
      console.log('📱 MOBILE VIDEO METADATA:', {
        duration: duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        networkState: video.networkState,
        src: video.src?.substring(0, 100) + '...'
      });
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
  
  const handleWaiting = () => {
    console.log('🎯 Mobile Video: Waiting event (ignored - no buffering UI)');
  };
  const handleCanPlay = () => {
    console.log('🎯 Mobile Video: Can play event');
    // videoLoaded is already true by default
    console.log('📱 MOBILE: Video can play, videoLoaded already true');
  };

  // Control handlers - Touch optimized with debounce
  const togglePlayPause = async () => {
    if (!videoRef.current) {
      console.warn('⚠️ Mobile video ref is null');
      return;
    }

    // Prevent rapid multiple calls
    if (isToggling) {
      console.log('🚫 Mobile togglePlayPause blocked - already toggling');
      return;
    }

    setIsToggling(true);
    console.log('📱 Mobile togglePlayPause called, current isPlaying:', isPlaying);
    
    try {
      if (isPlaying) {
        console.log('⏸️ Mobile attempting to pause video');
        videoRef.current.pause();
      } else {
        console.log('▶️ Mobile attempting to play video');
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          console.log('✅ Mobile video play promise resolved');
        }
      }
    } catch (error) {
      console.error('❌ Mobile Play/Pause failed:', error);
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
        const element = containerRef.current;
        if (!element) return;
        
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
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

  const handleTouchSeek = (e) => {
    if (videoRef.current && duration && e.touches[0]) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.touches[0].clientX - rect.left) / rect.width;
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

  // Simplified mobile controls - no auto-hide to prevent conflicts


  if (!isClient) {
    return (
      <section className="py-16 relative overflow-hidden" style={{ background: '#1A2B6B' }}>
        <div className="max-w-lg mx-auto px-3 relative">
          <div className="text-center mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              LIVE DEMO
            </span>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              See How PropMatch Turns Cold Leads into Listings
            </h2>
            <p className="text-gray-300 text-base">
              Watch PropMatch transform your cold leads into a ranked, deal-ready pipeline in just 90 seconds.
            </p>
          </div>
          <div className="relative">
            <div className="relative group bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-500/30 backdrop-blur-sm ring-2 ring-white/10">
              <div className="relative bg-black" style={{ aspectRatio: '16/10', minHeight: '260px' }}>
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <svg className="w-6 h-6 text-blue-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l7-5z"/>
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-white">Loading demo experience...</p>
                    <p className="text-sm text-gray-300 mt-2">Preparing for mobile playback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ); // Return loading placeholder during SSR
  }

  return (
    <section ref={sectionRef} className="py-16 relative overflow-hidden" style={{ background: '#1A2B6B' }}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-4 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-20 right-4 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full opacity-5 blur-3xl"></div>
      </div>
      
      <div className="max-w-lg mx-auto px-3 relative">
        
        {/* Live Demo Badge */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            LIVE DEMO
          </span>
        </div>
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            See PropMatch in Action
          </h2>
          <p className="text-gray-300 text-base">
            Watch how AI transforms your lead generation in real-time
          </p>
        </div>

        {/* Enhanced Video Player Container */}
        <div className="relative">
          <div 
            ref={containerRef}
            className={`relative group bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-500/30 backdrop-blur-sm ring-2 ring-white/10 transition-all duration-500 transform hover:shadow-3xl hover:ring-white/25 hover:border-gray-400/40 hover:scale-[1.02] ${
              isFullscreen ? 'fixed inset-0 z-[9998] rounded-none border-none ring-0 flex items-center justify-center bg-black hover:scale-100' : ''
            }`}
            onTouchStart={() => setShowControls(true)}
            onTouchMove={() => setShowControls(true)}
          >
            {/* Video Element - Enlarged */}
            <div 
              className="relative bg-black" 
              style={{
                aspectRatio: '16/10', // Slightly taller than standard 16:9
                minHeight: '260px' // Ensure minimum height on mobile
              }}
            >
              {/* Click Area - Only above controls */}
              <div 
                className="absolute inset-0 cursor-pointer z-10"
                style={{ bottom: '80px' }} // Exclude controls area (approximate height)
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isToggling && videoLoaded) {
                    setShowControls(true);
                    togglePlayPause();
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isToggling && videoLoaded) {
                    setShowControls(true);
                    togglePlayPause();
                  }
                }}
              />
              {/* Loading Overlay - Only show when fetching signed URL */}
              {isLoadingSignedUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center pointer-events-none z-10">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-white">Preparing demo experience...</p>
                    <p className="text-sm text-gray-300 mt-2">Optimizing for mobile playback</p>
                  </div>
                </div>
              )}
              
              {shouldLoadVideo && videoSources.length > 0 ? (
                <video
                  ref={videoRef}
                  className={`w-full h-full object-contain video-player ${
                    isFullscreen ? 'absolute inset-0' : ''
                  }`}
                  muted={isMuted}
                  style={{
                    backgroundColor: '#000',
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    willChange: 'transform'
                  }}
                  playsInline
                  preload="none"
                  crossOrigin="anonymous"
                  controls={false}
                  disablePictureInPicture={false}
                  poster="/demo/poster.png"
                  x-webkit-airplay="allow"
                  webkit-playsinline="true"
                  data-setup="{}"
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
                  {videoSources.map((source, index) => (
                    <source key={index} src={source.src} type={source.type} />
                  ))}
                  <p className="text-white p-8 text-center">
                    {signedUrlError ? (
                      <>
                        Video unavailable: {signedUrlError}<br/>
                        <span className="text-sm text-gray-300 mt-2 block">
                          {process.env.NODE_ENV === 'production' ? 'Check backend deployment' : 'Check backend connection'}
                        </span>
                      </>
                    ) : (
                      <>
                        Your browser does not support the video tag.<br/>
                        <a href={videoSources[0]?.src} className="text-blue-400 underline mt-2 inline-block">
                          Download the demo video
                        </a>
                      </>
                    )}
                  </p>
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <FaPlay className="w-6 h-6 text-blue-400 ml-1" />
                    </div>
                    <p className="text-lg font-medium text-white">Preparing demo experience...</p>
                    <p className="text-sm text-gray-300 mt-2">Optimizing for mobile playback</p>
                    {signedUrlError && (
                      <>
                        <p className="text-xs text-red-300 mt-2">{signedUrlError}</p>
                        <button 
                          onClick={() => {
                            console.log('📱 MOBILE: Manual retry triggered');
                            setSignedUrlError(null);
                            fetchSignedUrl();
                          }}
                          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Retry Loading
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Play Button Overlay (when paused) - Always show on mobile */}
              {!isPlaying && videoLoaded && videoSources.length > 0 && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 via-black/20 to-black/40 cursor-pointer backdrop-blur-[1px]"
                  style={{ bottom: '80px' }} // Don't cover controls area
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Only fire onClick if it's not a touch device
                    if (!('ontouchstart' in window)) {
                      togglePlayPause();
                    }
                  }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-white/95 via-white/90 to-white/85 hover:from-white hover:via-white/95 hover:to-white/90 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl ring-4 ring-white/20 animate-pulse hover:animate-none">
                    <FaPlay className="w-8 h-8 text-gray-800 ml-1 drop-shadow-sm" />
                  </div>
                </div>
              )}

              {/* Touch-Optimized Video Controls */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pb-6 transition-all duration-300 opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress Bar - Sleeker and thinner */}
                <div className="mb-6 px-6">
                  <div 
                    className="h-1 bg-gray-700/60 rounded-full cursor-pointer w-full mx-auto"
                    onClick={handleSeek}
                    onTouchStart={handleTouchSeek}
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full relative shadow-sm"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md border-2 border-blue-500"></div>
                    </div>
                  </div>
                </div>

                {/* Control Bar - Ultra Sleek Design */}
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center space-x-5">
                    {/* Play/Pause - Premium Design */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                      className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 active:from-white/30 active:to-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-xl border border-white/20 hover:border-white/30 touch-manipulation"
                    >
                      {isPlaying ? (
                        <FaPause className="w-5 h-5 text-white drop-shadow-lg" />
                      ) : (
                        <FaPlay className="w-5 h-5 text-white ml-0.5 drop-shadow-lg" />
                      )}
                    </button>

                    {/* Mute/Unmute - Premium Design */}
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 bg-gradient-to-br from-white/15 to-white/5 active:from-white/25 active:to-white/15 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg border border-white/15 hover:border-white/25 touch-manipulation"
                    >
                      {isMuted ? (
                        <FaVolumeMute className="w-4 h-4 text-white/90 drop-shadow-lg" />
                      ) : (
                        <FaVolumeUp className="w-4 h-4 text-white/90 drop-shadow-lg" />
                      )}
                    </button>

                    {/* Time Display - Premium Typography */}
                    <div className="text-white/90 text-xs font-medium tracking-wider drop-shadow-lg bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm hidden sm:flex items-center">
                      <span className="tabular-nums">{formatTime(currentTime)}</span>
                      <span className="mx-1.5 text-white/50">•</span>
                      <span className="tabular-nums text-white/70">{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Quality Indicator - Premium Style */}
                    <div className="flex items-center space-x-2 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-xs text-white/80 font-medium tracking-wider uppercase">4K</span>
                    </div>
                    
                    {/* Fullscreen - Premium Design */}
                    <button
                      onClick={toggleFullscreen}
                      className="w-10 h-10 bg-gradient-to-br from-white/15 to-white/5 active:from-white/25 active:to-white/15 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg border border-white/15 hover:border-white/25 touch-manipulation"
                    >
                      {isFullscreen ? (
                        <FaCompress className="w-4 h-4 text-white/90 drop-shadow-lg" />
                      ) : (
                        <FaExpand className="w-4 h-4 text-white/90 drop-shadow-lg" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">AI Lead Scoring</h3>
              <p className="text-gray-300 text-sm">Instantly rank prospects by likelihood to sell</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">Smart Messaging</h3>
              <p className="text-gray-300 text-sm">AI-generated personalized outreach messages</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h2v1a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-8a2 2 0 00-2 2v.5a.5.5 0 01-.5.5H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">Professional Reports</h3>
              <p className="text-gray-300 text-sm">Automated property analysis and market insights</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-base hover:bg-gray-100 transition-colors active:scale-95 transform shadow-lg">
            Try PropMatch Free
          </button>
          <p className="text-gray-400 text-xs mt-3">No credit card required • 14-day free trial</p>
        </div>
      </div>
    </section>
  );
};

export default ToolVisualizationMobile;
