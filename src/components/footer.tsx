'use client';

type FooterProps = {
  className?: string;
};

export default function Footer({ className = '' }: FooterProps) {
  return (
   
    <footer className="mt-auto relative z-10 py-6 text-center text-gray-500 text-[10px] border-t border-white/10 uppercase tracking-widest">
          © 2026 May Sky Horizons. whenRUfree - A aecure, fast and simple way to share availability.
    </footer>

    
      
  );
}