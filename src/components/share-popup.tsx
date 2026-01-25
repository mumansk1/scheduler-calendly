'use client';
import React from 'react';

type SharePopupProps = {
  onClose: () => void;
  onShareMethod: (method: 'email' | 'text') => void;
};

export default function SharePopup({ onClose, onShareMethod }: SharePopupProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-popup-title"
    >
      <div className="bg-gray-900 rounded-lg p-6 w-80 max-w-full text-center text-white shadow-lg">
        <h2 id="share-popup-title" className="text-xl font-semibold mb-4">
          Share your availability
        </h2>
        <p className="mb-6 text-gray-300">
          Choose how you want to share your availability:
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onShareMethod('email');
              onClose();
            }}
            className="bg-purple-700 hover:bg-purple-600 rounded py-2 font-semibold"
          >
            Share via Email
          </button>
          <button
            onClick={() => {
              onShareMethod('text');
              onClose();
            }}
            className="bg-green-700 hover:bg-green-600 rounded py-2 font-semibold"
          >
            Share via Text
          </button>
          <button
            onClick={onClose}
            className="mt-4 text-gray-400 hover:text-gray-200 underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}