// src/app/page.tsx (or your Page file)
import Head from 'next/head';
import WelcomeBanner from '@/components/welcome-banner';
import LoginForm from '@/components/login-form';
import LandingPanel from '@/components/landing-panel';

export default function Page() {
  return (
    <>
      <Head>
        <title>whenRUfree — Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white selection:bg-purple-300/20 font-['Inter',sans-serif] relative overflow-x-hidden">
        {/* Background glow with muted purple */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% -20%, rgba(107, 70, 193, 0.3), transparent)',
          }}
        />

        {/* Main Content Wrapper - Custom width [832px] */}
        <div className="relative z-10 w-full max-w-[832px] mx-auto px-4 sm:px-6 pt-4">
          {/* Grid: left flexible column + right fixed 300px column on md+; stacked on small screens */}
          <div className="w-full grid gap-6 md:grid-cols-[1fr_300px] items-start">
            {/* WelcomeBanner (left) */}
            <div className="order-1 md:order-1 flex items-center">
              <WelcomeBanner
                className="flex-col justify-center text-left text-gray-300"
                showTagline={true}
              />
            </div>

            {/* LoginForm - fixed 300px column on md+ */}
            <div className="order-2 md:order-2 flex items-start justify-end">
              <div className="w-full md:w-[300px]">
                <LoginForm />
              </div>
            </div>

            {/* LandingPanel: spans full grid width but inner wrapper right-aligned
                and constrained to the left-column width (832 - 300 = 532px)
                so its right edge lines up with the LoginForm's right edge on md+ */}
            <div className="order-3 md:order-3 md:col-span-2 flex">
              <div className="w-full md:ml-auto md:max-w-[532px]">
                <LandingPanel />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-auto relative z-10 py-6 text-center text-gray-500 text-[10px] border-t border-white/10 uppercase tracking-widest">
          © 2026 whenRUfree. A secure, fast and simple way to share availability.
        </footer>
      </div>
    </>
  );
}