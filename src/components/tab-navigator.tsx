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
    //{ name: 'Dashboard', href: '/dashboard' },
    { name: 'My Availability', href: '/availability' },
    { name: 'Availability Match', href: '/dashboard' },
    { name: 'Connections', href: '/connections' },
    { name: 'Settings', href: '/settings' },
  ],
  showSignOut = true,
  className = '',
}: TabNavigatorProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`bg-[#0a0a0a] backdrop-blur-md border-b border-white/10 sticky top-0 z-50 ${className}`}
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Tabs: allow horizontal scroll on small screens */}
          <ul className="flex items-center gap-8 text-sm font-medium h-full overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <li key={tab.name} className="h-full flex items-center">
                  <Link
                    href={tab.href}
                    className={`transition-all duration-200 h-full flex items-center border-b-2 pt-0.5 px-1 ${
                      isActive
                        ? 'text-white border-purple-500'
                        : 'text-gray-400 border-transparent hover:text-gray-200'
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
          <div className="flex items-center gap-4">
            {showSignOut && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
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