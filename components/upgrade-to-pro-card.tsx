'use client';

import React from 'react';

type UpgradeToProCardProps = {
  text: string;
  actionLabel: string;
  onAction?: () => void;
  icon?: React.ReactNode;
};

export default function UpgradeToProCard({
  text,
  actionLabel,
  onAction,
  icon,
}: UpgradeToProCardProps) {
  return (
    <div className="mx-auto max-w-xl rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 text-white p-4 shadow-lg border border-white/6">
      <div className="flex items-center gap-4">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          <div className="font-semibold">{text}</div>
        </div>
        <div>
          <button
            onClick={onAction}
            className="ml-4 bg-white text-black px-3 py-1.5 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}