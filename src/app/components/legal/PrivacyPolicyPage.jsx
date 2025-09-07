"use client";
import React from "react";
import Link from "next/link";

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold text-[#1A2B6C]">PropMatch</span>
                        </Link>
                        <div className="flex space-x-4">
                            <Link href="/login" className="text-gray-600 hover:text-[#1A2B6C] px-3 py-2 rounded-md text-sm font-medium">
                                Sign In
                            </Link>
                            <Link href="/login" className="bg-[#1A2B6C] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-sm text-gray-600 mb-8">Last Updated: August 2025</p>
                    
                    <div className="prose prose-lg max-w-none">
                        <p className="mb-6">
                            At PropMatch.io, protecting your privacy is our priority. This Privacy Policy explains how we collect, use, and safeguard information when you use our services. By accessing PropMatch.io, you agree to the practices described below.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
                        <p className="mb-6">
                            We collect information you provide directly, such as when you create an account, upload CRM leads, or search for properties. This may include personal details like names, addresses, phone numbers, and email addresses. We also gather usage data such as device information, IP addresses, and activity logs to help us improve our services. In some cases, we use cookies or similar technologies to enhance user experience.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Data</h2>
                        <p className="mb-6">
                            Your data is used to deliver and improve our core services — including property sale predictions, pricing recommendations, lead scoring, and AI-generated messaging. We may also use aggregated, non-identifiable information for analytics, system improvements, or industry research. We do not sell your data to third parties. Data is stored securely on Google Cloud with encryption in transit and at rest, in compliance with Canadian privacy laws (PIPEDA).
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Sharing</h2>
                        <p className="mb-6">
                            We may share limited information with trusted third-party providers (such as HOUSKI, and Google Gemini) solely to provide our services. All integrations follow licensing agreements and security best practices. Any outreach generated through our platform must comply with Canada's Anti-Spam Legislation (CASL), and users are responsible for ensuring they have appropriate consent before contacting leads.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
                        <p className="mb-6">
                            You may request to access, update, or delete your personal information at any time by contacting us. Please note that certain essential communications (e.g., updates to our Terms or system notifications) cannot be opted out of. While we take strong measures to protect your data, no online system is completely secure, and we cannot guarantee absolute protection.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Additional Information</h2>
                        <p className="mb-6">
                            PropMatch.io is designed for real estate professionals and is not intended for children under 13. By using our services, you consent to your data being processed and stored in Canada. If we make material changes to this Privacy Policy, we will notify you by updating this page with a new "Last Updated" date.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
                        <p className="mb-6">
                            For any questions or privacy-related requests, please contact us at <a href="mailto:contact@propmatch.io" className="text-[#1A2B6C] hover:underline">contact@propmatch.io</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;