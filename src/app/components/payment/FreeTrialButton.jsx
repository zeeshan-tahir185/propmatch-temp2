'use client';

import React, { useState } from 'react';
import axios from 'axios';

const FreeTrialButton = ({ buttonText = "Start Free Trial", onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFreeTrial = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login?redirect=dashboard';
        return;
      }

      // Check if user is already in free trial
      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const userData = userResponse.data;
      if (userData.subscription_status === 'trial') {
        // User is already in trial, redirect to dashboard
        window.location.href = '/dashboard';
        return;
      }

      // Start free trial
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/payment/start-free-trial`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Success - redirect to dashboard
      if (onSuccess) {
        onSuccess(response.data);
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err) {
      console.error('Free trial error:', err);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        // Token invalid, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login?redirect=dashboard';
        return;
      }
      
      if (err.response?.data?.detail === 'User already in free trial') {
        // User already has trial, redirect to dashboard
        window.location.href = '/dashboard';
        return;
      }
      
      setError(err.response?.data?.detail || err.message || 'Failed to start free trial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={handleFreeTrial}
        disabled={loading}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Starting Trial...
          </div>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default FreeTrialButton;