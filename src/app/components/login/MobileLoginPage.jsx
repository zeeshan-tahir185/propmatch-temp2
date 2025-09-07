"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import UserRegistrationModal from '../user/UserRegistrationModal';
import Footer from '../../shared/Footer';

const MobileLoginPage = () => {
    console.log('🚀 MobileLoginPage component mounted');
    
    const { login, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
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
            console.log('🔄 Mobile Login: Submitting form...', { email: formData.email });
            console.log('🌐 API URL:', process.env.NEXT_PUBLIC_API_URL);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('📡 Response status:', response.status);
            const data = await response.json();
            console.log('📦 Response data:', data);

            if (response.ok) {
                console.log('✅ Mobile Login successful');
                // Use auth context to handle login
                login(data.user, data.token);
                
                // Redirect to desired page
                router.push(getRedirectUrl());
            } else {
                console.error('❌ Mobile Login failed:', data.detail);
                setLoginError(data.detail || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('💥 Mobile Login network error:', error);
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
            if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
                setLoginError('Google Sign-In is not configured. Please contact support or use email login instead.');
                setIsLoading(false);
                return;
            }

            if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
                setLoginError('Google Sign-In configuration error. Please contact support or use email login instead.');
                setIsLoading(false);
                return;
            }

            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                    auto_select: false,
                    cancel_on_tap_outside: false,
                    use_fedcm_for_prompt: false
                });
                
                const buttonContainer = document.getElementById('google-signin-button-mobile');
                if (buttonContainer) {
                    buttonContainer.innerHTML = '';
                    
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
                    
                    setTimeout(() => {
                        const googleButton = buttonContainer.querySelector('[role="button"]');
                        if (googleButton) {
                            googleButton.click();
                        } else {
                            window.google.accounts.id.prompt((notification) => {
                                if (notification.isNotDisplayed()) {
                                    setLoginError('Google Sign-In is not available. Please use email login instead.');
                                    setIsLoading(false);
                                }
                            });
                        }
                    }, 100);
                } else {
                    window.google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed()) {
                            setLoginError('Google Sign-In is not available. Please use email login instead.');
                            setIsLoading(false);
                        }
                    });
                }
                
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
                login(data.user, data.token);
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
            setSuccessMessage(data.message || 'Registration successful! Please log in to continue.');
            setShowRegistrationModal(false);
        } else {
            login(data.user, data.token);
            router.push(getRedirectUrl());
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Mobile Header */}
            <div className="bg-[#1A2B6C] px-6 pt-8 pb-6">
                <div className="text-center">
                    {/* <div className="bg-green-500 text-white text-xs px-2 py-1 rounded mb-2 inline-block">
                        📱 MOBILE VERSION
                    </div> */}
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

            {/* Login Form - Full Width Mobile */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="mb-6">
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

                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex flex-col mb-2">
                                <label className="text-sm font-medium mb-1">Password</label>
                                <a href="#" className="text-sm text-[#1A2B6C] hover:underline self-start">
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
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none touch-manipulation"
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
                            className="w-full flex justify-center items-center bg-[#1A2B6C] cursor-pointer text-white py-3 rounded-md hover:bg-[#142050] transition-colors duration-300 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed font-semibold touch-manipulation"
                        >
                           {isLoading ? 'Logging in...' : 'Log In'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center justify-center text-base text-gray-500">
                            or
                        </div>

                        {/* Google Sign-in */}
                        <div className="relative">
                            <div id="google-signin-button-mobile" className="hidden"></div>
                            
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full cursor-pointer border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation"
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
                    <p className="text-sm text-center text-[#9A9DA4] mt-6">
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
            
            {/* Footer - Better mobile spacing */}
            <div className="mt-8">
                <Footer />
            </div>
        </div>
    );
};

export default MobileLoginPage;