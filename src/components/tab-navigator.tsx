'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export type TabItem = { name: string; href: string };

type TabNavigatorProps = {
  tabs?: TabItem[];               // optional custom tabs
  showSignOut?: boolean;          // toggle sign-out button
  className?: string;
};

export default function TabNavigator({
  tabs = [
    { name: 'My Availability', href: '/availability' },
    { name: 'Group Availability', href: '/group_availability' },
    //{ name: 'Connections', href: '/connections' },
    { name: 'Settings', href: '/settings' },
  ],
  showSignOut = true,
  className = '',
}: TabNavigatorProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu visibility on mobile
  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <nav
      className={`bg-black/20 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 ${className}`}
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            {!menuOpen ? (
              <svg className="block h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              // Close icon
              <svg className="block h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>

          {/* Tabs: hidden on mobile unless menuOpen */}
          <ul
            id="primary-navigation"
            className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm font-medium h-full overflow-x-auto no-scrollbar whitespace-nowrap absolute sm:static top-16 left-0 right-0 bg-black/90 sm:bg-transparent z-50 sm:z-auto transition-transform transform sm:translate-x-0 ${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            } sm:flex`}
          >
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <li key={tab.name} className="h-full flex items-center flex-shrink-0 border-b-2 sm:border-b-0 border-transparent sm:border-transparent">
                  <Link
                    href={tab.href}
                    className={`flex transition-colors items-center text-gray-500 
                      hover:text-white text-sm font-medium bg-white/5 hover:bg-white/10 px-3 
                      py-2 rounded-lg border border-white/10 ${
                        isActive
                          ? 'text-white border-purple-500 bg-white/10'
                          : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-white/10'
                      }`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)} // close menu on link click (mobile)
                  >
                    {tab.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right-side actions */}
          <div className="hidden sm:flex items-center gap-4 flex-shrink-0 ml-4">
            {showSignOut && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-[10px] sm:text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap border border-white/10 px-3 py-1.5 rounded-md hover:bg-white/10"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Mobile sign out button below menu */}
        {showSignOut && menuOpen && (
          <div className="sm:hidden border-t border-white/10 mt-2 pt-2 flex justify-center">
            <button
              onClick={() => {
                signOut({ callbackUrl: '/' });
                setMenuOpen(false);
              }}
              className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap border border-white/10 px-3 py-1.5 rounded-md hover:bg-white/10"
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}