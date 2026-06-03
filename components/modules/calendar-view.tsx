'use client';

import { motion } from 'framer-motion';
import { Calendar, Shield, AlertTriangle } from 'lucide-react';
import { calendarEvents } from '@/lib/mock-data';
import { formatTime } from '@/lib/utils';

const DEMAND_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  high:   { bg: 'bg-red-500/10',     border: 'border-red-500/25',     text: 'text-red-300',     dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   text: 'text-amber-300',   dot: 'bg-amber-500' },
  low:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/25',    text: 'text-blue-300',    dot: 'bg-blue-400' },
  none:   { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-300', dot: 'bg-emerald-400' },
};

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'badge-critical',
  high:     'badge-high',
  medium:   'badge-medium',
  low:      'badge-low',
};

function getTimeFromStr(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();

export default function CalendarView() {
  const backToBack = calendarEvents.filter(e => e.type === 'meeting').length >= 4;
  const criticalCount = calendarEvents.filter(e => e.priority === 'critical').length;

  return (
    <div className="h-full scroll-area p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-400" />
          <h1 className="text-xl font-black text-white">Today&apos;s Schedule</h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500" />High demand</span>
          <span className="flex items-center gap-1 text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-500" />Medium</span>
          <span className="flex items-center gap-1 text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-400" />Recovery</span>
        </div>
      </div>

      {/* Alerts */}
      {backToBack && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-300 font-semibold">Back-to-back warning</p>
            <p className="text-xs text-amber-400/70">You have 4 consecutive meetings 9:00–12:00. No breaks detected — cognitive load will peak before your deep work block.</p>
          </div>
        </div>
      )}

      {/* Events */}
      <div className="relative space-y-2">
        {calendarEvents.map((event, i) => {
          const colors = DEMAND_COLORS[event.demand] || DEMAND_COLORS.none;
          const startMin = getTimeFromStr(event.time);
          const endMin = getTimeFromStr(event.end);
          const isCurrent = currentMinutes >= startMin && currentMinutes < endMin;
          const isPast = currentMinutes > endMin;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex gap-3 ${isPast ? 'opacity-40' : ''}`}
            >
              {/* Time column */}
              <div className="w-16 flex-shrink-0 pt-3 text-right">
                <span className="text-xs text-slate-500 tabular-nums">{formatTime(event.time)}</span>
              </div>

              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full mt-3.5 flex-shrink-0 ${isCurrent ? 'ring-2 ring-offset-1 ring-offset-[#07070a] ring-blue-400' : ''} ${colors.dot}`} />
                {i < calendarEvents.length - 1 && <div className="w-px flex-1 bg-white/5 mt-1" />}
              </div>

              {/* Event card */}
              <div className={`flex-1 mb-2 p-3.5 rounded-xl border ${colors.bg} ${colors.border} ${isCurrent ? 'ring-1 ring-blue-400/40' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {event.protected && <Shield className="w-3.5 h-3.5 text-purple-400" />}
                    <span className="text-sm font-semibold text-white">{event.title}</span>
                    {isCurrent && <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded-full font-bold">NOW</span>}
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${PRIORITY_BADGE[event.priority]}`}>
                    {event.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{formatTime(event.time)} – {formatTime(event.end)}</span>
                  {event.location && <span>· {event.location}</span>}
                </div>
                {event.attendees && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {event.attendees.map(a => (
                      <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{a}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
