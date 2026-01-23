'use client';

import Image from 'next/image';

type WelcomeBannerProps = {
  className?: string;
  showTagline?: boolean;
};

export default function WelcomeBanner({ className = '', showTagline = true }: WelcomeBannerProps) {
  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        {/* 
           Outer div (h-12) matches text height.
           Inner div (h-20) shifted down by 8px (translate-y-2) 
           to align visually with the text.
        */}
        <div className="relative h-12 w-12 flex-shrink-0 flex items-center justify-center">
          <div className="absolute h-20 w-20 transform translate-y-2"> 
            <Image
              src="/brand_logo.png"
              alt="whenRUfree logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-300 leading-none">
          whenRUfree
        </h1>
      </div>
      
      {showTagline && (
        // moved down slightly with mt-3 (md:mt-4 for larger screens)
        <p className="mt-3 md:mt-4 text-white text-lg font-bold opacity-80 tracking-tight uppercase">
          Welcome to the future of shared availability
        </p>
      )}
    </div>
  );
}