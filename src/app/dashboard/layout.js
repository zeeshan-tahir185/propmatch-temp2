"use client";
import React, { useState } from 'react';
import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import Link from 'next/link';
import { AddressProvider } from '@/app/context/AddressContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
  const [isNavbarMenuOpen, setIsNavbarMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const toggleSidebarMenu = () => {
    setIsSidebarMenuOpen(!isSidebarMenuOpen);
    setIsNavbarMenuOpen(false); // Close navbar menu if open
  };

  const toggleNavbarMenu = () => {
    setIsNavbarMenuOpen(!isNavbarMenuOpen);
    setIsSidebarMenuOpen(false); // Close sidebar menu if open
  };

  // Helper functions for user data
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getTrialDaysLeft = () => {
    if (user?.plan_type === 'trial' && user?.plan_end_date) {
      const endDate = new Date(user.plan_end_date);
      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    return 14; // Default fallback
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Don't render if not authenticated or still loading
  if (isLoading || !isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      {/* Sidebar Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-50 transform ${
          isSidebarMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <Sidebar isMobileMenu={true} toggleMobileMenu={toggleSidebarMenu} />
      </div>
      {/* Navbar Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-50 transform ${
          isNavbarMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="h-[100px] flex justify-between items-center border-b border-[#EDEDED] px-6">
          <Link href="/"><img src="/images/home/logo.svg" alt="PropMatch AI" className="w-[120px]" /></Link>
          <button onClick={toggleNavbarMenu} className="lg:hidden p-2">
            <svg className="w-6 h-6 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 flex flex-col space-y-6">
          <div className="text-2xl text-[#1E2029] font-bold text-center">
            Welcome back, <span className="font-normal">{user?.first_name || 'User'}</span>
          </div>
          
          {/* Notifications */}
          <div className="flex justify-center">
            <div className="relative h-[48px] w-[48px] rounded-full border border-[#E5E5E5] flex justify-center items-center bg-gray-50">
              <svg className="w-6 h-6 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#E91E63] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                2
              </span>
            </div>
          </div>
          
          {/* Trial Status */}
          {user?.plan_type === 'trial' && (
            <div className="text-center">
              <span className="bg-[#EDEDED] text-lg px-6 py-3 rounded-lg font-medium">
                Trial: {getTrialDaysLeft()} days left
              </span>
            </div>
          )}
          
          {/* Enhanced User Profile Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center space-y-4">
            <div className="w-[60px] h-[60px] bg-gradient-to-r from-[#1A2B6C] to-[#2563EB] text-white rounded-full flex items-center justify-center text-lg font-semibold shadow-lg ring-4 ring-white/50">
              {getUserInitials()}
            </div>
            <div className="text-center">
              <div className="text-xl font-medium text-gray-900">{getDisplayName()}</div>
              <div className="text-sm text-gray-600">{user?.email}</div>
              <div className="text-sm font-medium text-blue-600 capitalize mt-1">
                {user?.plan_type === 'trial' ? '🆓 Free Trial' : 
                 user?.plan_type === 'basic' ? '⭐ Basic Plan' :
                 user?.plan_type === 'pro' ? '🚀 Pro Plan' : '🆓 Free Trial'}
              </div>
            </div>
            
            {/* Enhanced Profile Actions */}
            <div className="w-full space-y-3 mt-6">
              <Link 
                href="/dashboard/profile" 
                onClick={toggleNavbarMenu}
                className="w-full bg-gradient-to-r from-[#1A2B6C] to-[#2563EB] text-white px-6 py-4 rounded-lg font-medium text-center block hover:from-[#0d1b4d] hover:to-[#1e40af] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                <span>Account & Billing</span>
              </Link>
              <button 
                onClick={() => {
                  toggleNavbarMenu();
                  handleLogout();
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Navbar toggleSidebarMenu={toggleSidebarMenu} toggleNavbarMenu={toggleNavbarMenu} />
        <AddressProvider>
          <main className="p-3 md:p-6 lg:p-8 mt-[100px] ml-[16px] md:ml-[84px] lg:ml-64 min-h-screen">{children}</main>
        </AddressProvider>
      </div>
    </div>
  );
}