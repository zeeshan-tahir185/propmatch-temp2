"use client";
import React, { useState, useEffect } from "react";
import MobileLoginPage from './MobileLoginPage';
import Image from "next/image";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import UserRegistrationModal from '../user/UserRegistrationModal';
import Footer from '../../shared/Footer';

const LoginPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Check if mobile
    useEffect(() => {
        const checkScreenSize = () => {
            const isMobileScreen = window.innerWidth < 1024; // lg breakpoint (wider for testing)
            console.log('📱 Screen size check:', { width: window.innerWidth, isMobile: isMobileScreen });
            setIsMobile(isMobileScreen);
        };

        checkScreenSize();
        setIsLoaded(true);

        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Show loading while checking screen size
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Render mobile version for mobile screens
    if (isMobile) {
        console.log('📱 Rendering MobileLoginPage');
        return <MobileLoginPage />;
    }

    // Desktop version continues below
    console.log('💻 Rendering DesktopLoginPage');
    return <DesktopLoginPage />;
};

const DesktopLoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || 'dashboard';
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            router.push(getRedirectUrl());
        }
    }, []);
    
    const getRedirectUrl = () => {
        switch (redirect) {
            case 'property-search':
                return '/dashboard/property-search';
            case 'lead-ranking':
                return '/dashboard/lead-ranking';
            case 'dashboard':
            default:
                return '/dashboard';
        }
    };

    // Handle Caps Lock detection
    const handleKeyPress = (e) => {
        const capsLock = e.getModifierState("CapsLock");
        setIsCapsLockOn(capsLock);
    };

    useEffect(() => {
        const input = document.querySelector('input[type="password"], input[type="text"]');
        input?.addEventListener("keypress", handleKeyPress);
        return () => input?.removeEventListener("keypress", handleKeyPress);
    }, [showPassword]); // Re-run effect when showPassword changes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error and success messages when user starts typing
        if (loginError) {
            setLoginError('');
        }
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Use auth context to handle login
                login(data.user, data.token);
                
                // Redirect to desired page
                router.push(getRedirectUrl());
            } else {
                setLoginError(data.detail || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            setLoginError('');
            
            // Check for incognito mode
            if (window.navigator && window.navigator.webdriver) {
                setLoginError('Google login is not available in this browsing mode. Please use email login instead.');
                setIsLoading(false);
                return;
            }
            
            // Load and initialize Google Sign-In
            if (typeof window !== 'undefined') {
                if (!window.google) {
                    // Load Google Sign-In script
                    const script = document.createElement('script');
                    script.src = 'https://accounts.google.com/gsi/client';
                    script.async = true;
                    script.defer = true;
                    
                    script.onload = () => {
                        setTimeout(() => initializeGoogleSignIn(), 500);
                    };
                    
                    script.onerror = () => {
                        setLoginError('Failed to load Google Sign-In. Please try email login instead.');
                        setIsLoading(false);
                    };
                    
                    document.head.appendChild(script);
                } else {
                    initializeGoogleSignIn();
                }
            }
        } catch (error) {
            console.error('Google login error:', error);
            setLoginError('Google login failed. Please try with email and password instead.');
            setIsLoading(false);
        }
    };

    const initializeGoogleSignIn = () => {
        try {
            // Debug logging
            console.log('Google Client ID from env:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
            console.log('Google Client ID type:', typeof process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
            console.log('Google Client ID length:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.length);
            console.log('Current hostname:', window.location.hostname);
            console.log('Current origin:', window.location.origin);
            console.log('Environment:', process.env.NODE_ENV);
            
            // Check if Google Client ID is configured
            if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE' || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE') {
                console.error('Google Client ID not configured properly');
                setLoginError('Google Sign-In is not configured. Please contact support or use email login instead.');
                setIsLoading(false);
                return;
            }

            // Validate Client ID format (should end with .apps.googleusercontent.com)
            if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
                console.error('Invalid Google Client ID format - should end with .apps.googleusercontent.com');
                setLoginError('Google Sign-In configuration error. Please contact support or use email login instead.');
                setIsLoading(false);
                return;
            }

            if (window.google && window.google.accounts) {
                // Initialize Google Sign-In
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                    auto_select: false,
                    cancel_on_tap_outside: false,
                    use_fedcm_for_prompt: false
                });
                
                // Create and render the sign-in button
                const buttonContainer = document.getElementById('google-signin-button');
                if (buttonContainer) {
                    buttonContainer.innerHTML = ''; // Clear existing content
                    
                    window.google.accounts.id.renderButton(
                        buttonContainer,
                        {
                            theme: 'outline',
                            size: 'large',
                            width: '100%',
                            text: 'signin_with',
                            logo_alignment: 'left'
                        }
                    );
                    
                    // Trigger the button click programmatically
                    setTimeout(() => {
                        const googleButton = buttonContainer.querySelector('[role="button"]');
                        if (googleButton) {
                            googleButton.click();
                        } else {
                            // Fallback: use prompt method
                            window.google.accounts.id.prompt((notification) => {
                                if (notification.isNotDisplayed()) {
                                    setLoginError('Google Sign-In is not available. Please use email login instead.');
                                    setIsLoading(false);
                                }
                            });
                        }
                    }, 100);
                } else {
                    // Fallback to prompt method
                    window.google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed()) {
                            setLoginError('Google Sign-In is not available. Please use email login instead.');
                            setIsLoading(false);
                        }
                    });
                }
                
                // Set timeout to reset loading state
                setTimeout(() => {
                    setIsLoading(false);
                }, 8000);
                
            } else {
                throw new Error('Google Sign-In not available');
            }
        } catch (error) {
            console.error('Google Sign-In initialization error:', error);
            setLoginError('Google Sign-In is not available. Please use email login instead.');
            setIsLoading(false);
        }
    };

    const handleGoogleCallback = async (response) => {
        try {
            // Decode JWT token from Google
            const decoded = JSON.parse(atob(response.credential.split('.')[1]));
            
            const googleAuthData = {
                google_id: decoded.sub,
                email: decoded.email,
                first_name: decoded.given_name,
                last_name: decoded.family_name
            };

            const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(googleAuthData),
            });

            const data = await apiResponse.json();

            if (apiResponse.ok) {
                // Use auth context to handle login
                login(data.user, data.token);
                
                // Redirect to desired page
                router.push(getRedirectUrl());
            } else {
                setLoginError(data.detail || 'Google login failed. Please try again.');
            }
        } catch (error) {
            console.error('Google callback error:', error);
            setLoginError('Google login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegistrationSuccess = (data) => {
        if (data.shouldRedirectToLogin) {
            // New user registration - show success message and stay on login page
            setSuccessMessage(data.message || 'Registration successful! Please log in to continue.');
            setShowRegistrationModal(false);
        } else {
            // Existing user login via Google - redirect to dashboard
            login(data.user, data.token);
            router.push(getRedirectUrl());
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="flex-1 flex flex-col lg:flex-row">
                
                {/* Mobile Header - Visible only on small screens */}
                <div className="lg:hidden bg-[#1A2B6C] px-6 pt-8 pb-6">
                    <div className="text-center">
                        <Image
                            src="/images/home/logo.svg"
                            width={120}
                            height={29}
                            alt="PropMatch AI Logo"
                            className="mx-auto mb-4"
                        />
                        <h1 className="text-white text-xl font-bold mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-blue-100 text-sm">
                            Continue your real estate success journey
                        </p>
                    </div>
                </div>
                
                {/* Left Section with Background Image - Desktop Only */}
                <div className="hidden lg:flex w-full lg:w-1/2 login_bg_img">
                    <div className="flex flex-col justify-between h-full p-6 lg:p-12 text-white">
                        <Image
                            src="/images/home/logo.svg"
                            width={150}
                            height={36}
                            alt="PropMatch AI Logo"
                            className="mb-4"
                        />
                        {/* <div className="flex flex-col gap-6 text-white">
                            <h1 className="text-2xl lg:text-4xl font-bold leading-tight max-w-lg">
                                Transform your real estate<br />
                                business with AI precision.
                            </h1>
                            <p className="text-base lg:text-lg text-white/90 max-w-lg">
                                Access powerful property insights, predictive scoring,
                                and AI-generated messaging to close more deals.
                            </p>
                        </div> */}
                    </div>
                </div>

                {/* Login Form Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 flex-1">
                <div className="w-full max-w-md">
                    {/* Desktop Title */}
                    <div className="hidden lg:block">
                        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">
                            Welcome Back to PropMatch
                        </h2>
                        <p className="text-gray-500 text-sm lg:text-base mb-8">
                            Log in to continue your 14-day trial.
                        </p>
                    </div>
                    
                    {/* Mobile Title */}
                    <div className="lg:hidden mb-6">
                        <h2 className="text-xl font-bold text-black mb-2">
                            Sign In
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Continue your 14-day free trial
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}

                    {/* Error Message */}
                    {loginError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {loginError}
                        </div>
                    )}

                    <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#000000] mb-2">
                                Your Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-3 sm:items-center mb-2">
                                <label className="text-sm font-medium mb-1 sm:mb-0">Password</label>
                                <a href="#" className="text-sm text-[#1A2B6C] hover:underline self-start sm:self-center">
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 sm:py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                                    required
                                    onKeyPress={handleKeyPress}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        {/* Log In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center bg-[#1A2B6C] cursor-pointer text-white py-3 sm:py-2 rounded-md hover:bg-[#142050] transition-colors duration-300 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed font-semibold touch-manipulation"
                        >
                           {isLoading ? 'Logging in...' : 'Log In'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center justify-center text-base text-gray-500">
                            or
                        </div>

                        {/* Google Sign-in */}
                        <div className="relative">
                            {/* Hidden Google Sign-In button container */}
                            <div id="google-signin-button" className="hidden"></div>
                            
                            {/* Visible Google Sign-in button */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full cursor-pointer border border-gray-300 py-3 sm:py-2 rounded-md flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation"
                            >
                                <Image
                                    src="/images/login/google.png"
                                    alt="Google"
                                    width={20}
                                    height={20}
                                />
                                <span className="text-[15px] font-semibold">
                                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                                </span>
                            </button>
                        </div>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-sm sm:text-base text-center text-[#9A9DA4] mt-6">
                        Don't have an account yet?{" "}
                        <button 
                            onClick={() => setShowRegistrationModal(true)}
                            className="text-[#1A2B6C] font-semibold hover:underline touch-manipulation"
                        >
                            Start free trial
                        </button>
                    </p>
                </div>
            </div>
            
            {/* Registration Modal */}
            <UserRegistrationModal 
                isOpen={showRegistrationModal}
                onClose={() => setShowRegistrationModal(false)}
                onSuccess={handleRegistrationSuccess}
            />
            </div>
            
            {/* Footer - Better mobile spacing */}
            <div className="mt-8 lg:mt-0">
                <Footer />
            </div>
        </div>
    );
};

export default LoginPage;