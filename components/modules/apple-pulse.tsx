'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Radio, TrendingUp, TrendingDown, Minus, AlertOctagon } from 'lucide-react';
import { appleNews } from '@/lib/mock-data';

const CATEGORIES = ['All', 'Competitor', 'Stock', 'Regulatory', 'Product', 'Supply Chain', 'Analyst'];

export default function ApplePulse() {
  const [filter, setFilter] = useState('All');
  const [read, setRead] = useState<Set<number>>(new Set(appleNews.filter(n => n.read).map(n => n.id)));

  const filtered = filter === 'All' ? appleNews : appleNews.filter(n => n.category === filter);

  const SentimentIcon = ({ s }: { s: string }) => {
    if (s === 'positive') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    if (s === 'negative') return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  const priorityStyle: Record<string, string> = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
  };

  return (
    <div className="h-full scroll-area p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-black text-white">Apple Pulse</h1>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <span className="text-xs text-slate-500">Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {/* Sentiment summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Positive', count: appleNews.filter(n => n.sentiment === 'positive').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Negative', count: appleNews.filter(n => n.sentiment === 'negative').length, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Critical', count: appleNews.filter(n => n.priority === 'critical').length, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map(s => (
          <div key={s.label} className={`card p-3 rounded-xl border text-center ${s.bg}`}>
            <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label} stories</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === c ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'glass text-slate-500 hover:text-slate-300 border border-white/[0.05]'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* News feed */}
      <div className="space-y-2">
        {filtered.map((item, i) => {
          const isRead = read.has(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setRead(r => { const n = new Set(r); n.add(item.id); return n; })}
              className={`card card-hover rounded-xl p-4 cursor-pointer ${isRead ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                {item.priority === 'critical' && <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <SentimentIcon s={item.sentiment} />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${priorityStyle[item.priority] || 'badge-low'}`}>
                      {item.priority.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">{item.category}</span>
                    {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-auto" />}
                  </div>
                  <p className={`text-sm leading-snug mb-2 ${isRead ? 'text-slate-500' : 'text-slate-200'}`}>{item.headline}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600">
                    <span className="font-medium text-slate-500">{item.source}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
