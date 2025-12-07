'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center"
      >
        <div className="mx-auto bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <div className="bg-indigo-500 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">CA</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to ChatApp</h1>
        <p className="text-gray-600 mb-8">
          A modern chat application with real-time messaging, file sharing, and more.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Sign In
          </button>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-indigo-600 font-medium hover:text-indigo-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;