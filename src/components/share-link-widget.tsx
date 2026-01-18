'use client';

import React from 'react';

type ShareLinkWidgetProps = {
  shareLink: string;
  label?: string;
  onCopy?: (text: string) => void;
  className?: string;
};

export default function ShareLinkWidget({
  shareLink,
  label = 'Copy this link to share when you are free',
  onCopy,
  className = '',
}: ShareLinkWidgetProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareLink);
      } else {
        const ta = document.createElement('textarea');
        ta.value = shareLink;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      onCopy?.(shareLink);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
      setCopied(false);
    }
  };

  return (
    <div
      className={`flex items-end gap-2 ${className}`}
      role="region"
      aria-label="Share link"
    >
      {/* Column 1: Label (centered over field) + Link Field */}
      <div className="flex flex-col items-center flex-1 min-w-0 max-w-[500px]">
        <span className="font-semibold text-purple-100 text-[10px] md:text-xs mb-1 text-center w-full truncate">
          {label}
        </span>
        <div
          className="w-full bg-black border border-white/10 rounded px-3 py-2 font-mono text-[10px] md:text-xs text-purple-200 truncate text-center"
          title={shareLink}
        >
          {shareLink}
        </div>
        
        {/* Copied indicator - absolute so it doesn't shift layout */}
        <div className="relative w-full h-0">
          <div aria-live="polite" className="absolute top-1 left-0 right-0 text-center text-[10px] text-emerald-400 font-bold">
            {copied ? 'Copied!' : null}
          </div>
        </div>
      </div>

      {/* Column 2: Copy Button (aligned to the bottom row) */}
      <button
        onClick={handleCopy}
        type="button"
        className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-4 py-2 rounded text-xs font-bold transition-all shadow-lg shadow-purple-900/20 flex-shrink-0 mb-[1px]"
      >
        Copy
      </button>
    </div>
  );
}