'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-teal-600" />
              <span className="font-bold text-xl text-gray-800">ScheduleSync</span>
            </div>
            
            <Link
              href="/auth/signin"
              className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-teal-100 p-6 rounded-full">
              <Calendar className="w-16 h-16 text-teal-600" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Privacy First Scheduling
            <br />
            <span className="text-teal-600">Find Meeting Times</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Without the Hassle
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}