'use client';

import React from 'react';
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

  return (
    <nav
      className={`bg-black/20 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 ${className}`}
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Tabs: allow horizontal scroll on small screens */}
          <ul className="flex items-center gap-2 sm:gap-6 text-sm font-medium h-full overflow-x-auto no-scrollbar whitespace-nowrap">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <li key={tab.name} className="h-full flex items-center flex-shrink-0">
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
                  >
                    {tab.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right-side actions */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
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
      </div>
    </nav>
  );
}