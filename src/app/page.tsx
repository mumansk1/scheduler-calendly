'use client';

import Head from 'next/head';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <>
      {/* Load Roboto from Google Fonts */}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="h-screen flex flex-col bg-black text-white overflow-hidden selection:bg-purple-500/30 font-['Roboto',sans-serif]">
        {/* Background Glows */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] pointer-events-none" />
        
        {/* Header */}
        <header className="relative z-10 flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">whenRUfree</span>
          </div>
          
          <nav className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="px-3 py-1.5 text-sm font-medium text-gray-400 border border-white/20 rounded-md hover:text-white hover:border-white/40 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="px-3 py-1.5 bg-white text-black text-sm font-semibold rounded-md hover:bg-gray-200 transition-all active:scale-95"
            >
              Sign Up
            </Link>
          </nav>
        </header>

        {/* Main Hero Section */}
        <main className="relative z-10 flex-grow flex flex-col justify-start items-center px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mt-12 md:mt-20"
          >
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-2">
              Scheduling for the <br />
              <span className="text-purple-400">privacy-conscious</span>
            </h1>

            {/* First Decorative line */}
            <span className="block w-20 h-[2px] bg-purple-400 rounded my-4" />

            {/* Subhead */}
            <h2 className="text-xl md:text-2xl font-medium text-purple-300/90 mb-4">
              Designed to coordinate time, not expose lives.
            </h2>

            {/* Second Decorative line */}
            <span className="block w-20 h-[2px] bg-purple-400 rounded mb-8" />

            {/* Body Text - Streamlined and punchy */}
            <div className="text-base md:text-lg text-purple-100/70 max-w-2xl mx-auto leading-relaxed mb-10">
              <p className="mb-2">Tired of the constant back-and-forth?</p>
              <p className="mb-2">
                <span className="text-white font-medium">whenRUfree</span> helps you move past{' '}
                <span className="italic">"Let's meet sometime"</span>
              </p>
              <p>to painlessly find time to connect.</p>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-10 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
              >
                Start Scheduling Free
              </Link>

              {/* Privacy microcopy - increased size */}
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Share only what's necessary, keep the rest strictly confidential.
              </p>
            </div>
          </motion.div>

          {/* Privacy Emphasis Section - Descriptions increased to text-sm */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-10 w-full max-w-5xl"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">Zero-Knowledge Sync</h3>
              <p className="text-sm text-gray-500">We never store your calendar data. We only calculate the gaps.</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">Obfuscated Availability</h3>
              <p className="text-sm text-gray-500">Recipients see "Free" or "Busy"—never your private event titles or locations.</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">Sovereign Data Control</h3>
              <p className="text-sm text-gray-500">Your schedule is your own. Revoke access to any link instantly, at any time.</p>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center text-gray-600 text-xs">
          © 2026 whenRUfree. Built for shared availability - not shared calendars.
        </footer>
      </div>
    </>
  );
}