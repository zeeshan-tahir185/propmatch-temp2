'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { updateUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          setError('No payment session found');
          setLoading(false);
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated()) {
          router.push('/login?redirect=payment/success&session_id=' + sessionId);
          return;
        }

        const token = localStorage.getItem('token');

        // Verify payment with backend
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/payment/success?session_id=${sessionId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setPaymentData(response.data);

        // Refresh user data to get updated plan information
        if (response.data?.status === 'success') {
          try {
            const userResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/profile`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            if (userResponse.data?.user) {
              updateUser(userResponse.data.user);
            }
          } catch (userError) {
            console.error('Error refreshing user data:', userError);
            // Don't fail the success page if user refresh fails
          }
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err.response?.data?.detail || 'Payment verification failed');
      } finally {
        setLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [searchParams, isAuthenticated, updateUser, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-[100px] flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Verifying your payment...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-[100px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-50 rounded-lg p-8">
              <div className="text-red-600 text-5xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Pricing
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-[100px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-50 rounded-lg p-8">
            <div className="text-green-600 text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful! 🎉</h1>
            <p className="text-gray-600 mb-2">{paymentData?.message}</p>
            
            {paymentData?.plan_name && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 font-semibold">
                  Welcome to {paymentData.plan_name}!
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Your subscription is now active and you have access to all premium features.
                </p>
              </div>
            )}
            
            {paymentData?.customer_email && (
              <p className="text-sm text-gray-500 mb-6">
                Confirmation sent to: {paymentData.customer_email}
              </p>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={() => window.location.href = '/dashboard/profile'}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Subscription
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-[100px] flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;