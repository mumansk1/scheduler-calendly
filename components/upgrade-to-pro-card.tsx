// components/upgrade-to-pro-card.tsx
import React from 'react';
import { Crown } from 'lucide-react';

type UpgradeToProCardProps = {
  text: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
  className?: string;
};

export default function UpgradeToProCard({
  text,
  actionLabel = 'Upgrade Now',
  onAction,
  href,
  className = '',
}: UpgradeToProCardProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full px-4 py-2 bg-gray-800 text-sm font-medium text-white border border-white/10 shadow-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <Crown className="w-5 h-5 text-purple-300 flex-shrink-0" />
      <span className="truncate">{text}</span>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold transition"
        >
          {actionLabel}
        </a>
      ) : (
        <button
          type="button"
          onClick={onAction}
          className="ml-3 bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}