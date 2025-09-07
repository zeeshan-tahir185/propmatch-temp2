"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoCopyOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import {
  FaCheck,
  FaBrain,
  FaMobile,
  FaHandshake,
  FaEnvelope,
  FaArrowLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { useAddress } from "@/app/context/AddressContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getApiUrl, apiLogger } from "@/app/utils/apiConfig";

const OutreachMessagesPage = () => {
  const { addressData, searchHistory, updateAddressData } = useAddress();
  const { user } = useAuth();
  const router = useRouter();
  const [hasPropertyData, setHasPropertyData] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [messages, setMessages] = useState({
    text: "",
    pitch: "",
    email: "",
  });
  const [isCopied, setIsCopied] = useState({
    text: false,
    pitch: false,
    email: false,
  });
  const [expandedCard, setExpandedCard] = useState(null);
  // Use queryId from context instead of hardcoded value
  const queryId = addressData.queryId;

  // Check for property data from context
  useEffect(() => {
    const hasData =
      addressData.confirmedAddress &&
      addressData.propertyData &&
      addressData.scoreData;
    setHasPropertyData(hasData);
  }, [addressData]);

  const selectFromHistory = (historyItem) => {
    updateAddressData({
      confirmedAddress: historyItem.address,
      propertyData: historyItem.propertyData,
      scoreData: historyItem.scoreData,
    });
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setIsCopied((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const generateMessages = async () => {
    if (!queryId) {
      console.error(
        "❌ No queryId available. Please complete property search first."
      );
      return;
    }

    setIsGenerating(true);

    console.log("🤖 Starting AI message generation...");
    console.log("🆔 Query ID:", queryId);
    console.log("🏠 Property ID:", addressData.propertyId);
    console.log("👤 User ID:", user?.user_id || user?.id);
    console.log("📍 Property:", addressData.confirmedAddress);

    try {
      const apiUrl = getApiUrl();
      const requestData = {
        query_id: queryId,
        property_id: addressData.propertyId,
        user_id: user?.user_id || user?.id,
      };

      apiLogger.request("POST", `${apiUrl}/generate-ai-messages`, requestData);

      const response = await axios.post(
        `${apiUrl}/generate-ai-messages`,
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
        console.error("❌ Error generating messages:", response.data.error);
      } else {
        console.log("✅ AI messages generated successfully");
        setMessages({
          text:
            response.data.personalized_text_message ||
            "Message generation failed - please try again",
          pitch:
            response.data.detailed_sales_pitch ||
            "Pitch generation failed - please try again",
          email:
            response.data.lead_generation_email ||
            "Email generation failed - please try again",
        });
        setIsGenerated(true);
      }
    } catch (err) {
      console.error("❌ Failed to generate messages:", err);
      apiLogger.error("AI message generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Before Generation State
  if (!isGenerated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Back Button */}
        {addressData.confirmedAddress && (
          <div className="mx-6 mt-6 mb-2 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/property-search")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft />
                Back to Property Search
              </button>
              <div className="text-sm text-gray-500">|</div>
              <div className="text-sm font-medium text-gray-700">
                Current Property: {addressData.confirmedAddress}
              </div>
            </div>
          </div>
        )}
        {/* Hero Section */}
        <section className="mx-6 my-6 rounded-2xl bg-gradient-to-r from-[#0a2c53] to-[#1e5ea5] text-white relative overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch p-8 lg:p-12 gap-8">
            <div className="flex-1 lg:max-w-[55%] text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Never Wonder What to Say Again
              </h1>
              <p className="text-lg font-medium mb-4 text-blue-100">
                AI Does the Heavy Lifting — You Do the Talking
              </p>
              <p className="text-base mb-7 text-blue-200 leading-relaxed">
                Transform cold leads into warm conversations with AI-crafted
                messages that establish you as the go-to real estate expert. Our
                advanced AI analyzes 400+ property indicators, neighborhood
                trends, and market data to create personalized outreach that
                gets responses.
              </p>
              <button
                onClick={() => {
                  // Scroll to generator section
                  const generatorSection = document.getElementById("generator");
                  if (generatorSection) {
                    generatorSection.scrollIntoView({ behavior: "smooth" });
                  }
                  // Auto-trigger message generation if property data is available
                  if (addressData.confirmedAddress && queryId) {
                    setTimeout(() => {
                      generateMessages();
                    }, 800); // Small delay to allow scroll to complete
                  }
                }}
                className="inline-block bg-white text-[#0a2c53] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 hover:transform hover:-translate-y-1 shadow-lg"
              >
                Generate Messages Now
              </button>
            </div>
            <div className="flex-1 lg:w-[42%] min-h-[320px] rounded-2xl  relative flex flex-col overflow-hidden shadow-2xl">
              {/* <div className="bg-[#0d3c75] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaBrain />
                  <span>AI Message Preview</span>
                </div>
                <span className="text-xs">Live Demo</span>
              </div>
              <div className="flex bg-gray-100">
                <div className="flex-1 py-2 px-4 text-xs font-medium text-center text-[#0d3c75] bg-white border-b-2 border-[#0d3c75]">
                  Text Message
                </div>
                <div className="flex-1 py-2 px-4 text-xs font-medium text-center text-gray-600">
                  Sales Pitch
                </div>
                <div className="flex-1 py-2 px-4 text-xs font-medium text-center text-gray-600">
                  Email
                </div>
              </div>
              <div className="flex-1 p-5 bg-white text-gray-800">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>To: Sarah Johnson</span>
                    <span>159 characters</span>
                  </div>
                  <div className="text-sm leading-relaxed">
                    Hi Sarah! I noticed 7 Kenrae Road is perfectly positioned in
                    a hot market. With properties like yours selling in ~31
                    days, now's an excellent time to capture top dollar. As
                    Toronto's most trusted realtor, I can ensure you get the
                    best deal. Quick chat about the opportunity?
                  </div>
                </div>
                <div className="text-center text-xs text-gray-600">
                  <FaCheck className="inline text-green-500 mr-1" />
                  Personalized with property insights • 87% response rate
                </div>
              </div> */}
              <video
                src="/video/video3.mp4"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* INTERACTIVE TOOL SECTION - Message Generator */}
        <section
          id="generator"
          className="mx-6 my-8 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl shadow-lg overflow-hidden relative"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

          <div className="bg-gradient-to-r from-[#1A2B6C] to-[#1e5ea5] p-8 text-center border-b border-green-200 relative z-10">
            <div className="inline-flex items-center gap-3 bg-white text-[#0a2c53] px-6 py-2 rounded-full text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-[#0a2c53] rounded-full animate-pulse"></span>
              LIVE AI MESSAGE GENERATOR
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              AI Message Generator
            </h2>
            <p className="text-white">
              Create personalized outreach messages that establish your
              expertise and convert leads faster than ever.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Input Section */}
            <div className="flex-1 p-10 lg:border-r border-gray-200 bg-[#203381]">
              {!hasPropertyData && searchHistory.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-10">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-[#0a2c53] mb-5">
                    <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    Select from Recent Searches
                  </h3>
                  <div className="space-y-3">
                    {searchHistory.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => selectFromHistory(item)}
                        className="w-full text-left p-3 bg-white border border-yellow-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
                      >
                        <div className="font-medium text-[#0a2c53]">
                          {item.address}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(item.timestamp).toLocaleDateString()} -
                          {item.scoreData
                            ? ` Score: ${item.scoreData}/10`
                            : " Analyzed"}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => router.push("/dashboard/property-search")}
                      className="text-[#1e5ea5] hover:text-[#0a2c53] font-medium"
                    >
                      Or search for a new property →
                    </button>
                  </div>
                </div>
              )}

              {!hasPropertyData && searchHistory.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-10 text-center">
                  <h3 className="text-xl font-bold text-[#0a2c53] mb-3">
                    No Property Selected
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Search for a property first to generate personalized
                    outreach messages.
                  </p>
                  <button
                    onClick={() => router.push("/dashboard/property-search")}
                    className="bg-[#1A2B6C] text-white px-6 py-3 rounded-lg hover:bg-[#0a2c53] transition-colors"
                  >
                    Search Properties
                  </button>
                </div>
              )}
              {/* Property Summary */}
              {hasPropertyData && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-10">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-[#0a2c53] mb-5">
                    <div className="w-6 h-6 bg-[#1e5ea5] rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    Property Analysis Complete
                  </h3>
                  <div className="text-lg font-semibold text-[#0a2c53] mb-3">
                    {addressData.confirmedAddress}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong className="text-[#0a2c53]">Seller Score:</strong>
                      {typeof addressData.scoreData?.predicted_score ===
                      "number"
                        ? addressData.scoreData.predicted_score.toFixed(1)
                        : "N/A"}
                      /10
                    </div>
                    <div>
                      <strong className="text-[#0a2c53]">Listing Price:</strong>
                      {addressData.propertyData?.property_details?.listing_price
                        ? `$${Number(
                            addressData.propertyData.property_details
                              .listing_price
                          ).toLocaleString()}`
                        : addressData.scoreData?.listing_prices
                            ?.market_pace_6_months
                        ? `$${Number(
                            addressData.scoreData.listing_prices
                              .market_pace_6_months
                          ).toLocaleString()}`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              )}

              {hasPropertyData && (
                <button
                  onClick={generateMessages}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-[#0d3c75] to-[#1e5ea5] text-white p-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating AI Messages...
                    </>
                  ) : (
                    <>
                      <FaBrain />
                      Generate AI Messages
                    </>
                  )}
                </button>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-sm text-yellow-800 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
                  </div>
                  Generate three message types based on your property analysis -
                  each optimized for maximum response rates and conversion.
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="flex-1 bg-gray-50 p-10 flex flex-col">
              <div className="bg-white border border-gray-200 rounded-lg flex-1 flex flex-col overflow-hidden shadow-sm">
                <div className="bg-[#0d3c75] text-white p-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Generated Messages</h3>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-gray-500">
                  <div className="text-5xl mb-4">📄</div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    AI Messages Ready to Generate
                  </h4>
                  <p className="text-sm leading-relaxed max-w-xs">
                    Click "Generate AI Messages" to create personalized outreach
                    content that converts leads faster than ever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Stats Cards - From Images */}

        {/* Why Realtors Love - Clickable Dropdown Cards */}
        {/* <section className="mx-6 my-6 p-10 bg-gradient-to-r from-[#1A2B6C] to-[#1e5ea5] rounded-xl shadow-sm border border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Realtors Love Our AI Outreach
            </h2>
            <p className="text-white max-w-2xl mx-auto">
              See how AI-powered messaging transforms your prospecting approach
              with data-driven insights and proven results
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={() =>
                  setExpandedCard(expandedCard === "ai" ? null : "ai")
                }
              >
                <div className="w-12 h-12 bg-[#1A2B6C] rounded-full flex items-center justify-center flex-shrink-0">
                  <FaBrain className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#0a2c53]">
                      Advanced AI Reasoning
                    </h3>
                    <FaChevronRight
                      className={`text-gray-400 transition-transform duration-200 ${
                        expandedCard === "ai" ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
              {expandedCard === "ai" && (
                <div className="mt-4 pl-16 animate-in slide-in-from-top-2 duration-300">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>
                        Processes MLS trends and neighbourhood statistics
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>
                        Analyzes in-depth property details for insights
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Crafts messages that resonate with homeowners</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Establishes your expertise automatically</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={() =>
                  setExpandedCard(
                    expandedCard === "precision" ? null : "precision"
                  )
                }
              >
                <div className="w-12 h-12 bg-[#1A2B6C] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-white text-2xl">🎯</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#0a2c53]">
                      Precision Personalization
                    </h3>
                    <FaChevronRight
                      className={`text-gray-400 transition-transform duration-200 ${
                        expandedCard === "precision" ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
              {expandedCard === "precision" && (
                <div className="mt-4 pl-16 animate-in slide-in-from-top-2 duration-300">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Tailored to specific property insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Adapts to current market conditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Uses homeowner psychology principles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Maximizes engagement and response rates</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={() =>
                  setExpandedCard(expandedCard === "convert" ? null : "convert")
                }
              >
                <div className="w-12 h-12 bg-[#1A2B6C] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-white text-2xl">🚀</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#0a2c53]">
                      Convert Dead Leads
                    </h3>
                    <FaChevronRight
                      className={`text-gray-400 transition-transform duration-200 ${
                        expandedCard === "convert" ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
              {expandedCard === "convert" && (
                <div className="mt-4 pl-16 animate-in slide-in-from-top-2 duration-300">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Revives dormant prospects effectively</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Uses compelling, data-backed messaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Reignites interest with market insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1e5ea5] mt-1">•</span>
                      <span>Positions you as the knowledgeable expert</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section> */}
      </div>
    );
  }

  // After Generation State
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      {addressData.confirmedAddress && (
        <div className="mx-6 mt-6 mb-2 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/property-search")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft />
              Back to Property Search
            </button>
            <div className="text-sm text-gray-500">|</div>
            <div className="text-sm font-medium text-gray-700">
              Current Property: {addressData.confirmedAddress}
            </div>
          </div>
        </div>
      )}
      {/* INTERACTIVE TOOL SECTION - Generated Messages */}
      <section className="mx-6 my-8 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl shadow-lg overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-8 text-center border-b border-green-200 relative z-10">
          <div className="inline-flex items-center gap-3 bg-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            MESSAGES GENERATED
          </div>
          <h2 className="text-2xl font-bold text-[#0a2c53] mb-2">
            AI-Generated Outreach Messages
          </h2>
          <p className="text-gray-600">
            Your personalized messages are ready to use. Each message is crafted
            with property insights and market intelligence.
          </p>
        </div>

        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 p-5 m-6 rounded-lg text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaCheck className="text-green-500 text-lg" />
            <span className="text-lg font-semibold text-green-800">
              Messages Ready
            </span>
          </div>
          <div className="text-sm text-green-700 leading-relaxed">
            <strong>Next Steps:</strong> Review each message type below → Copy
            your preferred message → Use immediately in your outreach campaigns
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[600px]">
          {/* Input Section */}
          <div className="flex-1 p-4 lg:p-10 lg:border-r border-gray-200">
            {/* Property Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
              <h3 className="flex items-center gap-3 text-xl font-bold text-[#0a2c53] mb-5">
                <div className="w-6 h-6 bg-[#1e5ea5] rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded"></div>
                </div>
                Property Analysis Complete
              </h3>
              <div className="text-lg font-semibold text-[#0a2c53] mb-3">
                {addressData.confirmedAddress}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <strong className="text-[#0a2c53]">Seller Score:</strong>{" "}
                  {addressData.scoreData?.predicted_score
                    ? Math.round(addressData.scoreData.predicted_score)
                    : "N/A"}
                  /10
                </div>
                <div>
                  <strong className="text-[#0a2c53]">Listing Price:</strong>{" "}
                  {addressData.propertyData?.property_details?.listing_price
                    ? `$${Number(
                        addressData.propertyData.property_details.listing_price
                      ).toLocaleString()}`
                    : addressData.scoreData?.listing_prices
                        ?.market_pace_6_months
                    ? `$${Number(
                        addressData.scoreData.listing_prices
                          .market_pace_6_months
                      ).toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>

            <button className="w-full bg-green-500 text-white p-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 mb-6 cursor-default">
              <FaCheck />
              Messages Generated Successfully
            </button>

            {/* Success Notification */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <FaCheck className="text-green-500 text-xl" />
                <div>
                  <div className="font-semibold text-green-800">
                    3 personalized messages generated
                  </div>
                  <div className="text-sm text-green-700">
                    in 2.3 seconds using advanced AI reasoning
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-lg">✨</div>
                <span className="font-medium text-yellow-800">
                  Want Different Messages?
                </span>
              </div>
              <p className="text-sm text-yellow-700 mb-4">
                Generate alternative messages with different tones and
                approaches for the same property.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-yellow-700">
                <div className="w-4 h-4 border-2 border-yellow-600 rounded-full animate-spin"></div>
                Generate New Variations
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex-1 bg-gray-50 p-4 lg:p-10 flex flex-col">
            <div className="bg-white border border-gray-200 rounded-lg flex-1 flex flex-col overflow-hidden shadow-sm">
              <div className="bg-[#0d3c75] text-white p-4 lg:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0">
                <h3 className="text-lg font-semibold">Generated Messages</h3>
                <div className="flex items-center gap-2 text-green-300 text-sm lg:text-base">
                  <FaCheck />
                  <span>Ready to use</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-100 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium text-center relative whitespace-nowrap ${
                    activeTab === "text"
                      ? "text-[#0d3c75] bg-white border-b-2 border-[#0d3c75]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="hidden lg:inline">Text Message</span>
                  <span className="lg:hidden">Text</span>
                  <span className="absolute top-1 right-1 lg:right-2 bg-green-500 text-white text-xs px-1 lg:px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("pitch")}
                  className={`flex-1 py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium text-center relative whitespace-nowrap ${
                    activeTab === "pitch"
                      ? "text-[#0d3c75] bg-white border-b-2 border-[#0d3c75]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="hidden lg:inline">Sales Pitch</span>
                  <span className="lg:hidden">Pitch</span>
                  <span className="absolute top-1 right-1 lg:right-2 bg-green-500 text-white text-xs px-1 lg:px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("email")}
                  className={`flex-1 py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium text-center relative whitespace-nowrap ${
                    activeTab === "email"
                      ? "text-[#0d3c75] bg-white border-b-2 border-[#0d3c75]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="hidden lg:inline">Professional Email</span>
                  <span className="lg:hidden">Email</span>
                  <span className="absolute top-1 right-1 lg:right-2 bg-green-500 text-white text-xs px-1 lg:px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
                {/* Text Message */}
                {activeTab === "text" && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 pb-3 border-b border-gray-200 gap-2 lg:gap-0">
                      <div className="flex items-center gap-2 text-[#1e5ea5] font-semibold text-sm">
                        <FaMobile />
                        Text Message (SMS)
                      </div>
                      <div className="flex items-center gap-3 lg:gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="hidden sm:inline">159 chars</span>
                          <span className="sm:hidden">159c</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="hidden sm:inline">
                            87% response rate
                          </span>
                          <span className="sm:hidden">87%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-800 mb-4 leading-relaxed">
                      {messages.text}
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#0a2c53] mb-2">
                        <FaBrain />
                        AI Insights
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Uses specific property data (69 days, $1.01M price)
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Creates urgency with "hottest market" positioning
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Establishes expertise with "local expert" credibility
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Ends with low-pressure conversation starter
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => copyToClipboard(messages.text, "text")}
                        className="flex-1 bg-[#0d3c75] hover:bg-[#1c3c66] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors min-h-[48px] touch-manipulation"
                      >
                        {isCopied.text ? (
                          <>
                            <FaCheck />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <IoCopyOutline />
                            <span className="hidden sm:inline">
                              Copy Message
                            </span>
                            <span className="sm:hidden">Copy</span>
                          </>
                        )}
                      </button>
                      {/* <button className="flex-1 bg-white border border-[#0d3c75] text-[#0d3c75] hover:bg-blue-50 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                                <div>📱</div>
                                                Send via SMS
                                            </button> */}
                    </div>
                  </div>
                )}

                {/* Sales Pitch */}
                {activeTab === "pitch" && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 pb-3 border-b border-gray-200 gap-2 lg:gap-0">
                      <div className="flex items-center gap-2 text-[#1e5ea5] font-semibold text-sm">
                        <FaHandshake />
                        Sales Pitch
                      </div>
                      <div className="flex items-center gap-3 lg:gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="hidden sm:inline">45 seconds</span>
                          <span className="sm:hidden">45s</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="hidden sm:inline">
                            73% conversion rate
                          </span>
                          <span className="sm:hidden">73%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-800 mb-4 leading-relaxed whitespace-pre-line">
                      {messages.pitch}
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#0a2c53] mb-2">
                        <FaBrain />
                        AI Insights
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Structured AIDA format (Attention, Interest, Desire,
                          Action)
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Specific metrics create credibility (40% faster,
                          $644/sqft)
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Social proof with client success stories (47
                          homeowners, 8% above asking)
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Low-commitment ask (15-minute conversation)
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => copyToClipboard(messages.pitch, "pitch")}
                        className="flex-1 bg-[#0d3c75] hover:bg-[#1c3c66] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors min-h-[48px] touch-manipulation"
                      >
                        {isCopied.pitch ? (
                          <>
                            <FaCheck />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <IoCopyOutline />
                            <span className="hidden sm:inline">Copy Pitch</span>
                            <span className="sm:hidden">Copy</span>
                          </>
                        )}
                      </button>
                      {/* <button className="flex-1 bg-white border border-[#0d3c75] text-[#0d3c75] hover:bg-blue-50 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                                <div>📞</div>
                                                Practice Mode
                                            </button> */}
                    </div>
                  </div>
                )}

                {/* Email */}
                {activeTab === "email" && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 pb-3 border-b border-gray-200 gap-2 lg:gap-0">
                      <div className="flex items-center gap-2 text-[#1e5ea5] font-semibold text-sm">
                        <FaEnvelope />
                        Professional Email
                      </div>
                      <div className="flex items-center gap-3 lg:gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="hidden sm:inline">247 words</span>
                          <span className="sm:hidden">247w</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="hidden sm:inline">
                            56% open rate
                          </span>
                          <span className="sm:hidden">56%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-800 mb-4 leading-relaxed whitespace-pre-line">
                      {messages.email}
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#0a2c53] mb-2">
                        <FaBrain />
                        AI Insights
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Professional tone with personalized property data
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Bullet points make key information scannable
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Social proof and credentials build trust
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Clear value proposition with free market analysis
                          offer
                        </li>
                        <li className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-xs mt-0.5" />
                          Professional signature with multiple contact options
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => copyToClipboard(messages.email, "email")}
                        className="flex-1 bg-[#0d3c75] hover:bg-[#1c3c66] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors min-h-[48px] touch-manipulation"
                      >
                        {isCopied.email ? (
                          <>
                            <FaCheck />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <IoCopyOutline />
                            <span className="hidden sm:inline">Copy Email</span>
                            <span className="sm:hidden">Copy</span>
                          </>
                        )}
                      </button>
                      {/* <button className="flex-1 bg-white border border-[#0d3c75] text-[#0d3c75] hover:bg-blue-50 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                                <div>✈️</div>
                                                Send Email
                                            </button> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Plan Limit Warning */}
      <div className="mx-6 mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <p className="flex-1 text-yellow-800 font-medium">
          <strong>10 message generations remaining</strong> — unlock unlimited
          AI outreach messages, personalized property reports, and advanced
          features by upgrading today.
        </p>
        <a
          href="/pricing"
          className="bg-yellow-700 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:transform hover:-translate-y-0.5 inline-block text-center"
        >
          Upgrade Plan
        </a>
      </div>
    </div>
  );
};

export default OutreachMessagesPage;
