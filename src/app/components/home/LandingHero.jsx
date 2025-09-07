"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const LandingHero = () => {
  return (
    <section className="relative overflow-hidden min-h-screen 2xl:!min-h-[50vh] pt-[100px] pb-[80px]">
      {/* Hero Container - Enhanced for Professional Devices */}
      <div className="relative custom_bg_img">
        <div
          className="relative rounded-[10px] overflow-hidden mx-auto flex flex-col items-center justify-center  "
          style={{
            borderRadius: "10px",
            maxWidth:"1440px"
          }}
        >
          <div
            className=" flex flex-col justify-center items-center px-4 md:px-8 lg:px-16"
            style={{ height: "480px" }}
          >
            <h1
              className="text-white font-bold text-center"
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "46px",
                lineHeight: "110%",
                letterSpacing: "0.005em",
                width: "984px",
                maxWidth: "90%",
                marginBottom: "40px",
              }}
            >
              Stop Chasing Dead Leads — Win Listings with Homeowners Ready to
              Sell
            </h1>

            <p
              className="text-white text-center mb-8"
              style={{
                fontFamily: "SF UI Display, sans-serif",
                fontSize: "15px",
                lineHeight: "22px",
                letterSpacing: "0.03em",
                width: "549px",
                maxWidth: "80%",
              }}
            >
              PropMatch identifies the 20% of Canadian homeowners ready to list,
              so you close deals before competitors even know where to look.
            </p>

            <Link
              href="/login?redirect=dashboard"
              className="inline-flex items-center justify-center font-semibold text-center bg-white text-[#1A2B6C] border border-white rounded-[5px] px-6 py-3 transition-all hover:bg-gray-100"
              style={{
                fontFamily: "SF UI Display, sans-serif",
                fontSize: "15px",
                fontWeight: "600",
                width: "300px",
                height: "48px",
              }}
            >
              Start Your Free Trial Now
            </Link>
          </div>
          <img src="/images/home/main.png" alt="" className="w-[90%] md:w-[70%]" />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
