'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaChartBar,
  FaLock,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const UserProfilePage = () => {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const router = useRouter();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const [usageStats, setUsageStats] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Form states
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?redirect=dashboard/profile');
      return;
    }
    
    fetchUserData();
  }, []);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || ''
      });
    }
  }, [user]);

  const fetchUserData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      // Fetch user profile, usage stats, and subscription info in parallel
      const [profileRes, usageRes, billingRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/profile`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/usage`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/payment/billing-info`)
      ]);

      if (profileRes.data?.user) {
        updateUser(profileRes.data.user);
      }

      if (usageRes.data) {
        setUsageStats(usageRes.data);
      }

      if (billingRes.data) {
        setSubscriptionInfo(billingRes.data);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Auto-refresh usage data every 30 seconds
  useEffect(() => {
    if (!isAuthenticated()) return;
    
    const interval = setInterval(() => {
      fetchUserData(false); // Don't show loading spinner for auto-refresh
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/profile`,
        profileForm
      );

      if (response.data?.user) {
        updateUser(response.data.user);
        setSuccessMessage('Profile updated successfully!');
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ profile: error.response?.data?.detail || 'Failed to update profile' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validate passwords match
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setErrors({ password: 'New passwords do not match' });
      return;
    }

    // Validate password strength
    if (passwordForm.new_password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters long' });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/change-password`,
        {
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password
        }
      );

      setSuccessMessage('Password changed successfully!');
      setPasswordChangeMode(false);
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ password: error.response?.data?.detail || 'Failed to change password' });
    }
  };

  const handleUnsubscribe = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/payment/cancel-subscription`
      );
      
      setSuccessMessage('Subscription cancelled successfully. You will retain access until the end of your billing period.');
      fetchUserData(); // Refresh data
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setErrors({ subscription: error.response?.data?.detail || 'Failed to cancel subscription' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanDisplayName = (planType) => {
    switch (planType) {
      case 'trial': return 'Free Trial';
      case 'basic': return 'Basic Plan';
      case 'pro': return 'Pro Plan';
      default: return 'Unknown Plan';
    }
  };

  const getPlanPrice = (planType) => {
    switch (planType) {
      case 'trial': return '$0.00';
      case 'basic': return '$99.00';
      case 'pro': return '$299.00';
      default: return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account & Billing</h1>
        <p className="text-gray-600 mt-2">Manage your profile, subscription, and account settings</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Profile Information
                </h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {editMode ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone_number}
                      onChange={(e) => setProfileForm({...profileForm, phone_number: e.target.value})}
                      placeholder="(123) 456-7890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {errors.profile && (
                    <p className="text-red-600 text-sm">{errors.profile}</p>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <FaSave className="mr-2" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setErrors({});
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaUser className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {user?.first_name && user?.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : 'Not provided'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaEnvelope className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaPhone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user?.phone_number || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCalendarAlt className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">{formatDate(user?.created_at)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaLock className="mr-2 text-blue-600" />
                  Security
                </h2>
                {!passwordChangeMode && (
                  <button
                    onClick={() => setPasswordChangeMode(true)}
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    Change Password
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {passwordChangeMode ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {errors.password && (
                    <p className="text-red-600 text-sm">{errors.password}</p>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <FaSave className="mr-2" />
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordChangeMode(false);
                        setPasswordForm({
                          current_password: '',
                          new_password: '',
                          confirm_password: ''
                        });
                        setErrors({});
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-gray-600">
                  <p>Your password was last updated on {formatDate(user?.last_login_at)}</p>
                  <p className="text-sm mt-2">For security, we recommend changing your password regularly.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Subscription & Usage */}
        <div className="space-y-6">
          {/* Subscription Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaCreditCard className="mr-2 text-blue-600" />
                Subscription
              </h3>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  {subscriptionInfo?.current_plan?.display_name || getPlanDisplayName(user?.plan_type)}
                </div>
                <div className="text-xl text-blue-600 font-semibold">
                  {subscriptionInfo?.current_plan?.price ? `$${subscriptionInfo.current_plan.price}` : getPlanPrice(user?.plan_type)}/month
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${
                    user?.plan_type === 'trial' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {user?.plan_type === 'trial' ? 'Trial Active' : 'Active'}
                  </span>
                </div>
                
                {subscriptionInfo?.billing_dates?.plan_start_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan Started:</span>
                    <span className="font-medium">{subscriptionInfo.billing_dates.plan_start_date}</span>
                  </div>
                )}
                
                {subscriptionInfo?.billing_dates?.plan_end_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {user?.plan_type === 'trial' ? 'Trial Ends:' : 'Next Billing:'}
                    </span>
                    <span className="font-medium">{subscriptionInfo.billing_dates.plan_end_date}</span>
                  </div>
                )}

                {subscriptionInfo?.amount_paid > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="font-medium text-green-600">${subscriptionInfo.amount_paid}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {user?.plan_type === 'trial' ? (
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upgrade Plan
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => router.push('/pricing')}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Change Plan
                    </button>
                    <button
                      onClick={handleUnsubscribe}
                      className="w-full bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          {(usageStats || subscriptionInfo) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaChartBar className="mr-2 text-blue-600" />
                    Usage This Month
                  </h3>
                  <button
                    onClick={() => fetchUserData(false)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    title="Refresh usage data"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {subscriptionInfo?.usage && Object.entries(subscriptionInfo.usage).map(([key, data]) => {
                    const percentage = data.limit > 0 ? (data.current / data.limit) * 100 : 0;
                    const displayName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{displayName}</span>
                          <span className={percentage > 90 ? 'text-red-600 font-medium' : ''}>
                            {data.current}/{data.limit === -1 ? '∞' : data.limit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              percentage > 90 ? 'bg-red-500' : 
                              percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        {percentage > 90 && (
                          <p className="text-xs text-red-600 mt-1">
                            Nearing limit - consider upgrading your plan
                          </p>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Fallback to usageStats if subscriptionInfo not available */}
                  {!subscriptionInfo?.usage && usageStats?.usage && Object.entries(usageStats.usage).map(([key, data]) => {
                    const percentage = data.limit > 0 ? (data.used / data.limit) * 100 : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <span>
                            {data.used}/{data.limit === -1 ? '∞' : data.limit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              percentage > 90 ? 'bg-red-500' : 
                              percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <FaSignOutAlt className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;