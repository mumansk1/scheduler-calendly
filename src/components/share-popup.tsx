'use client';
import React, { useState } from 'react';

type SharePopupProps = {
  onClose: () => void;
  onShareMethod: (method: 'email' | 'text') => void;
  smsText?: string; // full message body to copy and prefill
};

export default function SharePopup({ onClose, onShareMethod, smsText = '' }: SharePopupProps) {
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(text);
      setCopyNotice('Copied to clipboard');
      setTimeout(() => setCopyNotice(null), 2000);
    } catch (err) {
      setCopyNotice('Copy failed');
      setTimeout(() => setCopyNotice(null), 2000);
    } finally {
      setIsCopying(false);
    }
  };

  const smsHref = (body: string) => {
    return `sms:&body=${encodeURIComponent(body)}`;
  };

  const handleTextShare = async () => {
    const finalMessage = smsText || '';

    if (finalMessage) {
      await copyToClipboard(finalMessage);
    }

    try {
      window.location.href = smsHref(finalMessage);
    } catch (err) {
      window.location.href = 'sms:';
    }

    onShareMethod('text');
    onClose();
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('My Availability');
    const body = encodeURIComponent(smsText || '');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onShareMethod('email');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-popup-title"
    >
      <div className="bg-gray-900 rounded-2xl p-5 sm:p-8 w-full max-w-3xl text-white shadow-2xl relative border border-white/10 max-h-[90vh] overflow-y-auto">
        <h2 id="share-popup-title" className="text-lg sm:text-2xl font-bold mb-4 text-center">
          Share your availability
        </h2>

        {/* Buttons row */}
        <div className="mb-4">
          <div className="flex gap-3">
            <button
              onClick={handleEmailShare}
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 active:scale-[0.98] transition-all rounded-xl font-bold shadow-md text-center"
              aria-label="Share via email"
            >
              Share via Email
            </button>

            <button
              onClick={handleTextShare}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 active:scale-[0.98] transition-all rounded-xl font-bold shadow-md text-center"
              aria-label="Share via text"
            >
              Share via Text
            </button>

            <button
              onClick={onClose}
              className="flex-shrink-0 px-4 py-3 text-gray-300 hover:text-white active:scale-[0.98] transition-all rounded-xl border border-white/5 bg-transparent"
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Message Preview Header */}
        <div className="mb-2 px-1">
          <h3 className="font-semibold text-sm text-gray-300">Message Preview</h3>
        </div>

        {/* Preview area */}
        <div className="bg-black/40 rounded-xl p-4 text-sm text-gray-200 min-h-[160px] max-h-[50vh] overflow-auto whitespace-pre-wrap break-words border border-white/5 font-mono leading-relaxed">
          {smsText ? (
            <pre className="whitespace-pre-wrap text-sm m-0">{smsText}</pre>
          ) : (
            <div className="text-gray-500 italic text-center py-8">
              No availability selected yet.
            </div>
          )}
        </div>

        {/* Message length and copy text UNDER the preview window */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="text-xs text-gray-400">
            {smsText ? (
              <span>Message length: {smsText.length} characters</span>
            ) : (
              <span>Nothing to share</span>
            )}
          </div>
          <button
            onClick={() => smsText && copyToClipboard(smsText)}
            className="text-xs text-purple-300 hover:text-purple-200 underline font-medium"
            disabled={!smsText || isCopying}
          >
            {isCopying ? 'Copying…' : 'Copy text'}
          </button>
        </div>

        {/* Toast Notification */}
        {copyNotice && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm z-[110]">
            {copyNotice}
          </div>
        )}
      </div>
    </div>
  );
}