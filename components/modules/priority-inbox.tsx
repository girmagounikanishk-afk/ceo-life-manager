'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronRight, Archive, Forward, Clock, CheckCheck } from 'lucide-react';
import { priorityInbox } from '@/lib/mock-data';

type Action = 'act' | 'delegate' | 'defer' | 'archive';

const PRIORITY_STYLE: Record<string, { badge: string; dot: string; border: string }> = {
  critical: { badge: 'badge-critical', dot: 'bg-red-500', border: 'border-l-red-500' },
  high:     { badge: 'badge-high',     dot: 'bg-amber-500', border: 'border-l-amber-500' },
  medium:   { badge: 'badge-medium',   dot: 'bg-blue-400',  border: 'border-l-blue-400' },
  low:      { badge: 'badge-low',      dot: 'bg-slate-600', border: 'border-l-slate-600' },
};

export default function PriorityInbox() {
  const [actions, setActions] = useState<Record<number, Action>>({});
  const [expanded, setExpanded] = useState<number | null>(null);

  const doAction = (id: number, action: Action) => setActions(a => ({ ...a, [id]: action }));

  const active = priorityInbox.filter(m => !actions[m.id] || actions[m.id] === 'act');
  const archived = priorityInbox.filter(m => actions[m.id] === 'archive');
  const deferred = priorityInbox.filter(m => actions[m.id] === 'defer');

  const unread = priorityInbox.filter(m => !m.read && !actions[m.id]).length;

  return (
    <div className="h-full scroll-area p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-black text-white">Priority Inbox</h1>
          {unread > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/25">{unread} unread</span>}
        </div>
        <div className="flex gap-2 text-[10px] text-slate-500">
          <span className="px-2 py-1 rounded-lg bg-white/[0.03]">✓ {Object.values(actions).filter(a => a === 'act').length} actioned</span>
          <span className="px-2 py-1 rounded-lg bg-white/[0.03]">📦 {archived.length} archived</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Critical', count: priorityInbox.filter(m => m.priority === 'critical').length, color: 'text-red-400' },
          { label: 'High',     count: priorityInbox.filter(m => m.priority === 'high').length,     color: 'text-amber-400' },
          { label: 'Unread',   count: unread,  color: 'text-blue-400' },
          { label: 'Actioned', count: Object.keys(actions).length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="card rounded-xl p-3 text-center">
            <div className={`text-xl font-black ${s.color}`}>{s.count}</div>
            <div className="text-[10px] text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="space-y-2">
        <AnimatePresence>
          {priorityInbox.map((msg, i) => {
            const style = PRIORITY_STYLE[msg.priority] || PRIORITY_STYLE.low;
            const action = actions[msg.id];
            const isExpanded = expanded === msg.id;
            const isRead = msg.read || !!action;

            return (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: action === 'archive' ? 0.3 : 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`card rounded-xl overflow-hidden border-l-2 ${style.border} ${isRead ? 'opacity-60' : ''}`}
              >
                <button className="w-full flex items-start gap-3 p-4 text-left" onClick={() => setExpanded(isExpanded ? null : msg.id)}>
                  {/* Unread dot */}
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isRead ? 'bg-transparent' : style.dot}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-white">{msg.from}</span>
                      <span className="text-[10px] text-slate-600">{msg.role}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto ${style.badge}`}>{msg.priority.toUpperCase()}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-200 mb-1 truncate">{msg.subject}</div>
                    {!isExpanded && <p className="text-xs text-slate-500 truncate">{msg.preview}</p>}
                    {isExpanded && <p className="text-xs text-slate-400 leading-relaxed">{msg.preview}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-slate-600">{msg.time}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">{msg.tag}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-600 flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {/* Actions */}
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-4 pb-3 flex gap-2 border-t border-white/[0.05] pt-3">
                    <button onClick={() => doAction(msg.id, 'act')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${action === 'act' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'glass text-slate-400 hover:text-emerald-300 border border-white/[0.06]'}`}>
                      <CheckCheck className="w-3 h-3" />Act Now
                    </button>
                    <button onClick={() => doAction(msg.id, 'delegate')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass text-slate-400 hover:text-blue-300 border border-white/[0.06] transition-colors">
                      <Forward className="w-3 h-3" />Delegate
                    </button>
                    <button onClick={() => doAction(msg.id, 'defer')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass text-slate-400 hover:text-amber-300 border border-white/[0.06] transition-colors">
                      <Clock className="w-3 h-3" />Defer
                    </button>
                    <button onClick={() => doAction(msg.id, 'archive')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass text-slate-400 hover:text-slate-200 border border-white/[0.06] transition-colors">
                      <Archive className="w-3 h-3" />Archive
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
