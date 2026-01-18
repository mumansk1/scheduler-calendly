'use client';

import { useEffect } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';

interface CalendlyEmbedProps {
  url: string;
  prefill?: {
    name?: string;
    email?: string;
  };
}

export function CalendlyEmbed({ url, prefill }: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const embedUrl = new URL(url);
  if (prefill?.name) {
    embedUrl.searchParams.set('name', prefill.name);
  }
  if (prefill?.email) {
    embedUrl.searchParams.set('email', prefill.email);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-800">Book an Appointment</h2>
        </div>
        <a
          href={embedUrl.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </a>
      </div>
      <div
        className="calendly-inline-widget"
        data-url={embedUrl.toString()}
        style={{ minWidth: '320px', height: '700px' }}
      />
    </div>
  );
}
