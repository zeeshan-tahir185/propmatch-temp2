'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes, FaRocket, FaGlobe } from 'react-icons/fa';
import { MdOutlineRocketLaunch } from "react-icons/md";
import { IoIosGlobe } from "react-icons/io";
import { useAuth } from '../contexts/AuthContext';
import UserProfileDropdown from '../components/user/UserProfileDropdown';
import { IoNotificationsCircleOutline, IoNotificationsCircleSharp } from 'react-icons/io5';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3); // Add state for notifications
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className='!bg-white fixed top-0 w-full left-0 right-0 z-50'>
            <nav className=" container-responsive mx-auto px-4 py-4 flex justify-between items-center h-[100px] ">
                <Link href="/" className="flex items-center">
                    <Image src="/images/home/logo.svg" alt='logo' width={140} height={23} className="w-[120px] md:w-[140px]" />
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/products" className="">Products</Link>
                    <Link href="/pricing" className="">Pricing</Link>
                    {
                        isAuthenticated() ?
                        <Link href="/dashboard" className="">Dashboard</Link>:<></>
                    }
                    {isAuthenticated() ? (
                        <UserProfileDropdown user={user} onLogout={handleLogout} />
                    ) : (
                        <Link href="/login" className="bg-[#1A2B6C] cursor-pointer hover:bg-blue-900 text-white w-[148px] h-[48px] rounded-[5px] flex items-center justify-center">
                            <MdOutlineRocketLaunch className="mr-2 w-[22px] h-[22px]" />Get Started
                        </Link>
                    )}
                    
                    <div className="flex gap-1">
                        <IoIosGlobe className="w-[24px] h-[24px]" />
                        <select 
                            className="bg-white border-none focus:outline-none text-base cursor-pointer"
                            defaultValue="en"
                            suppressHydrationWarning
                        >
                            <option value="en">EN</option>
                        </select>
                    </div>
                    
                    {/* Bell Icon with Notification Count */}
                    <div className="relative">
                        <IoNotificationsCircleSharp className='text-[30px] cursor-pointer' />
                        {notificationCount > 0 && (
                            <span className="absolute top-[-5px] right-[-5px] text-xs text-white bg-red-600 rounded-full w-[20px] h-[20px] flex justify-center items-center">{notificationCount}</span>
                        )}
                    </div>
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="">
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {isOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-10">
                        <div className="flex flex-col items-center space-y-4 py-4">
                            <Link href="/dashboard" className="" onClick={() => setIsOpen(false)}>Property Analysis</Link>
                            <Link href="/dashboard/lead-ranking" className="" onClick={() => setIsOpen(false)}>Lead Ranking</Link>
                            <Link href="/pricing" className="" onClick={() => setIsOpen(false)}>Pricing</Link>
                            
                            {isAuthenticated() ? (
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="text-center">
                                        <div className="font-medium">{user?.first_name || user?.email}</div>
                                        <div className="text-sm text-gray-500 capitalize">{user?.plan_type} Plan</div>
                                    </div>
                                    <Link 
                                        href="/dashboard/profile" 
                                        className="text-blue-600 hover:text-blue-700"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Account & Billing
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleLogout();
                                        }}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="bg-[#1A2B6C] cursor-pointer hover:bg-blue-900 text-white w-[148px] h-[48px] rounded-[5px] flex items-center justify-center">
                                    <MdOutlineRocketLaunch className="mr-2 w-[22px] h-[22px]" />Get Started
                                </Link>
                            )}
                            
                            <div className="flex gap-1">
                                <IoIosGlobe className="w-[24px] h-[24px]" />
                                <select 
                                    className="bg-white border-none focus:outline-none text-base cursor-pointer"
                                    defaultValue="en"
                                    suppressHydrationWarning
                                >
                                    <option value="en">EN</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
