'use client';

import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden selection:bg-purple-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] pointer-events-none" />
      
      {/* Vercel-Style Header */}
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

      {/* Main Hero Section - Centered for Single Screen */}
      <main className="relative z-10 flex-grow flex flex-col justify-center items-center px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Scheduling for the <br /> privacy-conscious.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The seamless way to find shared availability without exposing your entire life. 
            Share only what's necessary, keep the rest strictly confidential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Start Scheduling Free
            </Link>
          </div>
        </motion.div>

        {/* Privacy Emphasis Section - Descriptive & Compact */}
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
            <p className="text-xs text-gray-500">We never store your calendar data. We only calculate the gaps.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm">Obfuscated Availability</h3>
            <p className="text-xs text-gray-500">Recipients see "Free" or "Busy"—never your private event titles or locations.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm">Sovereign Data Control</h3>
            <p className="text-xs text-gray-500">Your schedule is your own. Revoke access to any link instantly, at any time.</p>
          </div>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-600 text-xs">
        © 2026 whenRUfree. Built with privacy as a human right.
      </footer>
    </div>
  );
}