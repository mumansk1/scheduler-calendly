'use client';

import Image from 'next/image';

type WelcomeBannerProps = {
  className?: string;
};

export default function WelcomeBanner({ className = '' }: WelcomeBannerProps) {
  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <div className="flex items-center gap-4 mb-2">
        <Image
          src="/brand_logo.png"
          alt="whenRUfree logo"
          width={48}
          height={48}
          className="object-contain"
          priority
        />
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
          whenRUfree
        </h1>
      </div>

      <p className="text-purple-300 text-lg font-medium opacity-80">
        Welcome to the future of shared availability
      </p>
    </div>
  );
}