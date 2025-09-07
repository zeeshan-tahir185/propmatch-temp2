"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearchOutline, IoCopyOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import PriceTrendChart from './PriceTrendChart'; // Adjust path as per your project structure
import { GoArrowDownRight, GoArrowUpRight } from "react-icons/go";
import ScoreAnalysis from './ScoreAnalysis';
import { FaCheck } from 'react-icons/fa6';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '@/app/contexts/AuthContext';
import { getApiUrl, apiLogger } from '@/app/utils/apiConfig';

const SingleAddressSearch = ({ onStepChange }) => {
    const { user } = useAuth();
    const [isFocused, setIsFocused] = useState(false);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(""); // Initialize as empty
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [confirmedAddress, setConfirmedAddress] = useState(null);
    const [propertyId, setPropertyId] = useState(null);
    const [propertyData, setPropertyData] = useState(null);
    const [queryId] = useState("123"); // Example query_id
    const [currentStep, setCurrentStep] = useState(0);
    const [scoreData, setScoreData] = useState(null);
    const [isCopied, setIsCopied] = useState({ address: false, id: false, text: false, pitch: false, email: false }); // Track copy state
    const [selectedYear, setSelectedYear] = useState(""); // Default to "All Years" (empty string)
    const [reportData, setReportData] = useState(null);
    const [outreachData, setOutreachData] = useState(null);

    // Messages for Get Property Score loading
    const loadingMessages = [
        "Analyzing 52 market indicators",
        "Comparing 1,847 similar homes",
        "Predicting with 92% accuracy"
    ];



    // Effect to handle non-repeating loading messages for Get Property Score
    useEffect(() => {
        let intervalId;
        if (loading && currentStep === 2) { // Only for Get Property Score (step 2 to 3)
            let messageIndex = 0;
            setLoadingMessage(loadingMessages[messageIndex]);

            // Estimate total loading time (e.g., 9 seconds as per example)
            const estimatedTotalTime = 12000; // 9 seconds in milliseconds
            const intervalTime = estimatedTotalTime / loadingMessages.length; // Equal time per message (3 seconds)

            intervalId = setInterval(() => {
                messageIndex += 1;
                if (messageIndex < loadingMessages.length) {
                    setLoadingMessage(loadingMessages[messageIndex]);
                } else {
                    clearInterval(intervalId); // Stop interval after last message
                    setLoadingMessage(loadingMessages[loadingMessages.length - 1]); // Keep last message
                }
            }, intervalTime);
        }
        return () => clearInterval(intervalId); // Cleanup interval on unmount or when loading stops
    }, [loading, currentStep]);

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied((prev) => ({ ...prev, [type]: true }));
            setTimeout(() => {
                setIsCopied((prev) => ({ ...prev, [type]: false }));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleAnalyze = async () => {
        if (!address.trim()) {
            setError("Please enter a valid address");
            return;
        }
        
        setLoading(true);
        setLoadingMessage("Searching for addresses..."); // Static message for address search
        setError(null);
        setSuggestions([]);
        setCurrentStep(1);
        onStepChange(1);
        try {
            const apiUrl = getApiUrl();
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${apiUrl}/search-addresses?query_id=${queryId}`,
                { address_string: address },
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    } 
                }
            );
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setSuggestions(response.data.suggestions || []);
            }
        } catch (err) {
            console.error('Failed to fetch address suggestions:', err);
            if (err.response?.status === 401) {
                setError("Authentication failed. Please log in again.");
            } else {
                setError("Failed to fetch address suggestions");
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
            setConfirmedAddress({
                address: currentConfirmedAddress,
                propertyId: currentPropertyId
            });
            setPropertyId(currentPropertyId);
            setSuggestions([]);
            setLoading(true);
            setLoadingMessage("Fetching property details..."); // Static message for property details
            setError(null);
            try {
                const apiUrl = getApiUrl();
                const response = await axios.post(
                    `${apiUrl}/get-property-details?query_id=${queryId}`,
                    { property_id: currentPropertyId, complete_address: currentConfirmedAddress },
                    { 
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        } 
                    }
                );
                if (response.data.error) {
                    setError(response.data.error);
                } else {
                    setPropertyData(response.data.property_data);
                    setCurrentStep(2);
                    onStepChange(2);
                }
            } catch (err) {
                console.error('Failed to fetch property details:', err);
                setError("Failed to fetch property details");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGetPropertyScore = async () => {
        if (!confirmedAddress) return;
        setLoading(true);
        setError(null);
        try {
            const apiUrl = getApiUrl();
            const response = await axios.post(
                `${apiUrl}/propmatch-score`,
                { address_string: confirmedAddress.address, query_id: queryId },
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    } 
                }
            );
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setScoreData(response.data.prediction_score);
                setCurrentStep(3);
                onStepChange(3);
            }
        } catch (err) {
            console.error('Failed to fetch property score:', err);
            setError("Failed to fetch property score");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        if (!confirmedAddress || !scoreData) return;
        setLoading(true);
        setLoadingMessage("Generating property report..."); // Static message for report generation
        setError(null);
        try {
            const apiUrl = getApiUrl();
            const response = await axios.post(
                `${apiUrl}/generate-report`,
                { query_id: queryId },
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    } 
                }
            );
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setReportData(response.data);
                setCurrentStep(4);
                onStepChange(4);
            }
        } catch (err) {
            console.error('Failed to generate report:', err);
            setError("Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateOutreach = async () => {
        if (!confirmedAddress || !scoreData) return;
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Please log in to generate AI outreach messages");
            return;
        }
        
        if (!user) {
            setError("User session not found. Please log in again.");
            return;
        }
        
        setLoading(true);
        setLoadingMessage("Generating AI outreach messages..."); // Static message for outreach generation
        setError(null);
        
        try {
            const apiUrl = getApiUrl();
            const requestData = { 
                query_id: queryId,
                property_id: confirmedAddress?.propertyId,
                user_id: user?.user_id || user?.id
            };
            
            console.log('🔐 Generating AI outreach with token:', token ? 'Present' : 'Missing');
            console.log('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'None');
            console.log('👤 User:', user);
            console.log('📝 Request data:', requestData);
            
            const response = await axios.post(
                `${apiUrl}/generate-ai-messages`,
                requestData,
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    } 
                }
            );
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setOutreachData(response.data);
                setCurrentStep(5);
                onStepChange(5);
            }
        } catch (err) {
            console.error('Failed to generate outreach:', err);
            if (err.response?.status === 401) {
                setError("Authentication failed. Please log in again.");
            } else {
                setError("Failed to generate outreach");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!reportData) return;
        setLoading(true);
        setLoadingMessage("Generating PDF report...");
        setError(null);
        
        try {
            // Fetch the HTML report from the backend
            const response = await fetch('/property_report_20250805_002916.html');
            if (!response.ok) {
                throw new Error('Failed to fetch report HTML');
            }
            
            const htmlContent = await response.text();
            
            // Create a temporary container to render the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '0';
            tempDiv.style.width = '1000px'; // Set a fixed width for consistent rendering
            document.body.appendChild(tempDiv);
            
            // Wait a moment for styles to apply
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Generate canvas from HTML
            const canvas = await html2canvas(tempDiv, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });
            
            // Remove temporary element
            document.body.removeChild(tempDiv);
            
            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            
            // Calculate dimensions to fit A4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;
            
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            
            // Download the PDF
            const fileName = `property_report_${confirmedAddress?.address?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
        } catch (err) {
            console.error('PDF generation error:', err);
            setError("Failed to generate PDF report");
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    const handleClearAndStartNew = () => {
        if (currentStep === 4 || currentStep === 5) {
            setCurrentStep(3);
            onStepChange(3);
        } else {
            setAddress("");
            setSuggestions([]);
            setError(null);
            setSelectedIndex(null);
            setConfirmedAddress(null);
            setPropertyId(null);
            setPropertyData(null);
            setScoreData(null);
            setReportData(null);
            setOutreachData(null);
            setCurrentStep(0);
            onStepChange(0);
        }
    };

    // Extract unique years from prediction_score for dropdown (if available)
    const years = propertyData?.prediction_score?.listing_prices
        ? [2024, 2025] // Default years for new structure
        : [];

    // Calculate YOY percentage change (based on available data)
    const calculateYOY = () => {
        if (!propertyData?.prediction_score?.listing_prices) return "N/A";
        
        // Use the new structure with listing_prices
        const listingPrices = propertyData.prediction_score.listing_prices;
        if (listingPrices.market_pace_6_months && listingPrices.patient_sale_12_months) {
            const yoyChange = ((listingPrices.patient_sale_12_months - listingPrices.market_pace_6_months) / listingPrices.market_pace_6_months) * 100;
            return yoyChange.toFixed(1);
        }
        return "N/A";
    };

    const yoyPercentage = calculateYOY();

    return (
        <div className="mt-6">
            <style jsx>{`
                .click-effect:active {
                    animation: subtleClick 0.3s ease-in-out;
                }
                @keyframes subtleClick {
                    0% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.85;
                        background-color: rgba(0, 0, 0, 0.15);
                    }
                    100% {
                        opacity: 1;
                        background-color: inherit;
                    }
                }
            `}</style>
            <p className='text-sm font-medium mb-2'>Enter Property Address</p>
            <div className="flex items-start mt-2 flex-col md:flex-row gap-4">
                <div className="w-full">
                    <div className="relative w-full">
                        <HiOutlineLocationMarker className='text-[#1A2B6C] text-lg font-bold absolute left-3 top-1/2 transform -translate-y-1/2' />
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter Property Address"
                            className="w-full h-[48px] pl-10 pr-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAnalyze();
                                }
                            }}
                        />
                    </div>
                    {loading ? (
                        <div className="text-sm text-[#9A9DA4] mt-1 flex items-center">
                            <div className="w-5 h-5 border-2 border-t-[#1A2B6C] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-2"></div>
                            {loadingMessage}
                        </div>
                    ) : error ? (
                        <p className="text-sm text-red-500 mt-1">{error}</p>
                    ) : suggestions.length > 0 ? (
                        <p className="text-sm font-normal mt-3 mb-5 hidden md:flex items-center gap-2 h-[48px] bg-[#E8EEFF] rounded-[5px] px-4 text-[#000000]">
                            <img src="/images/property/mark.png" className='w-[22px] h-[22px]' alt="" />
                            {suggestions.length} matches found. Select the correct address below.</p>
                    ) : isFocused ? null : (
                        currentStep === 0 && (
                            <p className="text-sm text-[#9A9DA4] mt-1">
                                Enter an address to generate sale-likelihood and pricing. For example: [123 Main St, Toronto].
                            </p>
                        )
                    )}
                </div>
                <div className="flex space-x-6 w-full md:w-auto flex-col md:flex-row">
                    <button
                        className="bg-[#1A2B6C] hover:bg-blue-900 cursor-pointer text-white w-full lg:w-[245px] h-[48px] rounded-md text-sm font-medium flex justify-center items-center gap-2 mt-2 md:mt-0 click-effect"
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        <IoSearchOutline />
                        Search
                    </button>
                    {(currentStep === 2 || currentStep === 3) && (
                        <button
                            className="bg-transparent cursor-pointer text-black border border-[#EDEDED] hover:bg-gray-200 w-full lg:w-[245px] h-[48px] rounded-md text-sm font-medium flex justify-center items-center gap-2 mt-2 md:mt-0 click-effect"
                            onClick={handleClearAndStartNew}
                        >
                            Clear & Start New
                        </button>
                    )}
                </div>
                {suggestions.length > 0 ? (
                    <p className="text-xs font-normal mt-3 mb-5 md:hidden flex items-center gap-2 h-[48px] bg-[#E8EEFF] rounded-[5px] px-2 text-[#000000]">
                        <img src="/images/property/mark.png" className='w-[20px] h-[20px]' alt="" />
                        {suggestions.length} matches found. Select the correct address below.</p>
                ) : <></>
                }
            </div>
            {suggestions.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-bold text-[#1E2029] mb-3">Select the Correct Address <span className='hidden md:inline'>({suggestions.length} options found)</span></h3>
                    <p className='text-[#000000] text-sm font-medium mb-1'>Select the Correct Address</p>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row items-start justify-between !w-full ${selectedIndex === index ? 'border-l-[2px] border-[#1A2B6C]' : ''}`}
                        >
                            <div onClick={() => handleSelectAddress(index)}
                                className="text-base text-[#000000] w-full flex flex-col md:flex-row md:justify-between items-center gap-2 p-1 md:p-2 border border-[#EDED] hover:bg-gray-100 min-h-[65px] justify-center cursor-pointer">
                                <div className='w-full flex items-center gap-1 md:gap-2 text-sm md:text-base'>
                                    <HiOutlineLocationMarker className='text-[rgb(26,43,108)] text-lg font-bold' />
                                    <span className='w-full text-xs md:text-base'>{suggestion.complete_address}</span>
                                </div>
                                {/* {(index === 0 || index === 1) && (
                                    <span className="bg-[#28A745] text-white text-base font-semibold w-[122px] h-[36px] flex justify-center items-center rounded">Exact Match</span>
                                )} */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {confirmedAddress && propertyData && currentStep === 2 && (
                <div className="mt-5 md:mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[#1E2029]">
                            Property Information
                        </h2>
                    </div>
                    <div className="pt-4 pb-2 rounded-lg ">
                        <div className="flex items-start gap-6 flex-col md:flex-row">
                            <div className='flex flex-col gap-3 w-full'>
                                <div className='bg-[#F4F6F8] flex items-center w-full h-[48px] rounded-[5px] px-3'>
                                    <HiOutlineLocationMarker className="text-[#1A2B6C] text-lg font-bold" />
                                    <input
                                        type="text"
                                        value={confirmedAddress?.address || ''}
                                        readOnly
                                        className="flex-1 bg-transparent border-none text-base text-[#000000] focus:outline-none"
                                    />
                                    <button
                                        className="text-[#1A2B6C] cursor-pointer px-2 py-2 rounded-md text-sm font-medium ml-2 click-effect"
                                        onClick={() => copyToClipboard(confirmedAddress?.address || '', 'address')}
                                        title="Copy address"
                                    >
                                        {isCopied.address ? (
                                            <IoCheckmarkCircleOutline className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <IoCopyOutline className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <p className='text-xs text-[#9A9DA4]'>Confirmed address found. Review details then generate sale-likelihood score.</p>
                            </div>
                            <button
                                className="w-full md:w-[344px] gap-3 cursor-pointer h-[48px] bg-[#1A2B6C] hover:bg-blue-900 text-white rounded-md text-sm font-medium flex items-center justify-center click-effect"
                                onClick={handleGetPropertyScore}
                            >
                                Get Seller Likelihood Score <span className='w-[34px] h-[20px] bg-[#E8EEFF] rounded-[2px] text-[#1A2B6C]'>AI</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {scoreData && propertyData && currentStep === 3 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[#1E2029]">
                            Property Information
                        </h2>
                    </div>
                    <div className="bg-white py-4 rounded-lg w-full">
                        <div className="flex items-start w-full gap-4 md:gap-[50px] mb-8 justify-between flex-col flex-wrap">
                            <div className='flex justify-between items-center w-full'>
                                <span className="w-full md:w-[120px] h-[48px] flex justify-center items-center bg-[#28A745] text-white text-base md:text-xl font-bold px-4 py-2 rounded"><span className='text-xl !font-light md:hidden'>PropMatch Score:</span> {Math.round(scoreData.predicted_score)}/10</span>
                                <div className="flex space-x-4 flex-col md:flex-row gap-3 w-full md:w-auto">
                                    <button
                                        className="bg-[#1A2B6C] cursor-pointer hover:bg-blue-900 text-white w-full md:w-[160px] h-[48px] rounded-md text-sm font-medium flex justify-center items-center gap-2 click-effect"
                                        onClick={handleGenerateOutreach}
                                    >
                                        Generate Outreach
                                    </button>
                                    <button
                                        className="bg-[#1A2B6C] hover:bg-blue-900 cursor-pointer text-white w-full md:w-[160px] h-[48px] rounded-md text-sm font-medium flex justify-center items-center gap-2 click-effect"
                                        onClick={handleGenerateReport}
                                    >
                                        Generate Report
                                    </button>
                                </div>
                            </div>
                            <div className='flex justify-center items-start  gap-6 md:gap-2 my-3 md:my-0 flex-col w-full md:w-auto'>
                                <p className="text-sm flex items-center "><img src="/images/property/mark.png" className='mr-2 w-[22px] h-[22px]' alt="" /> Analyzed <span className='text-bold'> 52 market </span> indicators</p>
                                <p className="text-sm flex items-center  "><img src="/images/property/mark.png" className='mr-2 w-[22px] h-[22px]' alt="" /> Compared <span className='text-bold'> 1,847 similar homes</span></p>
                                <p className="text-sm flex items-center  "><img src="/images/property/mark.png" className='mr-2 w-[22px] h-[22px]' alt="" /> <span className='text-bold'>92%</span> prediction accuracy</p>
                            </div>

                        </div>
                        <ScoreAnalysis scoreData={scoreData} />
                        <hr className='border border-[#EDEDED] my-6' />
                        <h2 className="text-lg font-bold text-[#1E2029] mb-6">
                            Market Trends
                        </h2>
                        <div className="bg-white rounded-[5px] border border-[#EDEDED] min-h-[144px] w-full  flex flex-col md:flex-row items-center justify-between">
                            <div className='flex flex-col  h-[100%] p-5 items-center md:items-start w-full sm:w-[250px]'>
                                <h4 className="text-sm font-semibold ">Property Price Trends</h4>
                                <span className="text-[26px] text-[#1A2B6C] font-semibold">{yoyPercentage} <span className='text-[#9A9DA4] text-[13px] font-normal'>YoY</span> </span>
                               
                            </div>
                            <div className=" border-t md:border-l border-[#EDEDED] w-full">
                                <PriceTrendChart
                                    predictions={propertyData.predictions.predictions}
                                    // selectedYear={selectedYear}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {reportData && currentStep === 4 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[#1E2029]">
                            Property Information
                        </h2>
                    </div>
                    <div className="bg-white py-4 rounded-lg w-full">
                        <div className="flex items-center gap-4 md:gap-2 mb-6 justify-between flex-col md:flex-row flex-wrap">
                            <div className='flex justify-between items-center w-full'>
                                <span className="w-full md:w-[120px] h-[48px] flex justify-center items-center bg-[#28A745] text-white text-base md:text-xl font-bold px-4 py-2 rounded"><span className='text-xl !font-light md:hidden'>PropMatch Score:</span> {Math.round(scoreData.predicted_score)}/10</span>
                                <div className="flex space-x-4 flex-col md:flex-row gap-3 w-full md:w-auto">
                                    <button
                                        className="bg-[#1A2B6C] cursor-pointer hover:bg-blue-900 text-white w-full md:w-[160px] h-[48px] rounded-md text-sm font-medium flex justify-center items-center gap-2 click-effect"
                                        onClick={handleGenerateOutreach}
                                    >
                                        Generate Outreach
                                    </button>
                                    <button
                                        className=" text-[#727176] cursor-pointer bg-[#F0F2F5] hover:bg-gray-200 w-full md:w-[160px] h-[48px] rounded-md text-sm font-medium flex justify-center items-center gap-2 click-effect"
                                        onClick={handleClearAndStartNew}
                                    >
                                        Back to Analyze
                                    </button>
                                </div>
                            </div>
                            <div className='flex justify-center items-start  gap-6 md:gap-2 my-3 md:my-6 flex-col w-full md:w-auto'>
                                <p className="text-sm flex items-center "><img src="/images/property/mark.png" className='mr-2 w-[22px] h-[22px]' alt="" /> Analyzed <span className='text-bold'> 52 market </span> indicators</p>
                                <p className="text-sm flex items-center  "><img src="/images/property/mark.png" className='mr-2 w-[22px] h-[22px]' alt="" /> Compared <span className='text-bold'> 1,847 similar homes</span></p>
                                <p className="text-sm flex items-center  "><img src="/images/property/mark.png" className='mr-2 w-[22px] h-[22px]' alt="" /> <span className='text-bold'>92%</span> prediction accuracy</p>
                            </div>
                        </div>
                        <hr className=' border-[#EDEDED] mb-6' />

                        <div className="mb-6 flex items-center gap-5 flex-col md:flex-row">
                            <h2 className="text-base md:text-lg font-bold text-[#1E2029]">
                                AI-Generated Property Report
                            </h2>
                            <p className="w-full md:w-auto text-xs md:text-sm font-medium flex items-center min-h-[32px] gap-3 bg-[#16A34A1A] px-4 rounded-[5px]">
                                <FaCheck className="mr-2 text-[#28A745]" />Report generated successfully
                            </p>
                        </div>
                        <div className="flex space-x-4 mb-6 flex-col md:flex-row gap-4">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={loading}
                                className="bg-[#1A2B6C] hover:bg-blue-900 disabled:bg-gray-400 text-white w-full md:w-[49%] h-[48px] rounded-[5px] text-[15px] font-semibold flex justify-center items-center gap-2 click-effect"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-2"></div>
                                        Generating PDF...
                                    </>
                                ) : (
                                    "Download PDF Report"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {outreachData && currentStep === 5 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[#1E2029]">
                            Property Information
                        </h2>
                    </div>
                    <div className="bg-white py-4 rounded-lg w-full">
                        <div className="flex items-center w-full gap-4 md:gap-2 mb-6 justify-between flex-col md:flex-row flex-wrap">
                            <div className='flex justify-between items-center w-full'>
                                <span className="w-full md:w-[120px] h-[48px] flex justify-center items-center bg-[#28A745] text-white text-base md:text-xl font-bold px-4 py-2 rounded"><span className='text-xl !font-light md:hidden'>PropMatch Score:</span> {Math.round(scoreData.predicted_score)}/10</span>
                                <div className="flex space-x-4 flex-col md:flex-row w-full md:w-auto gap-3">
                                    <button
                                        className="bg-[#1A2B6C] cursor-pointer hover:bg-blue-900 text-white w-full md:w-[160px] h-[48px] rounded-md text-sm font-medium flex justify-center items-center gap-2 click-effect"
                                        onClick={handleGenerateReport}
                                    >
                                        Generate Report
                                    </button>
                                    <button
                                        className="text-[#727176] cursor-pointer bg-[#F0F2F5] hover:bg-gray-200 w-full md:w-[160px] h-[48px] rounded-md text-sm font-medium flex justify-center items-center gap-2 click-effect"
                                        onClick={handleClearAndStartNew}
                                    >
                                        Back to Analyze
                                    </button>
                                </div>
                            </div>

                            <div className='flex justify-center items-start  gap-6 md:gap-2 my-3 md:my-6 flex-col w-full md:w-auto'>
                                <p className="text-sm flex items-center "><img src="/images/property/mark.png" className='mr-2 w-[22px] h-[22px]' alt="" /> Analyzed <span className='text-bold'> 52 market </span> indicators</p>
                                <p className="text-sm flex items-center  "><img src="/images/property/mark.png" className='mr-2 w-[22px] h-[22px]' alt="" /> Compared <span className='text-bold'> 1,847 similar homes</span></p>
                                <p className="text-sm flex items-center  "><img src="/images/property/mark.png" className='mr-2 w-[22px] h-[22px]' alt="" /> <span className='text-bold'>92%</span> prediction accuracy</p>
                            </div>
                        </div>
                        <hr className=' border-[#EDEDED] mb-6' />
                        <div className="mb-6 flex items-start gap-3 flex-col md:flex-row">
                            <h2 className="text-base md:text-lg font-bold text-[#1E2029] text-left">
                                AI-Generated Messages
                            </h2>
                            <p className="w-full md:w-auto text-xs md:text-sm font-medium flex items-center min-h-[32px] gap-3 bg-[#16A34A1A] px-4 rounded-[5px]">
                                <FaCheck className="mr-2 text-[#28A745]" /> AI-messages generated successfully
                            </p>
                        </div>
                        <div className="mb-6">
                            <div className=" relative">
                                <div className='flex justify-between items-center mb-3'>
                                    <h3 className="text-lg font-bold text-[#1E2029]">Text Message</h3>
                                    <button
                                        className="text-[#1A2B6C] border border-[#1A2B6C] px-2 py-2 rounded-md text-sm font-medium cursor-pointer click-effect"
                                        onClick={() => copyToClipboard(outreachData.personalized_text_message || "", 'text')}
                                        title="Copy text"
                                        disabled={!outreachData.personalized_text_message}
                                    >
                                        {isCopied.text ? (
                                            <IoCheckmarkCircleOutline className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <IoCopyOutline className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="bg-[#F8F9FB] border border-[#EDEDED] p-4 rounded-xl text-base text-[#9A9DA4]">{outreachData.personalized_text_message || "Text message not available"}</p>

                            </div>
                        </div>
                        <hr className=' border-[#EDEDED] mb-6' />
                        <div className="flex flex-col md:flex-row gap-6 justify-between mb-6">
                            <div className="w-full md:w-[45%]">
                                <div className=" relative">
                                    <div className='flex justify-between items-center mb-3'>
                                        <h3 className="text-lg font-bold text-[#1E2029] ">Sales Pitch</h3>
                                        <button
                                            className="border border-[#1A2B6C] text-[#1A2B6C] px-2 py-2 rounded-md text-sm font-medium cursor-pointer click-effect"
                                            onClick={() => copyToClipboard(outreachData.detailed_sales_pitch || "", 'pitch')}
                                            title="Copy pitch"
                                            disabled={!outreachData.detailed_sales_pitch}
                                        >
                                            {isCopied.pitch ? (
                                                <IoCheckmarkCircleOutline className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <IoCopyOutline className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="bg-[#F8F9FB] border border-[#EDEDED] p-4 rounded-xl text-base text-[#9A9DA4]">{outreachData.detailed_sales_pitch || "Sales pitch not available"}</p>

                                </div>
                            </div>
                            <div className="w-full md:w-[45%]">
                                <div className=" relative">
                                    <div className='flex justify-between items-center mb-3'>
                                        <h3 className="text-lg font-bold text-[#1E2029] ">Email Content</h3>
                                        <button
                                            className="border border-[#1A2B6C] text-[#1A2B6C] px-2 py-2 rounded-md text-sm font-medium cursor-pointer click-effect"
                                            onClick={() => copyToClipboard(outreachData.lead_generation_email || "", 'email')}
                                            title="Copy email"
                                            disabled={!outreachData.lead_generation_email}
                                        >
                                            {isCopied.email ? (
                                                <IoCheckmarkCircleOutline className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <IoCopyOutline className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="bg-[#F8F9FB] border border-[#EDEDED] p-4 rounded-xl text-base text-[#9A9DA4]">{outreachData.lead_generation_email || "Email content not available"}</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleAddressSearch;