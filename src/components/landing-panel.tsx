'use client';

export default function LandingPanel() {
  return (
    <div
      className="bg-white/5 backdrop-blur-md border border-white/10 text-white flex flex-col justify-center rounded-2xl p-6 md:p-10 h-full"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <main className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Prioritize human connection, <br />
          <span className="text-purple-400">not calendar management.</span>
        </h1>

        <section className="mb-6 text-gray-300 text-sm md:text-base leading-relaxed">
          <p className="font-semibold text-white mb-4">Scheduling personal time could be exhausting.</p>
          <div className="flex justify-center">
            <ul className="list-disc list-inside space-y-1 opacity-90 text-left">
              <li>Texts spiral.</li>
              <li>Context piles up.</li>
              <li>Everyone&apos;s overwhelmed.</li>
            </ul>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-base md:text-lg font-bold text-purple-300 mb-4">
            whenRUfree does the math&mdash;so you don&apos;t have to.
          </h2>
          <ul className="max-w-sm mx-auto text-left text-xs md:text-sm space-y-3">
            <li className="flex items-start gap-2">
              <span>🔗</span>
              <span>Share your availability with a simple link</span>
            </li>
            <li className="flex items-start gap-2">
              <span>⏰</span>
              <span>Let the app find overlapping times automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span>💬</span>
              <span>Set preferences without explaining yourself</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🔒</span>
              <span>Keep your personal details private</span>
            </li>
            <li className="flex items-start gap-2 text-gray-400">
              <span>❌</span>
              <span>No calendars to manage. No guilt. No overthinking.</span>
            </li>
          </ul>
        </section>

        <button className="mt-4 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all transform hover:scale-105 active:scale-95 text-sm">
          Share my availability
        </button>
      </main>
    </div>
  );
}