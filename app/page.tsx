'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      {/* NAV */}
      <nav className="relative border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <Calendar className="w-5 h-5 text-purple-400" />
            WhenAreYouFree
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-gray-400 hover:text-white transition"
            >
              Log in
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Privacy-first scheduling
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight max-w-5xl mx-auto">
            Find meeting times
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              without the chaos
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Share your availability without exposing your calendar.
            <br />
            No more email tennis. Just simple scheduling.
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex gap-4 justify-center items-center flex-wrap"
          >
            <Link
              href="/auth/signin"
              className="group inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg text-base font-semibold hover:bg-gray-100 transition shadow-2xl shadow-purple-500/20"
            >
              Start scheduling
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#features"
              className="inline-flex items-center px-8 py-4 rounded-lg text-base font-medium border border-white/10 hover:bg-white/5 transition backdrop-blur-xl"
            >
              See how it works
            </Link>
          </motion.div>
        </motion.div>

        {/* Visual Element */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-24 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            {/* Calendar mockup */}
            <div className="space-y-4">
              <div className="h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-white/10" />
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.01 }}
                    className={`h-16 rounded-lg ${
                      [3, 10, 17, 24].includes(i)
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent rounded-2xl pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative max-w-7xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for simplicity
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need. Nothing you don't.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Privacy first',
              description: 'Only availability is shared. Event details stay private.',
            },
            {
              title: 'Instant sync',
              description: 'Connects with Google Calendar. Always up to date.',
            },
            {
              title: 'Zero friction',
              description: 'One link. No accounts required for your guests.',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:bg-white/10 transition"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6 border border-white/10">
                <Check className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-7xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl p-16 text-center overflow-hidden"
        >
          {/* Animated gradient orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to simplify scheduling?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands who've ditched the back-and-forth.
            </p>

            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 bg-white text-black px-10 py-5 rounded-lg font-semibold hover:bg-gray-100 transition shadow-2xl shadow-purple-500/20"
            >
              Get started free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-gray-400">
              <Calendar className="w-5 h-5" />
              WhenAreYouFree
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} WhenAreYouFree
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}