'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaSignOutAlt, FaCreditCard } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const UserProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push('/dashboard/profile');
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get display name
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 ${isMobileView ? 'p-3' : 'p-2'} hover:bg-gray-50 transition-colors rounded-lg ${isMobileView ? 'min-h-[56px]' : ''}`}
      >
        {/* Avatar */}
        <div className={`${isMobileView ? 'w-[40px] h-[40px]' : 'w-[46px] h-[46px]'} bg-[#1A2B6C] text-white rounded-full flex items-center justify-center text-sm font-semibold`}>
          {getUserInitials()}
        </div>
        
        {/* Name and Role */}
        <div className={`${isMobileView ? 'block' : 'hidden sm:block'} text-left`}>
          <div className={`${isMobileView ? 'text-sm' : 'text-sm md:text-base'} font-medium text-gray-900`}>{getDisplayName()}</div>
          <div className="text-[13px] font-light text-[#9A9DA4] capitalize">
            {user?.plan_type === 'trial' ? 'Free Trial' : 
             user?.plan_type === 'basic' ? 'Basic Plan' :
             user?.plan_type === 'pro' ? 'Pro Plan' : 'Free Trial'}
          </div>
        </div>
        
        {/* Dropdown Arrow */}
        <div className={`${isMobileView ? 'w-[32px] h-[32px]' : 'w-[36px] h-[36px]'} rounded-full flex items-center justify-center ml-2 border border-[#E5E5E5]`}>
          <FaChevronDown 
            className={`w-3 h-3 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 ${isMobileView ? 'w-72' : 'w-64'} bg-white border border-gray-200 rounded-lg shadow-lg z-[60] ${isMobileView ? 'mr-2' : ''}`}>
          {/* User Info Header */}
          <div className={`${isMobileView ? 'px-5 py-4' : 'px-4 py-3'} border-b border-gray-100`}>
            <div className="flex items-center space-x-3">
              <div className={`${isMobileView ? 'w-12 h-12' : 'w-10 h-10'} bg-[#1A2B6C] text-white rounded-full flex items-center justify-center font-semibold`}>
                {getUserInitials()}
              </div>
              <div>
                <div className={`font-medium text-gray-900 ${isMobileView ? 'text-base' : ''}`}>{getDisplayName()}</div>
                <div className={`${isMobileView ? 'text-sm' : 'text-sm'} text-gray-500`}>{user?.email}</div>
                <div className={`${isMobileView ? 'text-sm' : 'text-xs'} text-blue-600 font-medium capitalize`}>
                  {user?.plan_type === 'trial' ? 'Free Trial' : 
                   user?.plan_type === 'basic' ? 'Basic Plan' :
                   user?.plan_type === 'pro' ? 'Pro Plan' : 'Free Trial'}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className={`flex items-center w-full ${isMobileView ? 'px-5 py-4' : 'px-4 py-2'} ${isMobileView ? 'text-base' : 'text-sm'} text-gray-700 hover:bg-gray-50 transition-colors ${isMobileView ? 'min-h-[56px]' : ''}`}
            >
              <FaCreditCard className={`${isMobileView ? 'w-5 h-5' : 'w-4 h-4'} mr-3 text-gray-400`} />
              Account & Billing
            </button>
            
            <button
              onClick={handleLogout}
              className={`flex items-center w-full ${isMobileView ? 'px-5 py-4' : 'px-4 py-2'} ${isMobileView ? 'text-base' : 'text-sm'} text-red-600 hover:bg-red-50 transition-colors ${isMobileView ? 'min-h-[56px]' : ''}`}
            >
              <FaSignOutAlt className={`${isMobileView ? 'w-5 h-5' : 'w-4 h-4'} mr-3`} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;