'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const StripeCheckout = ({ planName, priceId, planPrice, planDuration, buttonText, featured = false, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login?redirect=pricing';
        return;
      }

      // Get Stripe publishable key from backend
      const configResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/payment/pricing-config`
      );
      
      const { publishable_key } = configResponse.data;
      if (!publishable_key) {
        throw new Error('Stripe configuration not found');
      }

      // Initialize Stripe
      const stripe = await loadStripe(publishable_key);
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Create checkout session
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/payment/create-checkout-session`,
        {
          plan_name: planName,
          price_id: priceId,
          success_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/pricing`
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.detail || err.message || 'Checkout failed');
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
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
          featured
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default StripeCheckout;