"use client";
import React, { useState, useRef, useEffect } from "react";
import { getApiUrl } from "../../../utils/apiConfig.js";
import {
  handleApiError,
  showErrorToUser,
} from "../../../utils/errorHandler.js";

const LeadRankingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [rankedLeads, setRankedLeads] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const fileInputRef = useRef(null);

  // Mobile-specific state
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Debug logging for rankedLeads state (can be removed in production)
  React.useEffect(() => {
    if (rankedLeads.length > 0) {
      console.log(`✅ ${rankedLeads.length} leads loaded successfully`);
    }
  }, [rankedLeads]);

  const steps = ["Upload List", "Ranking Progress", "Results"];

  // Interactive processing messages
  const processingMessages = [
    "🔄 Extracting leads from your file...",
    "🏠 Fetching property data for each address...",
    "🤖 AI scoring properties with 400+ indicators...",
    "📞 Validating phone numbers and activity...",
    "🎯 Generating personalized action plans...",
    "📊 Creating your ranked lead list...",
  ];

  // Effect to handle progressive loading messages with green highlight for the current step
  React.useEffect(() => {
    let intervalId;
    if (isProcessing && currentStep === 1) {
      let messageIndex = 0;
      setProcessingStep(messageIndex);
      setLoadingMessage(processingMessages[messageIndex]);

      // Total processing time: 40 seconds, 6 messages = ~6.66 seconds per message
      const totalTime = 40000; // 40 seconds in milliseconds
      const intervalTime = totalTime / processingMessages.length; // ~3.33 seconds per message

      intervalId = setInterval(() => {
        messageIndex += 1;
        if (messageIndex < processingMessages.length) {
          setProcessingStep(messageIndex);
          setLoadingMessage(processingMessages[messageIndex]);
        } else {
          clearInterval(intervalId);
          setProcessingStep(processingMessages.length - 1);
          setLoadingMessage(processingMessages[processingMessages.length - 1]);
        }
      }, intervalTime);
    }
    return () => clearInterval(intervalId);
  }, [isProcessing, currentStep]);

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type and size
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        alert("File size exceeds 100MB limit");
        return;
      }

      const allowedTypes = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a CSV, XLSX, or PDF file");
        return;
      }

      setUploadedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e) => {
    handleFileUpload(e.target.files);
  };

  const startRanking = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setCurrentStep(1);
    setProcessingStep(0);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 320000); // 320 second timeout (5 minutes)

      console.log("🚀 Starting lead ranking request...");
      console.log("📁 File details:", {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
      });

      // Get API URL from configuration
      const apiUrl = getApiUrl();
      console.log("🌐 Using API URL:", apiUrl);
      console.log(
        "🔐 Auth token:",
        localStorage.getItem("token") ? "Present" : "Missing"
      );
      console.log("🌍 Environment variables:", {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
      });

      const response = await fetch(`${apiUrl}/upload-lead-list`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
        headers: {
          // Don't set Content-Type for FormData, let browser set it
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Backend response:", result);

      if (result.status === "success") {
        // Set download URL from API response
        if (result.ranked_file) {
          setDownloadUrl(
            `${apiUrl}/download-file/${encodeURIComponent(result.ranked_file)}`
          );
        }

        // Parse the ranked leads from the result
        let leadsToDisplay = [];

        if (result.ranked_leads && result.ranked_leads.length > 0) {
          console.log(
            `📊 Processing ${result.ranked_leads.length} ranked leads from backend`
          );
          console.log("🔍 First lead data:", result.ranked_leads[0]);
          console.log(
            "🔍 First lead fields:",
            Object.keys(result.ranked_leads[0])
          );

          // Use the actual ranked leads data directly
          leadsToDisplay = result.ranked_leads.slice(0, 3);
          console.log(`🎯 Setting ${leadsToDisplay.length} leads to display`);
        } else {
          console.log("⚠️ No ranked leads in response");
          leadsToDisplay = [];
        }

        setRankedLeads(leadsToDisplay);
        setIsProcessing(false);
        setIsComplete(true);
        setCurrentStep(2);
      } else {
        throw new Error(result.message || "Processing failed");
      }
    } catch (error) {
      const errorResult = await handleApiError(error, {
        allowDemo: true,
        feature: "Lead Ranking",
      });

      if (errorResult.fallbackToDemo) {
        console.log("🎭 Falling back to demo mode with sample data");

        // Provide demo data for better user experience
        const demoLeads = [
          {
            rank: 1,
            name: "Demo Lead #1",
            email: "demo1@example.com",
            score: 9.2,
            phone_valid: true,
            full_address: "123 Demo St, Toronto, ON",
            action_plan: "High priority - Call immediately",
          },
          {
            rank: 2,
            name: "Demo Lead #2",
            email: "demo2@example.com",
            score: 8.4,
            phone_valid: true,
            full_address: "456 Sample Ave, Vancouver, BC",
            action_plan: "Send personalized email",
          },
          {
            rank: 3,
            name: "Demo Lead #3",
            email: "demo3@example.com",
            score: 7.1,
            phone_valid: false,
            full_address: "789 Example Rd, Calgary, AB",
            action_plan: "Follow up via LinkedIn",
          },
        ];

        setRankedLeads(demoLeads);
        setDownloadUrl("#"); // Demo download
        setIsDemoMode(true); // Mark as demo mode
        setIsProcessing(false);
        setIsComplete(true);
        setCurrentStep(2);
      } else {
        setIsProcessing(false);
      }

      // Show error message to user
      showErrorToUser(errorResult);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!downloadUrl) {
      alert(
        "No file available for download. Please complete the lead ranking process first."
      );
      return;
    }

    // Check if this is demo mode
    if (downloadUrl === "#" && rankedLeads.length > 0) {
      console.log("📄 Generating demo CSV file for download");

      // Create sample CSV content for demo
      const csvHeaders = [
        "Rank",
        "Name",
        "Email",
        "Score (0-10)",
        "Address",
        "Phone Validated",
        "Recommendation",
      ];
      const csvRows = rankedLeads.map((lead) => [
        lead.rank,
        `"${lead.name}"`, // Quote names in case they contain commas
        lead.email,
        lead.score,
        `"${
          lead.full_address ||
          lead.complete_address ||
          lead.Address ||
          lead.address ||
          "N/A"
        }"`, // Quote addresses in case they contain commas
        lead.phone_valid ? "Yes" : "No",
        `"${
          lead.recommendation ||
          lead.ai_recommendation ||
          lead.action_plan ||
          "Contact for details"
        }"`, // Quote recommendations in case they contain commas
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map((row) => row.join(","))
        .join("\n");

      // Add demo disclaimer at the top
      const fullCsvContent = `# PropMatch Lead Ranking Demo Results\n# Generated on: ${new Date().toLocaleDateString()}\n# Note: This is demo data for testing purposes\n\n${csvContent}`;

      // Create and download the file
      const blob = new Blob([fullCsvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `demo_ranked_leads_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return;
    }

    // Real API download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `ranked_leads_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAndUploadNew = () => {
    // Reset all state variables to initial values
    setCurrentStep(0);
    setIsProcessing(false);
    setIsComplete(false);
    setUploadedFile(null);
    setDragOver(false);
    setProcessingStep(0);
    setLoadingMessage("");
    setRankedLeads([]);
    setDownloadUrl(null);
    setIsDemoMode(false);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    console.log("🔄 Cleared all data, ready for new upload");
  };

  // Results view
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1
            className={`${
              isMobileView ? "text-xl" : "text-2xl"
            } font-semibold text-[#0e2b4f] mb-2`}
          >
            {isMobileView
              ? "🏆 Lead Ranking Results"
              : "CRM Lead Ranking Dashboard"}
          </h1>
          <p className={`text-gray-600 ${isMobileView ? "text-sm" : ""}`}>
            {isMobileView
              ? "Your highest-priority leads based on AI analysis"
              : "Identify high conversion leads and focus your efforts where they matter most."}
          </p>
        </div>

        {/* Step Indicator */}
        <div
          className={`flex mb-4 border-b-2 border-gray-200 ${
            isMobileView ? "text-sm" : ""
          }`}
        >
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex-1 text-center ${
                isMobileView ? "py-2" : "py-3"
              } font-medium border-b-4 ${
                index <= currentStep
                  ? "text-[#0e2b4f] border-[#0e2b4f]"
                  : "text-gray-400 border-transparent"
              }`}
            >
              {isMobileView && step === "Ranking Progress" ? "Progress" : step}
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div
          className={`bg-[#0e2b4f] rounded-xl ${
            isMobileView ? "p-4" : "p-6"
          } mb-6`}
        >
          <h3
            className={`${
              isMobileView ? "text-base" : "text-lg"
            } font-semibold text-white text-center mb-4`}
          >
            Proven Results
          </h3>
          <div
            className={`${
              isMobileView ? "flex flex-col gap-3" : "flex justify-center gap-6"
            }`}
          >
            <div
              className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg ${
                isMobileView ? "p-3" : "p-4"
              } text-center ${isMobileView ? "" : "flex-1 max-w-xs"}`}
            >
              <div
                className={`${
                  isMobileView ? "text-2xl" : "text-3xl"
                } font-bold text-white mb-2`}
              >
                $12K+
              </div>
              <div
                className={`${
                  isMobileView ? "text-xs" : "text-sm"
                } text-white/80`}
              >
                Avg Commission Increase
              </div>
            </div>
            <div
              className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg ${
                isMobileView ? "p-3" : "p-4"
              } text-center ${isMobileView ? "" : "flex-1 max-w-xs"}`}
            >
              <div
                className={`${
                  isMobileView ? "text-2xl" : "text-3xl"
                } font-bold text-white mb-2`}
              >
                3×
              </div>
              <div
                className={`${
                  isMobileView ? "text-xs" : "text-sm"
                } text-white/80`}
              >
                Faster Conversions
              </div>
            </div>
          </div>
        </div>

        {/* Demo Mode Alert */}
        {isDemoMode && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Demo Mode:</strong> Backend connection failed. Showing
                  sample data for demonstration purposes. The download will
                  provide a demo CSV file.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div
            className={`${isMobileView ? "p-4" : "p-6"} bg-gray-50 border-b`}
          >
            <h2
              className={`${
                isMobileView ? "text-lg" : "text-xl"
              } font-medium text-[#0e2b4f] mb-2`}
            >
              🏆 Top 3 Leads - Lead Ranking Results{" "}
              {isDemoMode && (
                <span className="text-sm font-normal text-blue-600">
                  (Demo)
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-600">
              Showing your highest-priority leads based on AI analysis
            </p>
          </div>
          <div className={`${isMobileView ? "p-4" : "p-6"}`}>
            <div
              className={`${
                isMobileView
                  ? "flex flex-col gap-3"
                  : "flex justify-between items-center"
              } mb-4`}
            >
              <div
                className={`flex items-center text-green-600 font-medium ${
                  isMobileView ? "text-sm" : ""
                }`}
              >
                <div className="mr-2">✅</div>
                {isMobileView
                  ? "Lead ranking completed - Top 3 leads"
                  : "Lead ranking completed - Showing top 3 leads (Download CSV for full ranked list)"}
              </div>
              <div className={`flex ${isMobileView ? "flex-col" : ""} gap-3`}>
                <button
                  onClick={handleDownload}
                  className={`text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDemoMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-[#0e2b4f] hover:bg-[#1c3c66]"
                  }`}
                >
                  {isDemoMode ? "Download Demo CSV" : "Download File"}
                </button>
                <button
                  onClick={handleClearAndUploadNew}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {isMobileView ? "Upload New List" : "Clear & Upload New List"}
                </button>
              </div>
            </div>

            {/* Debug Info - moved to useEffect to avoid hydration issues */}
            {/* Top Lead Callout */}
            {rankedLeads.length > 0 && (
              <div
                className={`bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg ${
                  isMobileView ? "p-3" : "p-4"
                } mb-4 ${
                  isMobileView
                    ? "flex flex-col gap-2"
                    : "flex justify-between items-center"
                }`}
              >
                <div className={isMobileView ? "text-center" : ""}>
                  <div
                    className={`font-semibold text-[#0e2b4f] ${
                      isMobileView ? "text-center mb-2" : ""
                    }`}
                  >
                    {rankedLeads[0]["Full Name"] ||
                      rankedLeads[0].name ||
                      rankedLeads[0].Name ||
                      rankedLeads[0].Owner ||
                      rankedLeads[0].owner ||
                      rankedLeads[0]["Client Name"] ||
                      "Lead #1"}
                  </div>
                  <div
                    className={`text-sm text-gray-600 ${
                      isMobileView ? "text-center" : ""
                    }`}
                  >
                    {isMobileView ? (
                      <>
                        <div>
                          Score:{" "}
                          {rankedLeads[0].likelihood_to_sell_score ||
                            rankedLeads[0].ai_score ||
                            rankedLeads[0].score ||
                            0}
                          /10
                        </div>
                        <div>
                          Phone:{" "}
                          {rankedLeads[0].phone_valid
                            ? "Verified"
                            : "Not Verified"}
                        </div>
                        <div>
                          Rank: #
                          {rankedLeads[0].rank || rankedLeads[0].ai_rank || 1}
                        </div>
                      </>
                    ) : (
                      <>
                        Score:{" "}
                        {rankedLeads[0].likelihood_to_sell_score ||
                          rankedLeads[0].ai_score ||
                          rankedLeads[0].score ||
                          0}
                        /10 | Phone:{" "}
                        {rankedLeads[0].phone_valid
                          ? "Verified"
                          : "Not Verified"}{" "}
                        | Rank: #
                        {rankedLeads[0].rank || rankedLeads[0].ai_rank || 1}
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={`bg-gradient-to-r from-green-500 to-green-600 text-white ${
                    isMobileView ? "px-4 py-2" : "px-3 py-1"
                  } rounded-full text-xs font-medium flex items-center ${
                    isMobileView ? "justify-center" : ""
                  }`}
                >
                  🏆 #1 Top Lead
                </div>
              </div>
            )}

            {/* Mobile Cards / Desktop Table */}
            {isMobileView ? (
              /* Mobile Cards */
              <div className="space-y-4 mb-4">
                {rankedLeads.length > 0 ? (
                  rankedLeads.slice(0, 3).map((lead, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#0e2b4f] text-white rounded-full flex items-center justify-center text-sm font-bold">
                            #{lead.rank || lead.ai_rank || index + 1}
                          </div>
                          <div className="font-semibold text-[#0e2b4f]">
                            {lead["Full Name"] ||
                              lead.name ||
                              lead.Name ||
                              lead.Owner ||
                              lead.owner ||
                              lead["Client Name"] ||
                              `Lead ${index + 1}`}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-[#0e2b4f] to-[#1c3c66] text-white px-3 py-1 rounded-full text-sm font-bold">
                          {lead.likelihood_to_sell_score ||
                            lead.ai_score ||
                            lead.score ||
                            0}
                          /10
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-medium">📧</span>
                          <span>{lead.Email || lead.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-medium">📍</span>
                          <span className="text-gray-700">
                            {lead.full_address ||
                              lead.complete_address ||
                              lead.Address ||
                              lead.address ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-medium">📞</span>
                          <span>
                            {lead.phone_valid
                              ? "✅ Verified"
                              : "❌ Not Verified"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-600 font-medium">💡</span>
                          <span
                            className={
                              !lead.phone_valid
                                ? "text-gray-500 italic"
                                : "text-gray-700"
                            }
                          >
                            {lead.recommendation ||
                              lead.ai_recommendation ||
                              lead.action_plan ||
                              "Contact for details"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 px-4 text-center text-gray-500">
                    No lead data available to display
                  </div>
                )}
              </div>
            ) : (
              /* Desktop Table */
              <div className="overflow-x-auto mb-4 -mx-3 md:mx-0">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        #
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Score (0‑10)
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Address
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Phone Validated
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Recommendation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedLeads.length > 0 ? (
                      rankedLeads.slice(0, 3).map((lead, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4 text-sm">
                            {lead.rank || lead.ai_rank || index + 1}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {lead["Full Name"] ||
                              lead.name ||
                              lead.Name ||
                              lead.Owner ||
                              lead.owner ||
                              lead["Client Name"] ||
                              `Lead ${index + 1}`}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {lead.Email || lead.email || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-[#0e2b4f]">
                            {lead.likelihood_to_sell_score ||
                              lead.ai_score ||
                              lead.score ||
                              0}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {lead.full_address ||
                              lead.complete_address ||
                              lead.Address ||
                              lead.address ||
                              "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {lead.phone_valid ? "✅ Yes" : "❌ No"}
                          </td>
                          <td
                            className={`py-3 px-4 text-sm ${
                              !lead.phone_valid ? "text-gray-500 italic" : ""
                            }`}
                          >
                            {lead.recommendation ||
                              lead.ai_recommendation ||
                              lead.action_plan ||
                              "Contact for details"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-8 px-4 text-center text-gray-500"
                        >
                          No lead data available to display
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Download PDF to unlock full list
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">📄 Download PDF to unlock full ranked list</h4>
                                        <p className="text-sm text-gray-600">Get access to all {rankedLeads.length} ranked leads with complete analysis</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleDownload}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download PDF
                                </button>
                            </div>
                        </div> */}

            {/* Upgrade Option */}
            <div
              className={`bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg ${
                isMobileView ? "p-3" : "p-4"
              } mb-4`}
            >
              <div
                className={`${
                  isMobileView
                    ? "flex flex-col gap-3 text-center"
                    : "flex items-center justify-between"
                }`}
              >
                <div
                  className={`flex items-center ${
                    isMobileView ? "justify-center" : ""
                  }`}
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className={isMobileView ? "text-center" : ""}>
                    <h4
                      className={`font-semibold text-gray-900 ${
                        isMobileView ? "text-sm" : ""
                      }`}
                    >
                      🚀 Need to process more leads?
                    </h4>
                    <p
                      className={`${
                        isMobileView ? "text-xs" : "text-sm"
                      } text-gray-600`}
                    >
                      Upgrade your plan to rank unlimited leads and unlock
                      advanced features
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.open("/pricing", "_blank")}
                  className={`bg-purple-500 hover:bg-purple-600 text-white ${
                    isMobileView ? "px-6 py-3 w-full" : "px-4 py-2"
                  } rounded-lg font-medium transition-colors flex items-center ${
                    isMobileView ? "justify-center" : ""
                  }`}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  Upgrade Plan
                </button>
              </div>
            </div>

            <div
              className={`bg-blue-50 border border-blue-200 rounded-lg ${
                isMobileView ? "p-2" : "p-3"
              } ${isMobileView ? "text-xs" : "text-sm"} text-blue-800`}
            >
              {isMobileView
                ? "Includes: scores, phone validation, pricing & action plans. More insights with upgraded plans."
                : "Ranked list includes: contact info, likelihood scores (0‑10), phone validation, 3‑tier pricing suggestions, and action plans. Additional insights available for upgraded plans."}
            </div>
          </div>
        </div>

        {/* Video Section */}
        {/* <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-[#0e2b4f] mb-3 text-center">How PropMatch AI Works</h3>
                        <div className="relative w-full h-0 pb-[40%] bg-black rounded-lg overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                                🎥 AI Demo Video
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 text-center mt-2">
                            See how PropMatch analyses your leads, calculates scores with 400+ indicators, and generates personalised action plans in seconds.
                        </p>
                    </div>
                </div> */}
      </div>
    );
  }

  // Processing view
  if (isProcessing) {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 p-3 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#0e2b4f] mb-2">
              Lead Ranking Dashboard
            </h1>
            <p className="text-gray-600">
              Identify high conversion leads and focus your efforts where they
              matter most.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex mb-4 border-b-2 border-gray-200">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex-1 text-center py-3 font-medium border-b-4 ${
                  index <= currentStep
                    ? "text-[#0e2b4f] border-[#0e2b4f]"
                    : "text-gray-400 border-transparent"
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Processing Section - Styled like the AI Processing example */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                AI Processing in Progress
              </h3>
              <p className="text-gray-600 mb-8">
                Analyzing property data and generating comprehensive insights...
              </p>

              {/* Processing Steps */}
              <div className="space-y-4 mb-8">
                {processingMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                      index < processingStep
                        ? "bg-green-50 border border-green-200"
                        : index === processingStep
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                        index < processingStep
                          ? "bg-green-500 text-white"
                          : index === processingStep
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {index < processingStep ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : index === processingStep ? (
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`font-medium transition-all duration-300 ${
                        index < processingStep
                          ? "text-green-700"
                          : index === processingStep
                          ? "text-blue-700"
                          : "text-gray-500"
                      }`}
                    >
                      {message.replace(/🔄|🏠|🤖|📞|🎯|📊/g, "").trim()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        ((processingStep + 1) / processingMessages.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Estimated Completion */}
              <div className="flex items-center justify-center text-sm text-gray-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Estimated completion: 60 seconds
              </div>
            </div>

            {/* Right Side - Processing Your Report */}
            <div className="bg-gray-50 p-8 border-t">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Processing Your Lead List
                </h4>
                <p className="text-sm text-gray-600">
                  Our AI is analyzing your property data and creating a
                  comprehensive professional report. This will appear here once
                  processing is complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Upload view (default)
  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <section className="mx-6 my-6 rounded-2xl bg-gradient-to-r from-[#0a2c53] to-[#1e5ea5] text-white relative overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch p-8 lg:p-12 gap-8">
            <div className="flex-1 lg:max-w-[55%] text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Know Who to Call First, Every Time
              </h1>
              <p className="text-lg font-medium mb-4 text-blue-100">
                Stop guessing which leads are worth your time.
              </p>
              <p className="text-base mb-7 text-blue-200 leading-relaxed">
                Our smart CRM Lead Ranking tool automatically scores and prioritizes your prospects based on engagement, property interests, and market behavior. Focus on the hottest opportunities and close deals faster — while our AI does the sorting for you.
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
                Rank My Leads Now
              </button>
            </div>
            <div className="flex-1 lg:w-[42%] min-h-[320px] rounded-2xl  relative flex flex-col overflow-hidden shadow-2xl">
              <video
                src="/video/video2.mp4"
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#0e2b4f] mb-2">
          Lead Ranking Dashboard
        </h1>
        <p className="text-gray-600">
          Identify high conversion leads and focus your efforts where they
          matter most.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex mb-6 border-b-2 border-gray-200">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex-1 text-center py-3 font-medium border-b-4 ${
              index <= currentStep
                ? "text-[#0e2b4f] border-[#0e2b4f]"
                : "text-gray-400 border-transparent"
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Live Tool Demo */}
      <div className="bg-gradient-to-r from-[#1A2B6C] to-[#1e5ea5]  border-2 border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white text-[#1A2B6C] px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            LIVE TOOL
          </div>
        </div>
        {/* <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">See PropMatch AI in Action</h3> */}

        {/* Upload Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-xl font-medium text-[#0e2b4f] mb-2">
              Import Your CRM Lead List
            </h2>
            <p className="text-gray-600 text-sm">
              Upload a CSV, XLSX, or PDF file to generate AI‑powered rankings
              and insights.
            </p>
          </div>
          <div className="p-6">
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-[#0e2b4f] bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={openFileDialog}
            >
              <div className="text-4xl mb-4">⬆️</div>
              <div className="text-gray-700 mb-2">
                {uploadedFile ? (
                  <div>
                    <div className="font-medium text-[#0e2b4f] mb-1">
                      {uploadedFile.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {uploadedFile.size < 1024
                        ? `${uploadedFile.size} bytes`
                        : uploadedFile.size < 1024 * 1024
                        ? `${(uploadedFile.size / 1024).toFixed(1)} KB`
                        : `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`}
                    </div>
                  </div>
                ) : (
                  <>
                    Drag & drop your file here or click to browse
                    <br />
                    <span className="text-sm text-gray-500">
                      Max 100 MB · CSV, XLSX, PDF
                    </span>
                  </>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            <button
              onClick={startRanking}
              disabled={!uploadedFile}
              className={`w-full mt-6 py-3 px-6 rounded-lg font-medium transition-colors ${
                uploadedFile
                  ? "bg-[#0e2b4f] text-white hover:bg-[#1c3c66]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Start Ranking
            </button>
          </div>
        </div>
      </div>

      {/* Benefits */}
      {/* <div className={`bg-[#0e2b4f] rounded-xl ${isMobileView ? 'p-4' : 'p-6'} mb-6`}>
                <h3 className={`${isMobileView ? 'text-base' : 'text-lg'} font-semibold text-white text-center mb-4`}>Proven Results</h3>
                <div className={`${isMobileView ? 'flex flex-col gap-3' : 'flex justify-center gap-6'}`}>
                    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg ${isMobileView ? 'p-3' : 'p-4'} text-center ${isMobileView ? '' : 'flex-1 max-w-xs'}`}>
                        <div className={`${isMobileView ? 'text-2xl' : 'text-3xl'} font-bold text-white mb-2`}>$12K+</div>
                        <div className={`${isMobileView ? 'text-xs' : 'text-sm'} text-white/80`}>Avg Commission Increase</div>
                    </div>
                    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg ${isMobileView ? 'p-3' : 'p-4'} text-center ${isMobileView ? '' : 'flex-1 max-w-xs'}`}>
                        <div className={`${isMobileView ? 'text-2xl' : 'text-3xl'} font-bold text-white mb-2`}>3×</div>
                        <div className={`${isMobileView ? 'text-xs' : 'text-sm'} text-white/80`}>Faster Conversions</div>
                    </div>
                </div>
            </div> */}

      {/* Included in Your AI-Powered Lead Report */}
      <div
        className={`bg-white rounded-lg border border-green-100 ${
          isMobileView ? "p-4" : "p-6"
        }`}
      >
        <h3
          className={`${
            isMobileView ? "text-lg" : "text-xl"
          } font-bold text-green-700 mb-5 flex items-center gap-2`}
        >
          <span>🚀</span>
          What's Inside Your Ranked CRM Lead List
        </h3>
        <ul className={`${isMobileView ? "space-y-3" : "space-y-4"}`}>
          <li className="flex items-start">
            <div
              className={`${isMobileView ? "text-lg" : "text-xl"} mr-4 mt-1`}
            >
              📈
            </div>
            <div>
              <div
                className={`font-medium ${
                  isMobileView ? "text-xs" : "text-sm"
                } text-gray-900 mb-1`}
              >
                Likelihood Score
              </div>
              <div
                className={`${
                  isMobileView ? "text-xs" : "text-xs"
                } text-gray-600`}
              >
                Analyses 400+ property & area indicators to calculate the
                probability of selling.
              </div>
            </div>
          </li>
          <li className="flex items-start">
            <div
              className={`${isMobileView ? "text-lg" : "text-xl"} mr-4 mt-1`}
            >
              💲
            </div>
            <div>
              <div
                className={`font-medium ${
                  isMobileView ? "text-xs" : "text-sm"
                } text-gray-900 mb-1`}
              >
                3‑Tier Pricing
              </div>
              <div
                className={`${
                  isMobileView ? "text-xs" : "text-xs"
                } text-gray-600`}
              >
                Suggests low, mid and high listing prices based on real‑time
                market data.
              </div>
            </div>
          </li>
          <li className="flex items-start">
            <div
              className={`${isMobileView ? "text-lg" : "text-xl"} mr-4 mt-1`}
            >
              📞
            </div>
            <div>
              <div
                className={`font-medium ${
                  isMobileView ? "text-xs" : "text-sm"
                } text-gray-900 mb-1`}
              >
                Phone Validation
              </div>
              <div
                className={`${
                  isMobileView ? "text-xs" : "text-xs"
                } text-gray-600`}
              >
                Displays phone status and recent homeowner activity for verified
                outreach.
              </div>
            </div>
          </li>
          <li className="flex items-start">
            <div
              className={`${isMobileView ? "text-lg" : "text-xl"} mr-4 mt-1`}
            >
              🧠
            </div>
            <div>
              <div
                className={`font-medium ${
                  isMobileView ? "text-xs" : "text-sm"
                } text-gray-900 mb-1`}
              >
                Action Plan
              </div>
              <div
                className={`${
                  isMobileView ? "text-xs" : "text-xs"
                } text-gray-600`}
              >
                Recommends best next steps to convert each lead—call, email, or
                SMS.
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* Trial Callout - Moved to End */}
      <div
        className={`bg-yellow-50 border border-yellow-200 rounded-lg ${
          isMobileView ? "p-3" : "p-4"
        } mt-6 ${
          isMobileView
            ? "flex flex-col gap-3 text-center"
            : "flex justify-between items-center"
        }`}
      >
        <div
          className={`${isMobileView ? "text-xs" : "text-sm"} text-yellow-800`}
        >
          <strong>Trial Plan:</strong>{" "}
          {isMobileView
            ? "Up to 15 leads per upload. Shows top 3 leads. Download CSV for full list."
            : "Processes up to 15 leads per upload. Results show top 3 leads. Download CSV for full ranked list."}
        </div>
        <a
          href="/pricing"
          className={`bg-[#0e2b4f] text-white ${
            isMobileView ? "px-6 py-3 w-full" : "px-4 py-2"
          } rounded-lg text-sm font-medium hover:bg-[#1c3c66] transition-colors inline-block ${
            isMobileView ? "text-center" : ""
          }`}
        >
          Upgrade Plan
        </a>
      </div>
    </div>
  );
};

export default LeadRankingPage;
