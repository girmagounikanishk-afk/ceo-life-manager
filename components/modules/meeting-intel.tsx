'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, ChevronUp, AlertTriangle, Sparkles, Loader2, FileText, Clock } from 'lucide-react';
import { meetings } from '@/lib/mock-data';
import { formatTime } from '@/lib/utils';

export default function MeetingIntel() {
  const [expanded, setExpanded] = useState<number | null>(1);
  const [aiPreps, setAiPreps] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const filtered = meetings.filter(m => m.status === tab);

  const generatePrep = async (meeting: typeof meetings[0]) => {
    setLoading(l => ({ ...l, [meeting.id]: true }));
    setAiPreps(p => ({ ...p, [meeting.id]: '' }));
    try {
      const res = await fetch('/api/meeting-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeting }),
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;
          try { const { text } = JSON.parse(raw); setAiPreps(p => ({ ...p, [meeting.id]: (p[meeting.id] || '') + text })); } catch {}
        }
      }
    } catch {}
    setLoading(l => ({ ...l, [meeting.id]: false }));
  };

  const sentimentColor: Record<string, string> = {
    'high-stakes': 'border-red-500/30 bg-red-500/5',
    'positive': 'border-emerald-500/30 bg-emerald-500/5',
    'normal': 'border-white/[0.06] bg-transparent',
  };

  return (
    <div className="h-full scroll-area p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-400" />
        <h1 className="text-xl font-black text-white">Meeting Intel</h1>
      </div>

      {/* Tab */}
      <div className="flex gap-2">
        {(['upcoming', 'past'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'glass text-slate-500 hover:text-slate-300 border border-white/[0.05]'}`}>
            {t === 'upcoming' ? '📅 Upcoming' : '📋 Past Memos'}
            <span className="ml-2 text-xs opacity-60">({meetings.filter(m => m.status === t).length})</span>
          </button>
        ))}
      </div>

      {/* Meeting list */}
      <div className="space-y-3">
        {filtered.map((meeting, i) => {
          const isExpanded = expanded === meeting.id;
          const hasAiPrep = !!aiPreps[meeting.id];
          const isLoading = loading[meeting.id];

          return (
            <motion.div key={meeting.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`card rounded-2xl overflow-hidden border ${sentimentColor[meeting.sentiment] || sentimentColor.normal}`}>

              {/* Header */}
              <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setExpanded(isExpanded ? null : meeting.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{meeting.title}</div>
                    <div className="text-xs text-slate-500">{meeting.status === 'upcoming' ? formatTime(meeting.time) : meeting.lastDate} · {meeting.duration}min · {meeting.attendees.length} attendees</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {meeting.riskFlags.length > 0 && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="px-4 pb-4 space-y-4 border-t border-white/[0.05] pt-4">

                    {/* Attendees */}
                    <div>
                      <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Attendees</div>
                      <div className="flex flex-wrap gap-2">
                        {meeting.attendees.map(a => (
                          <div key={a.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500/30 to-violet-500/30 flex items-center justify-center text-[9px] font-bold text-white">
                              {a.name[0]}
                            </div>
                            <div>
                              <div className="text-xs font-medium text-white">{a.name}</div>
                              <div className="text-[9px] text-slate-600">{a.role}</div>
                            </div>
                            <div className="ml-auto text-[9px] font-bold text-emerald-400">{a.reliability}%</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Agenda */}
                    {meeting.agenda.length > 0 && (
                      <div>
                        <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Agenda</div>
                        <div className="space-y-1">
                          {meeting.agenda.map((item, j) => (
                            <div key={j} className="flex items-start gap-2 text-sm text-slate-400">
                              <span className="text-slate-600 flex-shrink-0">{j + 1}.</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk flags */}
                    {meeting.riskFlags.length > 0 && (
                      <div>
                        <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">⚠️ Risk Flags</div>
                        <div className="space-y-1.5">
                          {meeting.riskFlags.map((flag, j) => (
                            <div key={j} className="flex items-start gap-2 text-xs text-amber-400/80 bg-amber-500/8 px-3 py-2 rounded-lg border border-amber-500/15">
                              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              {flag}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Last memo */}
                    <div>
                      <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />Last Memo · {meeting.lastDate}
                      </div>
                      <p className="text-xs text-slate-400 bg-white/[0.02] rounded-lg p-3 border border-white/[0.04] leading-relaxed">{meeting.lastMemo}</p>
                    </div>

                    {/* AI prep */}
                    {meeting.status === 'upcoming' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[10px] text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-violet-400" />AI Prep Brief
                          </div>
                          <button onClick={() => generatePrep(meeting)}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/25 hover:bg-violet-500/25 transition-colors">
                            {isLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                            {isLoading ? 'Generating…' : hasAiPrep ? 'Regenerate' : 'Generate Brief'}
                          </button>
                        </div>
                        {(hasAiPrep || isLoading) && (
                          <div className="text-xs text-slate-300 bg-violet-500/5 rounded-lg p-3 border border-violet-500/15 leading-relaxed whitespace-pre-wrap">
                            {aiPreps[meeting.id] || <span className="shimmer inline-block w-full h-3 rounded" />}
                          </div>
                        )}
                        {!hasAiPrep && !isLoading && (
                          <p className="text-xs text-slate-500 italic">Click &quot;Generate Brief&quot; for an AI-powered 60-second prep using past meeting memos.</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
