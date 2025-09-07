"use client";

import Link from "next/link";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import UserProfileDropdown from "../user/UserProfileDropdown";
import { RiMenu2Line } from "react-icons/ri";

const Navbar = ({ toggleSidebarMenu, toggleNavbarMenu }) => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated]);

  // Don't render navbar if not authenticated or still loading
  if (isLoading || !isAuthenticated()) {
    return null;
  }

  const getTrialDaysLeft = () => {
    if (user?.plan_type === "trial" && user?.plan_end_date) {
      const endDate = new Date(user.plan_end_date);
      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    return null;
  };

  return (
    <nav className="bg-white lg:border-b lg:border-l border-[#EDEDED] h-[100px] px-3 md:px-6 flex justify-between items-center fixed left-[16px] md:left-[84px] lg:left-64 right-0 z-20">
      <div className="flex items-center space-x-4 lg:hidden">
        <button onClick={toggleSidebarMenu} className="lg:hidden">
          <RiMenu2Line className="text-[25px] mt-[-5px] text-[#6B7280]" />

        </button>
      </div>
      <Link href="/">
        <img
          src="/images/home/logo.svg"
          alt="PropMatch AI"
          className="w-[180px] lg:w-[160px] md:hidden"
        />
      </Link>
      <div className="flex items-center space-x-6 justify-end md:justify-between md:w-full">
        <button onClick={toggleNavbarMenu} className="lg:hidden">
          <svg
            className="w-6 h-6 text-[#6B7280]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="text-sm md:text-xl text-[#1E2029] font-bold">
            Welcome back,{" "}
            <span className="font-normal ml-1">
              {user?.first_name || "User"}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user?.plan_type === "trial" && (
              <>
                <span className="bg-[#EDEDED] text-sm md:text-base px-3 py-1 rounded-[6px]">
                  Trial: {getTrialDaysLeft() || 14} days left
                </span>
                <Link
                  href="/pricing"
                  className="bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Upgrade Plan
                </Link>
              </>
            )}
            <div className="border-l border-[#EDEDED] h-[46px]"></div>
            <UserProfileDropdown user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
