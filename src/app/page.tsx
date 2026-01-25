import Head from 'next/head';
import WelcomeBanner from '@/components/welcome-banner';
import LoginForm from '@/components/login-form';
import LandingPanel from '@/components/landing-panel';
import Footer from '@/components/footer';


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
       
        <div className="relative z-10 w-full max-w-[832px] mx-auto px-4 sm:px-6 pt-4 flex flex-col gap-4">
          
          {/* TOP ROW: Welcome (Left) and Login (Right) */}
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-8 w-full">
            {/* WelcomeBanner - Anchored to the left edge */}
            <div className="flex-1 flex items-center justify-start text-left">
              <WelcomeBanner className="flex-col justify-center text-left text-gray-300" showTagline={true} />
            </div>

            {/* LoginForm - Fixed width on the right edge */}
            <div className="w-full md:w-[360px] flex-shrink-0">
              <LoginForm />
            </div>
          </div>

          {/* LANDING PANEL: Spans the full width of the container above */}
          <main className="w-full">
            <div className="w-full">
              <LandingPanel />
            </div>
          </main>
        </div>

      { /* Footer */ }
        <footer className="mt-auto relative z-10 py-6 text-center text-gray-500 text-[10px] uppercase tracking-widest">
          <Footer />
        </footer>
      </div>
    </>
  );
} 