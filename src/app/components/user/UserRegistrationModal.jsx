"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineClose } from "react-icons/ai";

const UserRegistrationModal = ({ isOpen, onClose, onSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone_number: ''
    });
    const [errors, setErrors] = useState({});

    // No longer fetching cities since location is removed

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Phone number validation (optional but if provided, must be valid)
        if (formData.phone_number && formData.phone_number.trim() !== '' && !isValidPhoneNumber(formData.phone_number)) {
            newErrors.phone_number = 'Please enter a valid Canadian phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidPhoneNumber = (phone) => {
        const patterns = [
            /^\+1-\d{3}-\d{3}-\d{4}$/,
            /^\(\d{3}\) \d{3}-\d{4}$/,
            /^\d{3}-\d{3}-\d{4}$/,
            /^\d{10}$/
        ];
        return patterns.some(pattern => pattern.test(phone));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const registrationData = {
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name || undefined,
                last_name: formData.last_name || undefined,
                phone_number: formData.phone_number || undefined
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();

            if (response.ok) {
                // Don't auto-login, just show success and redirect to login
                onSuccess && onSuccess({ 
                    ...data, 
                    shouldRedirectToLogin: true,
                    message: 'Registration successful! Please log in to continue.' 
                });
                onClose();
                
                // Reset form
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    first_name: '',
                    last_name: '',
                    phone_number: ''
                });
            } else {
                // Handle specific field errors from backend
                if (typeof data.detail === 'string') {
                    // Check for specific field errors in the message
                    if (data.detail.includes('email')) {
                        setErrors({ email: data.detail });
                    } else if (data.detail.includes('password')) {
                        setErrors({ password: data.detail });
                    } else if (data.detail.includes('phone')) {
                        setErrors({ phone_number: data.detail });
                    } else if (data.detail.includes('already exists')) {
                        setErrors({ email: 'An account with this email already exists.' });
                    } else {
                        setErrors({ general: data.detail });
                    }
                } else {
                    setErrors({ general: 'Registration failed. Please try again.' });
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setIsLoading(true);
            setErrors({});
            
            // Check for unsupported browsing modes
            if (window.navigator && window.navigator.webdriver) {
                setErrors({ general: 'Google signup is not available in this browsing mode. Please use email signup instead.' });
                setIsLoading(false);
                return;
            }
            
            // Load and initialize Google Sign-In
            if (typeof window !== 'undefined') {
                if (!window.google) {
                    const script = document.createElement('script');
                    script.src = 'https://accounts.google.com/gsi/client';
                    script.async = true;
                    script.defer = true;
                    
                    script.onload = () => {
                        setTimeout(() => initializeGoogleSignUp(), 500);
                    };
                    
                    script.onerror = () => {
                        setErrors({ general: 'Failed to load Google Sign-In. Please try email signup instead.' });
                        setIsLoading(false);
                    };
                    
                    document.head.appendChild(script);
                } else {
                    initializeGoogleSignUp();
                }
            }
        } catch (error) {
            console.error('Google sign up error:', error);
            setErrors({ general: 'Google sign up failed. Please try with email and password instead.' });
            setIsLoading(false);
        }
    };

    const initializeGoogleSignUp = () => {
        try {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                    auto_select: false,
                    cancel_on_tap_outside: false,
                    use_fedcm_for_prompt: false
                });
                
                // Create and render the sign-in button
                const buttonContainer = document.getElementById('google-signup-button');
                if (buttonContainer) {
                    buttonContainer.innerHTML = ''; // Clear existing content
                    
                    window.google.accounts.id.renderButton(
                        buttonContainer,
                        {
                            theme: 'outline',
                            size: 'large',
                            width: '100%',
                            text: 'signup_with',
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
                                    setErrors({ general: 'Google Sign-Up is not available. Please use email signup instead.' });
                                    setIsLoading(false);
                                }
                            });
                        }
                    }, 100);
                } else {
                    // Fallback to prompt method
                    window.google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed()) {
                            setErrors({ general: 'Google Sign-Up is not available. Please use email signup instead.' });
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
            console.error('Google Sign-Up initialization error:', error);
            setErrors({ general: 'Google Sign-Up is not available. Please use email signup instead.' });
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
                // For Google signup, check if it's a new user or existing user
                if (data.message && data.message.includes('registered')) {
                    // New user registration - redirect to login
                    onSuccess && onSuccess({ 
                        ...data, 
                        shouldRedirectToLogin: true,
                        message: 'Registration successful! Please log in to continue.' 
                    });
                } else {
                    // Existing user login - proceed normally
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    onSuccess && onSuccess(data);
                }
                onClose();
            } else {
                setErrors({ general: data.detail || 'Google sign up failed. Please try again.' });
            }
        } catch (error) {
            console.error('Google callback error:', error);
            setErrors({ general: 'Google sign up failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-black">
                            Start Your Free Trial
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>

                    {/* Error Message */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your email"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="First name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Last name"
                                />
                            </div>
                        </div>


                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                                    errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., 416-555-0123"
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                                Format: 416-555-0123 or (416) 555-0123
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1A2B6C] text-white py-3 rounded-md hover:bg-[#142050] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Start Free Trial'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center justify-center text-base my-4">
                            or
                        </div>

                        {/* Google Sign-up */}
                        <div className="relative">
                            {/* Hidden Google Sign-Up button container */}
                            <div id="google-signup-button" className="hidden"></div>
                            
                            <button
                                type="button"
                                onClick={handleGoogleSignUp}
                                disabled={isLoading}
                                className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="text-[15px] font-semibold">
                                    {isLoading ? 'Signing up...' : 'Sign up with Google'}
                                </span>
                            </button>
                        </div>
                    </form>

                    {/* Trial Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-md">
                        <h3 className="font-semibold text-sm text-blue-900 mb-2">
                            🎉 14-Day Free Trial Includes:
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• 10 property searches</li>
                            <li>• 1 AI outreach message</li>
                            <li>• 1 professional report generation</li>
                            <li>• 5 CRM uploads with 15 lead rankings each</li>
                        </ul>
                    </div>

                    {/* Login Link */}
                    <p className="text-base text-center text-gray-600 mt-6">
                        Already have an account?{" "}
                        <button 
                            onClick={onClose}
                            className="text-[#1A2B6C] font-semibold hover:underline"
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserRegistrationModal;