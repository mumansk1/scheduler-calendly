'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CalendarView } from '@/components/calendar-view';
import { CalendlyEmbed } from '@/components/calendly-embed';
import { Calendar, Plus, RefreshCw, LogOut, User as UserIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [calendlyUser, setCalendlyUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [activeView, setActiveView] = useState<'calendar' | 'book'>('calendar');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status, router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Calendly user
      const userResponse = await fetch('/api/calendly/user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCalendlyUser(userData?.user);
      }

      // Fetch events
      const eventsResponse = await fetch('/api/calendly/events');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData?.events || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Appointment Manager</h1>
                <p className="text-sm text-gray-600">Manage your therapy appointments</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle and Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'calendar'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Calendar View
            </button>
            <button
              onClick={() => setActiveView('book')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'book'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-5 h-5" />
              Book Appointment
            </button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'calendar' ? (
            <CalendarView
              events={events}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          ) : (
            calendlyUser?.scheduling_url && (
              <CalendlyEmbed
                url={calendlyUser.scheduling_url}
                prefill={{
                  name: session?.user?.name || '',
                  email: session?.user?.email || '',
                }}
              />
            )
          )}
        </motion.div>

        {/* Stats Section */}
        {activeView === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Appointments</h3>
              <p className="text-3xl font-bold text-teal-600">{events?.length || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Appointments</h3>
              <p className="text-3xl font-bold text-blue-600">
                {events?.filter((e: any) => e?.status?.toLowerCase() === 'active')?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Cancelled Appointments</h3>
              <p className="text-3xl font-bold text-red-600">
                {events?.filter((e: any) => e?.status?.toLowerCase() === 'canceled')?.length || 0}
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
