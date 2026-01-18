'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, MapPin, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location?: {
    type: string;
    location?: string;
    join_url?: string;
  };
  invitees?: Array<{
    name: string;
    email: string;
    status: string;
    cancel_url?: string;
    reschedule_url?: string;
  }>;
}

interface CalendarViewProps {
  events: Event[];
  onRefresh: () => void;
  isLoading: boolean;
}

export function CalendarView({ events, onRefresh, isLoading }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [cancellingEvent, setCancellingEvent] = useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events?.filter((event) => {
      const eventDate = parseISO(event?.start_time || '');
      return isSameDay(eventDate, day);
    }) || [];
  };

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCancelEvent = async (eventUri: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancellingEvent(eventUri);
    try {
      const response = await fetch('/api/calendly/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventUri }),
      });

      if (response.ok) {
        setShowEventModal(false);
        setSelectedEvent(null);
        onRefresh();
      } else {
        const data = await response.json();
        alert(data?.error || 'Failed to cancel event');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel event');
    } finally {
      setCancellingEvent(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-teal-100 text-teal-700 border-teal-300';
      case 'canceled':
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays?.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.div
              key={day?.toISOString() || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`min-h-24 p-2 border rounded-lg ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${
                isToday ? 'border-teal-500 border-2' : 'border-gray-200'
              } hover:shadow-md transition-shadow`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
              } ${
                isToday ? 'text-teal-600 font-bold' : ''
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents?.slice(0, 2)?.map((event) => (
                  <button
                    key={event?.uri}
                    onClick={() => handleEventClick(event)}
                    className={`w-full text-left text-xs px-2 py-1 rounded border ${
                      getStatusColor(event?.status || '')
                    } hover:opacity-80 transition-opacity truncate`}
                  >
                    {format(parseISO(event?.start_time || ''), 'HH:mm')}
                  </button>
                ))}
                {(dayEvents?.length || 0) > 2 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{(dayEvents?.length || 0) - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Appointment Details</h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">{selectedEvent?.name}</p>
                    <p className="text-sm text-gray-600">
                      Status: <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedEvent?.status || '')}`}>
                        {selectedEvent?.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800">
                      {format(parseISO(selectedEvent?.start_time || ''), 'PPP')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(parseISO(selectedEvent?.start_time || ''), 'p')} -{' '}
                      {format(parseISO(selectedEvent?.end_time || ''), 'p')}
                    </p>
                  </div>
                </div>

                {selectedEvent?.invitees && selectedEvent.invitees.length > 0 && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Invitee</p>
                      {selectedEvent.invitees.map((invitee, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          <p>{invitee?.name}</p>
                          <p>{invitee?.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent?.location?.join_url && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Meeting Link</p>
                      <a
                        href={selectedEvent.location.join_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-600 hover:underline break-all"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {selectedEvent?.status?.toLowerCase() === 'active' && (
                <div className="flex gap-3 mt-6">
                  {selectedEvent?.invitees?.[0]?.reschedule_url && (
                    <a
                      href={selectedEvent.invitees[0].reschedule_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-center"
                    >
                      Reschedule
                    </a>
                  )}
                  <button
                    onClick={() => handleCancelEvent(selectedEvent?.uri || '')}
                    disabled={cancellingEvent === selectedEvent?.uri}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancellingEvent === selectedEvent?.uri ? 'Cancelling...' : 'Cancel Appointment'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
