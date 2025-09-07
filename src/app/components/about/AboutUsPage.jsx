"use client";
import React from "react";
import Link from "next/link";

const AboutUsPage = () => {
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

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#1A2B6C] to-blue-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-6">About Us</h1>
                    <p className="text-xl leading-relaxed">
                        PropMatch AI: Smarter connections, better insights.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg leading-relaxed mb-8">
                            Every year, new tools promise to change the way real estate is done. But most of them are either too complicated, too generic, or disconnected from the realities of an agent's day-to-day work. Realtors end up juggling CRMs, spreadsheets, and endless follow-ups — wasting hours on cold leads and missed opportunities.
                        </p>

                        <h2 className="text-3xl font-semibold text-gray-900 mt-10 mb-6">Our Story</h2>
                        <p className="text-lg leading-relaxed mb-8">
                            PropMatch AI was built to change that. Founded in 2024, our team set out to solve one of the biggest challenges in real estate: knowing which homeowners are actually ready to sell, and how to connect with them in the smartest way possible. We combine predictive analytics, market insights, and AI-powered messaging to help professionals focus on leads that convert — not leads that drain time.
                        </p>

                        <p className="text-lg leading-relaxed mb-8">
                            We've felt the frustration ourselves. As builders, technologists, and industry partners, we know what it's like to face outdated workflows, unclear data, and guesswork when it comes to prospecting. That's why PropMatch AI isn't just another software tool. It's designed as the intelligent layer that simplifies decision-making, streamlines outreach, and gives agents the confidence to act with precision.
                        </p>

                        <h2 className="text-3xl font-semibold text-gray-900 mt-10 mb-6">Our Mission</h2>
                        <div className="bg-blue-50 border-l-4 border-[#1A2B6C] p-6 mb-8">
                            <p className="text-xl font-medium text-gray-900">
                                Redefine real estate through AI-driven tools for smarter connections and predictive insights.
                            </p>
                        </div>

                        <p className="text-lg leading-relaxed mb-8">
                            From solo agents to entire brokerages, PropMatch AI empowers professionals to navigate the market with efficiency, accuracy, and results.
                        </p>

                        <h2 className="text-3xl font-semibold text-gray-900 mt-10 mb-6">Our Team</h2>
                        <p className="text-lg leading-relaxed mb-8">
                            We are a small but dedicated team of innovators based in Canada — working at the intersection of AI, PropTech, real estate, and technology — and we're just getting started.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-8 mt-10 text-center">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Transform Your Real Estate Business?</h3>
                            <p className="text-lg text-gray-600 mb-6">
                                Join thousands of real estate professionals who trust PropMatch AI for smarter prospecting and better results.
                            </p>
                            <Link href="/login" className="inline-block bg-[#1A2B6C] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors">
                                Get Started Today
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;