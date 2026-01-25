'use client';
import React, { useState } from 'react';

type SharePopupProps = {
  onClose: () => void;
  onShareMethod: (method: 'email' | 'text') => void;
  smsText?: string; // full message body to copy and prefill
};

export default function SharePopup({ onClose, onShareMethod, smsText = '' }: SharePopupProps) {
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotice('Copied to clipboard');
      setTimeout(() => setCopyNotice(null), 2000);
    } catch (err) {
      setCopyNotice('Copy failed');
      setTimeout(() => setCopyNotice(null), 2000);
    }
  };

  const smsHref = (body: string) => {
    // Best-effort prefill for many mobile browsers
    return `sms:&body=${encodeURIComponent(body)}`;
  };

  const handleTextShare = async () => {
    // parent should pass the fully-constructed message in smsText
    const finalMessage = smsText;

    // copy the full message so the user can paste if the prefill doesn't work
    if (finalMessage) {
      await copyToClipboard(finalMessage);
    }

    // Try to open SMS composer with prefilled body (best-effort)
    try {
      window.location.href = smsHref(finalMessage);
    } catch (err) {
      // fallback to blank sms composer
      window.location.href = 'sms:';
    }

    onShareMethod('text');
    onClose();
  };

  const handleEmailShare = () => {
    onShareMethod('email');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-popup-title"
    >
      <div className="bg-gray-900 rounded-lg p-6 w-80 max-w-full text-center text-white shadow-lg relative">
        <h2 id="share-popup-title" className="text-xl font-semibold mb-4">
          Share your availability
        </h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleEmailShare}
            className="bg-purple-700 hover:bg-purple-600 rounded py-2 font-semibold"
          >
            Share via Email
          </button>

          <div>
            <button
              onClick={handleTextShare}
              className="bg-green-700 hover:bg-green-600 rounded py-2 font-semibold w-full"
            >
              Share via Text
            </button>
            <p className="mt-2 text-xs text-gray-400 max-w-xs mx-auto">
              The app link and your schedule will be copied. If your device supports a pre-filled text body the SMS app will open with the message already inserted. If not, just pick a recipient and paste the copied message.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-gray-400 hover:text-gray-200 underline"
          >
            Cancel
          </button>
        </div>

        {copyNotice && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded shadow-lg font-semibold">
            {copyNotice}
          </div>
        )}
      </div>
    </div>
  );
}