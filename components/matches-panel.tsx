'use client';

import React, { useEffect, useState } from 'react';
import type { Person } from '@/data/mock-data';

type MatchResult = {
  idx: number;    // hour number (e.g., 9 or 14)
  time: string;   // raw time string (e.g., "9" or "14")
  label: string;  // formatted "HH:MM - HH:MM" (24h)
};

type MatchesPanelProps = {
  people: Person[];            
  selectedIds: string[];       
  dayIndex: number;
  onConfirm?: (timeRange: string) => void; 
};

export default function MatchesPanel({
  people,
  selectedIds,
  dayIndex,
  onConfirm,
}: MatchesPanelProps) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedIds || selectedIds.length === 0) {
      setMatches([]);
      setSelectedSlotIdx(null);
      return;
    }

    let cancelled = false;
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedIds, dayIndex }),
        });
        const data = await res.json();
        if (!cancelled) {
          setMatches(data.matches || []);
        }
      } catch (err) {
        console.error('Failed to fetch matches', err);
        if (!cancelled) setMatches([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMatches();
    setSelectedSlotIdx(null);
    return () => {
      cancelled = true;
    };
  }, [selectedIds, dayIndex]);

  const participants = people
    .filter((p) => selectedIds.includes(p.id))
    .map((p) => p.name ?? p.id);

  const selectedMatch = matches.find((m) => m.idx === selectedSlotIdx) ?? null;

  const makeEmailSubject = (match: MatchResult) => {
    if (!match) return '';
    return `Proposed meeting — ${match.label}`;
  };

  const makeEmailBody = (match: MatchResult) => {
    if (!match) return '';
    const names = participants.length ? participants.join(', ') : 'attendees';
    return [
      `Hi ${participants[0] ?? 'there'},`,
      '',
      `I'd like to propose we meet ${match.label}.`,
      '',
      `Attendees: ${names}`,
      '',
      'Please reply if that works for you or suggest another time.',
      '',
      'Thanks,',
      '[Your name]'
    ].join('\n');
  };

  const makeSmsBody = (match: MatchResult) => {
    if (!match) return '';
    const names = participants.length ? participants.join(', ') : 'attendees';
    return `Proposed meeting ${match.label} with ${names}. Reply if works.`;
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotice(`${label} copied`);
      window.setTimeout(() => setCopyNotice(null), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
      setCopyNotice('Copy failed');
      window.setTimeout(() => setCopyNotice(null), 2000);
    }
  };

  const handleOpenConfirm = () => {
    if (selectedSlotIdx === null) return;
    setShowConfirmModal(true);
  };

  const mailtoHref = (subject: string, body: string) => {
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const smsHref = (body: string) => {
    return `sms:&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="mt-6 w-full">
      {loading && (
        <div className="text-center text-purple-300 animate-pulse">Finding matches...</div>
      )}

      {!loading && matches.length === 0 && selectedIds.length > 0 && (
        <div className="rounded-md bg-white/5 border border-white/6 p-6 text-center text-gray-300 mt-6">
          <div className="text-xl font-semibold mb-2">No matches found</div>
          <div className="text-sm">There are no 1-hour slots today where everyone is free.</div>
        </div>
      )}

      {!loading && matches.length > 0 && (
        <>
          <div className="text-center mb-6 px-4">
            <h3 className="text-lg font-bold text-purple-300">
              There {matches.length === 1 ? 'is' : 'are'} {matches.length} match
              {matches.length === 1 ? '' : 'es'} when all of you are available
            </h3>
            
            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                onClick={handleOpenConfirm}
                disabled={selectedSlotIdx === null}
                className={`w-full max-w-md px-6 py-4 rounded-2xl font-bold transition text-lg shadow-lg ${selectedSlotIdx === null
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 active:scale-95'
                }`}
              >
                Confirm
              </button>
              
              <p className={`text-sm font-medium transition-colors duration-300 ${selectedSlotIdx === null ? 'text-purple-400/70' : 'text-emerald-400'}`}>
                {selectedSlotIdx === null 
                  ? '↓ Select a time below to confirm' 
                  : `Selected: ${selectedMatch?.label}`}
              </p>
            </div>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto px-2">
            {matches.map((match) => {
              const isSelected = selectedSlotIdx === match.idx;
              return (
                <button
                  key={match.idx}
                  onClick={() =>
                    setSelectedSlotIdx((prev) => (prev === match.idx ? null : match.idx))
                  }
                  className={`w-full px-4 py-4 rounded-2xl text-base md:text-lg font-bold transition-all border-2 flex items-center justify-center
                    ${isSelected
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                    }`}
                  aria-pressed={isSelected}
                >
                  {match.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Confirm / Message Modal */}
      {showConfirmModal && selectedMatch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-[#0b0720] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Share this match</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Copy the content below or open your messaging app.
                </p>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-white transition p-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Email section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-purple-300 uppercase tracking-wider">Email</div>
                  <div className="flex items-center gap-2">
                    <a
                      href={mailtoHref(makeEmailSubject(selectedMatch), makeEmailBody(selectedMatch))}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-200 border border-white/10 transition"
                    >
                      Open Mail
                    </a>
                    <button
                      onClick={() => copyText(`${makeEmailSubject(selectedMatch)}\n\n${makeEmailBody(selectedMatch)}`, 'Email')}
                      className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="bg-black/40 border border-white/6 rounded-xl p-4 text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  <span className="text-purple-400 font-bold">Subject:</span> {makeEmailSubject(selectedMatch)}
                  <div className="h-px bg-white/5 my-3" />
                  {makeEmailBody(selectedMatch)}
                </div>
              </div>

              {/* SMS section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-emerald-400 uppercase tracking-wider">SMS / Text</div>
                  <div className="flex items-center gap-2">
                    <a
                      href={smsHref(makeSmsBody(selectedMatch))}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-200 border border-white/10 transition"
                    >
                      Open SMS
                    </a>
                    <button
                      onClick={() => copyText(makeSmsBody(selectedMatch), 'SMS')}
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="bg-black/40 border border-white/6 rounded-xl p-4 text-sm text-gray-300 font-mono">
                  {makeSmsBody(selectedMatch)}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/6 bg-white/2 flex items-center justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-10 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 transition active:scale-95"
              >
                Close
              </button>
            </div>
          </div>

          {/* copy notice toast */}
          {copyNotice && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold animate-bounce">
              {copyNotice}
            </div>
          )}
        </div>
      )}
    </div>
  );
}