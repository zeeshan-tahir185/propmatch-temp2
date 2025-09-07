"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import PriceTrendChart from "./PriceTrendChart";
import { GoArrowDownRight, GoArrowUpRight } from "react-icons/go";
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useAddress } from "@/app/context/AddressContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getApiUrl, apiLogger } from "@/app/utils/apiConfig";
import sessionManager, {
  initSession,
  startSearch,
  updateStep,
  completeSearch,
  getCurrentQuery,
} from "@/app/utils/sessionManager";
import { handleApiError, showErrorToUser } from "@/app/utils/errorHandler";

const PropertySearchPage = () => {
  const { addressData, updateAddressData, clearAddressData } = useAddress();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [confirmedAddress, setConfirmedAddress] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  // Initialize session and get current query ID
  const [session, setSession] = useState(null);
  const [queryId, setQueryId] = useState(null);

  useEffect(() => {
    // Initialize session on component mount
    const currentSession = initSession();
    setSession(currentSession);

    // Check if there's an active query
    const currentQuery = getCurrentQuery();
    if (currentQuery && currentQuery.queryId) {
      console.log("📋 Resuming existing query:", currentQuery.queryId);
      setQueryId(currentQuery.queryId);

      // Restore state from session
      if (currentQuery.address) setAddress(currentQuery.address);
      if (currentQuery.confirmedAddress)
        setConfirmedAddress(currentQuery.confirmedAddress);
      if (currentQuery.propertyData) setPropertyData(currentQuery.propertyData);
      if (currentQuery.scoreData) setScoreData(currentQuery.scoreData);
    }

    sessionManager.debugState();
  }, []);
  const [scoreData, setScoreData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const totalSlides = 4;

  // Initialize from context
  useEffect(() => {
    if (addressData.address) setAddress(addressData.address);
    if (addressData.confirmedAddress)
      setConfirmedAddress(addressData.confirmedAddress);
    if (addressData.propertyId) setPropertyId(addressData.propertyId);
    if (addressData.propertyData) setPropertyData(addressData.propertyData);
    if (addressData.scoreData) setScoreData(addressData.scoreData);

    // Update queryId in context when component initializes
    if (!addressData.queryId && queryId) {
      updateAddressData({ queryId: queryId });
    }
  }, [addressData, queryId, updateAddressData]);

  // Messages for loading states
  const loadingMessages = [
    "Analyzing 400+ property indicators",
    "Comparing 100+ neighbourhood homes",
    "Predicting with 92% accuracy",
  ];

  // Slider functionality
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Loading message effect for score generation with progress bar
  useEffect(() => {
    let intervalId;
    let progressIntervalId;
    if (loading && confirmedAddress && !scoreData) {
      let messageIndex = 0;
      setLoadingMessage(loadingMessages[messageIndex]);
      setProgressPercentage(20); // Start at 20%

      const intervalTime = 4000; // 4 seconds per message
      intervalId = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, intervalTime);

      // Progress bar animation
      let currentProgress = 20;
      progressIntervalId = setInterval(() => {
        currentProgress += Math.random() * 15; // Increase by 5-20% each time
        if (currentProgress > 95) currentProgress = 95; // Cap at 95% until completion
        setProgressPercentage(Math.min(currentProgress, 95));
      }, 2000);
    } else if (!loading) {
      setProgressPercentage(0); // Reset when not loading
    }
    return () => {
      clearInterval(intervalId);
      clearInterval(progressIntervalId);
    };
  }, [loading, confirmedAddress, scoreData]);

  const handleAnalyze = async () => {
    if (!address.trim()) {
      setError("Please enter a valid address");
      return;
    }

    // Start new search session
    const newQueryId = startSearch(address);
    if (!newQueryId) {
      setError("Failed to initialize search session");
      return;
    }
    setQueryId(newQueryId);

    setLoading(true);
    setLoadingMessage("Searching for addresses...");
    setError(null);
    setSuggestions([]);

    console.log("🔍 Starting new address search...");
    console.log("📍 Address:", address);
    console.log("🆔 New Query ID:", newQueryId);

    try {
      const apiUrl = getApiUrl();
      const requestData = { address_string: address };

      apiLogger.request("POST", `${apiUrl}/search-addresses`, requestData);

      const response = await axios.post(
        `${apiUrl}/search-addresses?query_id=${newQueryId}&session_id=${session.sessionId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      apiLogger.response(response.status, response.data);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        const suggestions = response.data.suggestions || [];
        setSuggestions(suggestions);

        // Update session with search results
        updateStep(newQueryId, "addressSearch", { suggestions });

        if (suggestions.length > 0) {
          console.log(`✅ Found ${suggestions.length} address suggestions`);
        } else {
          setError("No addresses found matching your search");
        }
      }
    } catch (err) {
      console.error("❌ Search failed:", err);
      apiLogger.error("Address search failed", err);

      const errorResult = await handleApiError(err, {
        allowDemo: false,
        feature: "Property Search",
      });

      if (errorResult.showUpgradePrompt) {
        setLoading(false);
        showErrorToUser(errorResult);
        return;
      } else {
        setError(errorResult.errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = async (index) => {
    setSelectedIndex(index);
    if (index !== null && suggestions.length > 0) {
      const selectedSuggestion = suggestions[index];
      const currentConfirmedAddress = selectedSuggestion.complete_address;
      const currentPropertyId = selectedSuggestion.property_id;
      setConfirmedAddress(currentConfirmedAddress);
      setPropertyId(currentPropertyId);
      updateAddressData({
        confirmedAddress: currentConfirmedAddress,
        propertyId: currentPropertyId,
        queryId: queryId,
      });

      // Fetch property details in background (don't show loading for this step)
      try {
        const apiUrl = getApiUrl();
        const requestData = {
          property_id: currentPropertyId,
          complete_address: currentConfirmedAddress,
        };

        apiLogger.request(
          "POST",
          `${apiUrl}/get-property-details`,
          requestData
        );

        const response = await axios.post(
          `${apiUrl}/get-property-details?query_id=${queryId}`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        apiLogger.response(response.status, response.data);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          const propertyData = response.data.property_data;
          setPropertyData(propertyData);
          updateAddressData({ propertyData: propertyData });

          // Update session with property details
          updateStep(queryId, "propertyDetails", {
            propertyData: propertyData,
            propertyId: currentPropertyId,
            confirmedAddress: currentConfirmedAddress,
          });
        }
      } catch (err) {
        console.error("❌ Property details failed:", err);
        apiLogger.error("Property details failed", err);
        setError("Failed to fetch property details");
      }
    }
  };

  const handleGetPropertyScore = async () => {
    if (!confirmedAddress || !propertyId) {
      setError("Please select a property first");
      return;
    }

    setLoading(true);
    setError(null);

    console.log("🚀 Starting property score prediction...");
    console.log("📍 Address:", confirmedAddress);
    console.log("🆔 Query ID:", queryId);
    console.log("🏠 Property ID:", propertyId);

    try {
      const requestData = {
        address_string: confirmedAddress,
        query_id: queryId,
        property_id: propertyId,
        user_id: user?.user_id || user?.id,
      };
      const apiUrl = getApiUrl();
      const fullUrl = `${apiUrl}/propmatch-score`;

      console.log("📡 Sending request to:", fullUrl);
      console.log("📝 Request data:", requestData);
      console.log("🏠 Property ID:", propertyId);
      console.log("👤 User ID:", user?.user_id || user?.id);
      console.log(
        "🔐 Auth token:",
        localStorage.getItem("token") ? "Present" : "Missing"
      );

      apiLogger.request("POST", fullUrl, requestData);

      const response = await axios.post(fullUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("✅ Response received:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });

      if (response.data.error) {
        console.error("❌ API returned error:", response.data.error);
        setError(response.data.error);
      } else {
        console.log("🎯 Score data received:", response.data.prediction_score);
        const scoreData = response.data.prediction_score;
        setProgressPercentage(100); // Complete the progress bar
        setTimeout(() => {
          setScoreData(scoreData);
          updateAddressData({ scoreData: scoreData });
        }, 500); // Small delay to show 100% completion

        // Update session with score analysis
        updateStep(queryId, "scoreAnalysis", { scoreData: scoreData });

        // Complete the search session
        completeSearch(queryId, {
          confirmedAddress: confirmedAddress,
          propertyData: propertyData,
          scoreData: scoreData,
          finalStatus: "analysis_complete",
        });
      }
    } catch (err) {
      console.error("❌ Request failed:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
        },
      });

      const errorResult = await handleApiError(err, {
        allowDemo: false,
        feature: "Property Score Prediction",
      });

      if (errorResult.showUpgradePrompt) {
        setLoading(false);
        showErrorToUser(errorResult);
        return;
      } else {
        setError(errorResult.errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearAndStartNew = async () => {
    // Clear AI data from backend if we have a property_id
    if (addressData.propertyId || propertyId) {
      try {
        const currentPropertyId = addressData.propertyId || propertyId;
        console.log(
          `🧹 Clearing AI data for property_id: ${currentPropertyId}`
        );

        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/clear-ai-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            property_id: currentPropertyId,
            query_id: addressData.queryId || queryId,
          }),
        });

        const result = await response.json();
        if (result.success) {
          console.log(`✅ Successfully cleared AI data: ${result.message}`);
        } else {
          console.warn(`⚠️ Failed to clear AI data: ${result.error}`);
        }
      } catch (error) {
        console.error("❌ Error clearing AI data:", error);
        // Continue with frontend clearing even if backend clearing fails
      }
    }

    // Clear frontend state
    setAddress("");
    setSuggestions([]);
    setError(null);
    setSelectedIndex(null);
    setConfirmedAddress(null);
    setPropertyId(null);
    setPropertyData(null);
    setScoreData(null);
    clearAddressData();
  };

  // Get current prices for 2025
  const getCurrentPrices = () => {
    console.log("🔍 getCurrentPrices Debug:", {
      scoreData: !!scoreData,
      propertyData: !!propertyData,
      hasPredictions: !!propertyData?.predictions,
      predictionsLength: propertyData?.predictions?.length,
      firstPrediction: !!propertyData?.predictions?.[0]?.predictions,
    });

    if (!propertyData || !propertyData.predictions) {
      console.log("❌ Missing propertyData or predictions");
      return { listingPrice: "N/A", salePrice: "N/A" };
    }

    let listingPrice = "N/A";
    let salePrice = "N/A";

    // PRIORITY 1: Get current prices from property_details (PRIMARY SOURCE)
    if (propertyData?.property_details?.estimate_list_price) {
      listingPrice = `$${Number(
        propertyData.property_details.estimate_list_price
      ).toLocaleString()}`;
      console.log(
        "✅ Using estimate_list_price from property_details:",
        listingPrice
      );
    }

    if (propertyData?.property_details?.estimate_sale_price) {
      salePrice = `$${Number(
        propertyData.property_details.estimate_sale_price
      ).toLocaleString()}`;
      console.log(
        "✅ Using estimate_sale_price from property_details:",
        salePrice
      );
    }

    // PRIORITY 2: Fallback to current year prediction if property_details prices are missing
    if (
      (listingPrice === "N/A" || salePrice === "N/A") &&
      propertyData.predictions &&
      propertyData.predictions?.predictions
    ) {
      const currentYear = new Date().getFullYear(); // 2025
      const predictions = propertyData.predictions.predictions;
      console.log("📊 Fallback to predictions for missing prices");

      const currentYearPrediction = predictions.find((pred) => {
        const predYear = new Date(pred.date).getFullYear();
        return predYear === currentYear;
      });

      if (currentYearPrediction) {
        console.log(
          "✅ Found prediction for",
          currentYear,
          currentYearPrediction
        );
        // Use prediction only if property_details price is missing
        if (
          listingPrice === "N/A" &&
          currentYearPrediction.estimate_list_price
        ) {
          listingPrice = `$${Number(
            currentYearPrediction.estimate_list_price
          ).toLocaleString()}`;
        }
        if (salePrice === "N/A" && currentYearPrediction.estimate_sale_price) {
          salePrice = `$${Number(
            currentYearPrediction.estimate_sale_price
          ).toLocaleString()}`;
        }
      }
    }

    // PRIORITY 3: Final fallback to scoreData if all above sources fail
    if (listingPrice === "N/A" && scoreData) {
      if (scoreData.listing_prices?.current_listing_price) {
        listingPrice = `$${Number(
          scoreData.listing_prices.current_listing_price
        ).toLocaleString()}`;
      } else if (scoreData.listing_prices?.listing_price) {
        listingPrice = `$${Number(
          scoreData.listing_prices.listing_price
        ).toLocaleString()}`;
      } else if (scoreData.listing_price) {
        listingPrice = `$${Number(scoreData.listing_price).toLocaleString()}`;
      } else if (scoreData.current_listing_price) {
        listingPrice = `$${Number(
          scoreData.current_listing_price
        ).toLocaleString()}`;
      }
      console.log(
        "🔄 Using scoreData fallback for listingPrice:",
        listingPrice
      );
    }

    if (salePrice === "N/A" && scoreData) {
      if (scoreData.listing_prices?.market_pace_6_months) {
        salePrice = `$${Number(
          scoreData.listing_prices.market_pace_6_months
        ).toLocaleString()}`;
      }
      console.log("🔄 Using scoreData fallback for salePrice:", salePrice);
    }

    console.log("🔍 Final prices:", { listingPrice, salePrice });
    console.log("📋 ScoreData structure:", scoreData);
    console.log("🏠 PropertyData structure:", propertyData);
    return { listingPrice, salePrice };
  };

  const { listingPrice, salePrice } = getCurrentPrices();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Process on Right - Mobile Optimized */}
      <section className="mx-3 sm:mx-6 my-4 sm:my-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-8 lg:p-12 rounded-2xl bg-gradient-to-r from-[#0a2c53] to-[#1e5ea5] text-white relative overflow-hidden shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            Unlock True Property Value with Predictive AI
          </h1>
          <p className="text-base sm:text-lg mb-5 sm:mb-7 text-blue-100 leading-relaxed max-w-2xl">
            Discover how AI predicts seller likelihood and helps you connect
            with homeowners before they list. Go beyond standard CMAs with
            precise insights in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#search-section"
              className="inline-block bg-white text-[#0a2c53] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 hover:transform hover:-translate-y-1 shadow-lg text-center touch-manipulation"
            >
              Try Live Tool Now
            </a>
            {/* <button className="inline-block bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-200">
                            Watch 2-min Demo
                        </button> */}
          </div>
        </div>
        {/* Full Experience the PropMatch Process section on right - Mobile Optimized */}
       <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-gray-800 shadow-2xl">
  <h3 className="text-lg sm:text-xl font-bold text-[#0a2c53] mb-3 sm:mb-4 text-center">
    Experience the PropMatch Process
  </h3>

  {/* Content with overlay navigation */}
  <div className="relative overflow-hidden rounded-lg">
    <div
      className="flex w-[400%] transition-transform duration-500"
      style={{ transform: `translateX(-${currentSlide * 25}%)` }}
    >
      {/* Step 1 Video */}
      <div className="w-1/4 flex justify-center items-center">
        <video
          src="/video/video1.mp4"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          className="rounded-lg w-full h-64 object-cover"
        />
      </div>

      {/* Step 2 Video */}
      <div className="w-1/4 flex justify-center items-center">
        <video
          src="/video/video2.mp4"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          className="rounded-lg w-full h-64 object-cover"
        />
      </div>

      {/* Step 3 Video */}
      <div className="w-1/4 flex justify-center items-center">
        <video
          src="/video/video3.mp4"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          className="rounded-lg w-full h-64 object-cover"
        />
      </div>

      {/* Step 4 Video */}
      <div className="w-1/4 flex justify-center items-center">
        <video
          src="/video/video4.mp4"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          className="rounded-lg w-full h-64 object-cover"
        />
      </div>
    </div>

    {/* Left Navigation */}
    <button
      onClick={prevSlide}
      className="absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md"
    >
      <FaChevronLeft className="text-gray-700" />
    </button>

    {/* Right Navigation */}
    <button
      onClick={nextSlide}
      className="absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md"
    >
      <FaChevronRight className="text-gray-700" />
    </button>
  </div>

  {/* Indicators */}
  <div className="flex justify-center gap-1 mt-4">
    {Array.from({ length: totalSlides }, (_, i) => (
      <div
        key={i}
        onClick={() => goToSlide(i)}
        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
          currentSlide === i ? "bg-[#0a2c53]" : "bg-gray-300"
        }`}
      />
    ))}
  </div>
</div>

      </section>

      {/* Value Propositions moved below interactive tool per request - see new position further down */}

      {/* INTERACTIVE TOOL SECTION - 3-STEP PROCESS - Mobile Optimized */}
      <section
        id="search-section"
        className="mx-3 sm:mx-6 my-4 sm:my-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 sm:p-8 shadow-lg relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

        {/* Header with distinctive styling - Mobile Optimized */}
        <div className="text-center mb-4 sm:mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-[#1A2B6C] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE INTERACTIVE TOOL
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0d3c75] mb-2">
            Try Our AI Property Search
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Enter any Canadian property address below to get instant AI-powered
            insights.
          </p>
        </div>

        {/* STEP 1: INTERACTIVE PROPERTY SEARCH - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 mb-6">
            <div className="relative flex-1">
              <HiOutlineLocationMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1A2B6C] text-lg" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter property address (e.g., 123 Main St, Toronto)"
                className="w-full h-12 pl-10 pr-3 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-[#1A2B6C] hover:bg-blue-900 disabled:bg-gray-400 text-white px-4 sm:px-6 h-12 font-medium flex items-center justify-center gap-2 transition-colors rounded-md sm:rounded-l-none sm:rounded-r-md touch-manipulation"
            >
              <IoSearchOutline />
              Search
            </button>
            <button
              onClick={handleClearAndStartNew}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 sm:px-5 h-12 rounded-md sm:rounded-l-none sm:rounded-r-md font-medium transition-colors sm:ml-3 touch-manipulation"
            >
              Clear
            </button>
          </div>

          {/* Interactive search feedback */}
          {loading && !confirmedAddress && (
            <div className="text-sm text-gray-600 mb-4 flex items-center bg-blue-50 p-3 rounded-lg">
              <div className="w-4 h-4 border-2 border-t-[#1A2B6C] border-gray-200 rounded-full animate-spin mr-3"></div>
              <div>
                <span className="font-medium">
                  Searching 17 million properties...
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  Finding validated addresses in your area
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </p>
          )}
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="flex justify-between mb-8">
          {[
            { label: "Search Property", step: 1, icon: "🔍" },
            { label: "Select & Analyze", step: 2, icon: "🏠" },
            { label: "AI Processing", step: 3, icon: "🧠" },
          ].map(({ label, step, icon }, index) => (
            <div key={step} className="flex-1 text-center relative">
              <div
                className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center font-semibold text-lg ${
                  (suggestions.length > 0 && index === 0) ||
                  (confirmedAddress && !scoreData && index === 1) ||
                  (scoreData && index === 2)
                    ? "bg-[#0d3c75] text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {(suggestions.length > 0 && index === 0) ||
                (confirmedAddress && !scoreData && index === 1) ||
                (scoreData && index === 2)
                  ? icon
                  : step}
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {label}
              </span>
              {index < 2 && (
                <div
                  className={`absolute right-0 top-6 h-0.5 w-full -z-10 ${
                    (confirmedAddress && index === 0) ||
                    (scoreData && index === 1)
                      ? "bg-[#0d3c75]"
                      : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* STEP 2: ADDRESS SELECTION WITH IMMEDIATE PREDICT SCORE - Mobile Optimized */}
      {suggestions.length > 0 && !loading && !scoreData && (
        <section className="mx-3 sm:mx-6 my-4 sm:my-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0d3c75]">
              Found {suggestions.length} Validated Addresses
            </h3>
          </div>
          <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
            Select your property below. The Predict Score button will appear
            immediately.
          </p>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`border-2 rounded-xl p-3 sm:p-4 transition-all duration-200 ${
                  selectedIndex === index
                    ? "border-[#1A2B6C] bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  onClick={() => handleSelectAddress(index)}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 w-full">
                    <HiOutlineLocationMarker className="text-[#1A2B6C] text-lg flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      {suggestion.complete_address}
                    </span>
                  </div>
                  {selectedIndex === index && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                        Selected
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetPropertyScore();
                        }}
                        disabled={loading}
                        className="bg-[#1A2B6C] hover:bg-blue-900 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto touch-manipulation"
                      >
                        {loading ? (
                          <div className="w-3 h-3 border-2 border-t-white border-gray-300 rounded-full animate-spin"></div>
                        ) : (
                          <>
                            Predict Score
                            <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded text-xs font-semibold">
                              AI
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STEP 3: INTERACTIVE AI PROCESSING */}
      {confirmedAddress && loading && !scoreData && (
        <section className="mx-6 my-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold text-[#0d3c75]">
              AI Analysis in Progress
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Processing AI Analysis...</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {progressPercentage < 30
                ? "Initializing AI models..."
                : progressPercentage < 60
                ? "Processing property data..."
                : progressPercentage < 90
                ? "Finalizing analysis..."
                : "Almost complete..."}
            </div>
          </div>

          <div className="space-y-4">
            {/* Step-by-step AI processing visualization */}
            {[
              {
                text: "Analyzing full address",
                subtext: "Validating property details and location data",
                completed: true,
              },
              {
                text: "Comparing 100+ neighbourhood homes",
                subtext: "Machine learning comparison across neighbourhood",
                completed: true,
              },
              {
                text: "Neighbourhood statistics",
                subtext: "Market trends, price patterns, sales velocity",
                completed: true,
              },
              {
                text: "Applying Advanced AI algorithms",
                subtext: "92% accuracy prediction model processing",
                completed: false,
              },
              {
                text: "Generating seller likelihood score",
                subtext: "Final AI-powered property assessment",
                completed: false,
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 bg-white/70 rounded-lg"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.completed ? "bg-green-500" : "bg-yellow-400"
                  }`}
                >
                  {step.completed ? (
                    <span className="text-white text-xs">✓</span>
                  ) : (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{step.text}</div>
                  <div className="text-sm text-gray-600">{step.subtext}</div>
                </div>
              </div>
            ))}

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-t-blue-600 border-gray-300 rounded-full animate-spin"></div>
                <span className="font-medium text-blue-800">
                  {loadingMessage}
                </span>
              </div>
              <div className="text-sm text-blue-600 mt-2">
                This typically takes 15-30 seconds for maximum accuracy
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STEP 3 COMPLETE: AI ANALYSIS RESULTS */}
      {scoreData && propertyData && (
        <section className="mx-6 my-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0d3c75]">
                AI Analysis Complete!
              </h2>
              <p className="text-sm text-gray-600">
                Advanced machine learning analysis finished in seconds
              </p>
            </div>
          </div>

          {/* Display full address */}
          <div className="mb-4 p-3 bg-white/70 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {confirmedAddress ||
                  addressData.confirmedAddress ||
                  "Property Address"}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div
              className="w-28 h-28 rounded-full relative flex items-center justify-center"
              style={{
                background: `conic-gradient(${
                  scoreData?.predicted_score >= 7
                    ? "#28a745"
                    : scoreData?.predicted_score >= 4
                    ? "#ffc107"
                    : "#dc3545"
                } ${(scoreData?.predicted_score / 10) * 360}deg, #e6e8ed ${
                  (scoreData?.predicted_score / 10) * 360
                }deg)`,
              }}
            >
              <div className="absolute inset-2 bg-white rounded-full"></div>
              <span className="relative text-2xl font-bold text-[#0d3c75]">
                {scoreData?.predicted_score?.toFixed(1) || "0.0"}/10
              </span>
            </div>
            <div className="flex-1">
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <FaCheck className="text-green-500 mr-3 text-sm" />
                  Analyzed 400+ property indicators
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheck className="text-green-500 mr-3 text-sm" />
                  Compared with 100+ neighbourhood homes
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheck className="text-green-500 mr-3 text-sm" />
                  92% prediction accuracy
                </li>

                {/* {propertyData?.property_details?.estimate_days_on_market_until_sale && (
                                    <li className="flex items-center text-gray-600">
                                        <FaCheck className="text-green-500 mr-3 text-sm" />
                                        Expected sale in {propertyData.property_details.estimate_days_on_market_until_sale} days
                                    </li>
                                )} */}
              </ul>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {(() => {
              const listingPrices = scoreData?.listing_prices || {};
              const quickSale = listingPrices.quick_sale_2_months || 0;
              const marketPace = listingPrices.market_pace_6_months || 0;
              const patientSale = listingPrices.patient_sale_12_months || 0;

              // Calculate percentages relative to market pace (baseline)
              const quickPercent =
                marketPace > 0
                  ? (((quickSale - marketPace) / marketPace) * 100).toFixed(1)
                  : 0;
              const patientPercent =
                marketPace > 0
                  ? (((patientSale - marketPace) / marketPace) * 100).toFixed(1)
                  : 0;

              return (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      Quick Sale <span className="text-xs">(2 months)</span>
                    </div>
                    <div className="text-xl font-bold text-[#0a2c53] mb-1">
                      ${quickSale.toLocaleString()}
                    </div>
                    <div
                      className={`flex items-center justify-center text-sm ${
                        quickPercent < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {quickPercent < 0 ? (
                        <GoArrowDownRight className="mr-1" />
                      ) : (
                        <GoArrowUpRight className="mr-1" />
                      )}
                      {quickPercent < 0 ? quickPercent : `+${quickPercent}`}%
                    </div>
                  </div>
                  <div className="bg-[#f1f5fb] border-2 border-[#0d3c75] rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      Market Pace <span className="text-xs">(6 months)</span>
                    </div>
                    <div className="text-xl font-bold text-[#0a2c53] mb-1">
                      ${marketPace.toLocaleString()}
                    </div>
                    <div className="text-gray-600 flex items-center justify-center text-sm">
                      <span className="mr-1">—</span>Baseline
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      Patient Sale <span className="text-xs">(12 months)</span>
                    </div>
                    <div className="text-xl font-bold text-[#0a2c53] mb-1">
                      ${patientSale.toLocaleString()}
                    </div>
                    <div
                      className={`flex items-center justify-center text-sm ${
                        patientPercent < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {patientPercent < 0 ? (
                        <GoArrowDownRight className="mr-1" />
                      ) : (
                        <GoArrowUpRight className="mr-1" />
                      )}
                      {patientPercent < 0
                        ? patientPercent
                        : `+${patientPercent}`}
                      %
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Analysis Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-700 leading-relaxed">
              {scoreData?.statistical_reasoning ||
                "Property analysis data is being processed..."}
            </p>
          </div>

          {/* Price Trends */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#1E2029] mb-4 text-center md:text-left">
              Price Trends
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg min-h-[200px] flex flex-col md:flex-row items-center justify-center">
              <div className="p-5 text-center md:text-left w-full md:w-auto">
                <h4 className="text-sm font-semibold mb-2">
                  Current Property Pricing
                </h4>
                {!propertyData || !scoreData ? (
                  <div className="space-y-2 text-gray-500">
                    <div className="text-sm">
                      Search for a property to see pricing data
                    </div>
                    <div className="text-xs">• Enter address above</div>
                    <div className="text-xs">• Select from suggestions</div>
                    <div className="text-xs">• Click "Predict Score"</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <span className="text-lg text-[#1A2B6C] font-semibold">
                        {listingPrice}
                      </span>
                      <span className="text-gray-500 text-sm font-normal ml-2">
                        List Price
                      </span>
                    </div>
                    <div>
                      <span className="text-lg text-[#1A2B6C] font-semibold">
                        {salePrice}
                      </span>
                      <span className="text-gray-500 text-sm font-normal ml-2">
                        Sale Price
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 w-full flex items-center justify-center">
                {propertyData &&
                propertyData.predictions &&
                propertyData.predictions.predictions ? (
                  <div className="w-full">
                    <PriceTrendChart
                      predictions={propertyData.predictions.predictions}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400 text-sm text-center">
                    {loading
                      ? "Loading price trends..."
                      : "Price trend chart will appear after property analysis"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <button
              onClick={() => router.push("/dashboard/outreach-messages")}
              className="bg-[#1A2B6C] hover:bg-blue-900 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Generate Outreach
            </button>
            <button
              onClick={() => router.push("/dashboard/reports")}
              className="bg-[#1A2B6C] hover:bg-blue-900 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Generate Report
            </button>
            <button
              onClick={handleClearAndStartNew}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Clear & Start New
            </button>
          </div>
        </section>
      )}

      {/* Why PropMatch AI Works (moved below tool) */}
      {/* <section className="mx-6 my-6 p-10 bg-white rounded-xl shadow-sm">
        <h2 className="text-center text-3xl font-bold text-[#0a2c53] mb-10">
          Why PropMatch AI Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gray-50 rounded-xl border hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-[#0a2c53] mb-3">
              Precision Targeting
            </h3>
            <p className="text-gray-600">
              AI analyzes 400+ factors to identify sellers with 92% accuracy
              before they list
            </p>
          </div>
          <div className="text-center p-8 bg-gray-50 rounded-xl border hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-[#0a2c53] mb-3">
              Proven ROI
            </h3>
            <p className="text-gray-600">
              3x conversion rate vs traditional prospecting with data-driven
              insights
            </p>
          </div>
          <div className="text-center p-8 bg-gray-50 rounded-xl border hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold text-[#0a2c53] mb-3">
              Time Efficiency
            </h3>
            <p className="text-gray-600">
              From address to actionable insight in under 20 seconds with
              comprehensive analysis
            </p>
          </div>
        </div>
      </section> */}

      {/* Additional Features Section */}
      <section className="mx-6 my-6 p-12 bg-white rounded-xl shadow-sm">
        <h2 className="text-3xl font-bold text-[#0a2c53] text-center mb-8">
          Unlock Additional Features
        </h2>
        <div className="flex flex-wrap gap-8">
          <div className="flex-1 min-w-[300px] bg-gray-50 border border-gray-200 rounded-xl p-8 transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg">
            <h3 className="flex items-center gap-3 text-xl font-semibold text-[#0a2c53] mb-4">
              <div className="text-2xl text-[#1e5ea5]">🚀</div>
              AI-Powered Outreach Messages
            </h3>
            <p className="text-gray-600 mb-5 text-sm leading-relaxed">
              Engage homeowners with personalised messages crafted from our AI
              insights. Increase response rates and build relationships that
              convert.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-[#1e5ea5] mr-2">✓</span>
                Personalised to each property
              </li>
              <li className="flex items-center">
                <span className="text-[#1e5ea5] mr-2">✓</span>
                5× higher response rate
              </li>
              <li className="flex items-center">
                <span className="text-[#1e5ea5] mr-2">✓</span>
                Professional tone and approach
              </li>
              <li className="flex items-center">
                <span className="text-[#1e5ea5] mr-2">✓</span>
                Customisable templates
              </li>
            </ul>
            <button
              onClick={() =>
                (window.location.href = "/dashboard/outreach-messages")
              }
              className="bg-[#1A2B6C] hover:bg-[#174a89] text-white px-5 py-3 rounded-md font-semibold transition-all duration-200 hover:transform hover:-translate-y-0.5"
            >
              Generate Outreach
            </button>
          </div>
          <div className="flex-1 min-w-[300px] bg-gray-50 border border-gray-200 rounded-xl p-8 transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg">
            <h3 className="flex items-center gap-3 text-xl font-semibold text-[#0a2c53] mb-4">
              <div className="text-2xl text-[#1e5ea5]">📊</div>
              Client-Ready PDF Reports
            </h3>
            <p className="text-gray-600 mb-5 text-sm leading-relaxed">
              Deliver comprehensive market reports branded with your logo.
              Impress sellers with data-rich insights and price recommendations.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-[#1e5ea5] mr-2">✓</span>
                Branded with your logo
              </li>
              <li className="flex items-center">
                <span className="text-[#1e5ea5] mr-2">✓</span>
                Comprehensive market analysis
              </li>
              <li className="flex items-center">
                <span className="text-[#1e5ea5] mr-2">✓</span>
                Comparable properties included
              </li>
              <li className="flex items-center">
                <span className="text-[#1e5ea5] mr-2">✓</span>
                Price recommendations
              </li>
            </ul>
            <button
              onClick={() => (window.location.href = "/dashboard/reports")}
              className="bg-[#1A2B6C] hover:bg-[#174a89] text-white px-5 py-3 rounded-md font-semibold transition-all duration-200 hover:transform hover:-translate-y-0.5"
            >
              Generate Report
            </button>
          </div>
        </div>
        <div className="mt-10 bg-gradient-to-r from-[#1A2B6C] to-[#1e5ea5] border-white/10 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
          <p className="flex-1 text-white font-medium">
            <strong>10 property searches remaining</strong> — unlock unlimited
            AI insights, personalized outreach messages, and client-ready
            reports by upgrading today.
          </p>
          <a
            href="/pricing"
            className="bg-white text-[#0a2c53] hover:bg-gray-100 px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:transform hover:-translate-y-0.5 inline-block text-center"
          >
            Upgrade Plan
          </a>
        </div>
      </section>
    </div>
  );
};

export default PropertySearchPage;
