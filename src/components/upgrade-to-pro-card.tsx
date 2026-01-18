'use client';

import React from 'react';

type UpgradeToProCardProps = {
  text: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
  className?: string;
};

export default function UpgradeToProCard({
  text,
  actionLabel,
  onAction,
  icon,
  className = '',
}: UpgradeToProCardProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        {/* Icon - smaller and subtle */}
        <div className="flex-shrink-0 text-yellow-500">
          {icon || (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
        </div>
        
        {/* Text - smaller font, better tracking */}
        <p className="text-xs md:text-sm font-medium text-yellow-200/90 leading-tight text-center sm:text-left">
          {text}
        </p>
      </div>

      {/* Action Button - compact and high contrast */}
      <button
        onClick={onAction}
        className="whitespace-nowrap px-4 py-1.5 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold transition-all active:scale-95 shadow-lg shadow-yellow-900/20"
      >
        {actionLabel}
      </button>
    </div>
  );
}