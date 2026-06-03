'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Sparkles, RefreshCw, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { stockData, appleNews, meetings, healthData, CEO_NAME } from '@/lib/mock-data';
import { getGreeting } from '@/lib/utils';

export default function MorningBrief() {
  const [brief, setBrief] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    setBrief('');
    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: stockData, news: appleNews, meetings, health: healthData }),
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
          if (raw === '[DONE]') { setGenerated(true); break; }
          try { const { text } = JSON.parse(raw); setBrief(p => p + text); } catch {}
        }
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { generate(); }, []);

  const priorities = [
    { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'CRITICAL', text: 'OpenAI ChatGPT Phone announced — board will ask about AI differentiation at 9am' },
    { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'HIGH', text: 'TSMC yield at 69% — below 78% target. Backup allocation decision needed today' },
    { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'WIN', text: 'AAPL up 2.35% pre-market. Morgan Stanley raised PT to $240 post-earnings' },
  ];

  return (
    <div className="h-full scroll-area p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-black text-white">{getGreeting()}, {CEO_NAME}.</h1>
          </div>
          <p className="text-sm text-slate-500">Here&apos;s what matters most right now.</p>
        </div>
        <button onClick={generate} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-slate-400 hover:text-white transition-colors border border-white/[0.06]">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>

      {/* AI Brief */}
      <div className="card p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">AI Morning Brief</span>
          {loading && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
        </div>
        <p className="text-slate-300 leading-relaxed text-sm min-h-[60px]">
          {brief || (loading ? <span className="shimmer inline-block w-full h-4 rounded" /> : 'Click Regenerate to generate your brief.')}
          {!loading && brief && <span className="animate-pulse text-violet-400">▌</span>}
        </p>
      </div>

      {/* Priority items */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Top 3 Right Now</h2>
        <div className="space-y-3">
          {priorities.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-start gap-3 p-4 rounded-xl border ${p.bg}`}
            >
              <p.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.color}`} />
              <div>
                <span className={`text-[10px] font-black tracking-wider ${p.color} mr-2`}>{p.label}</span>
                <span className="text-sm text-slate-300">{p.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'AAPL', value: `$${stockData.price}`, sub: `+${stockData.changePct}%`, color: 'text-emerald-400' },
          { label: 'Market Cap', value: stockData.marketCap, sub: 'World\'s largest', color: 'text-blue-400' },
          { label: 'Meetings', value: meetings.filter(m => m.status === 'upcoming').length.toString(), sub: 'today', color: 'text-violet-400' },
          { label: 'Energy', value: `${healthData.energy}/10`, sub: 'Good', color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="card p-4 rounded-xl text-center">
            <div className={`text-lg font-black ${s.color} tabular-nums`}>{s.value}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-slate-500">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
