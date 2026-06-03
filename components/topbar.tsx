'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Brain, Clock } from 'lucide-react';
import { stockData, healthData } from '@/lib/mock-data';
import { today } from '@/lib/utils';

export default function TopBar() {
  const [time, setTime] = useState('');
  const [load] = useState(healthData.cognitiveLoad);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const isUp = stockData.change > 0;
  const loadColor = load >= 80 ? 'text-red-400' : load >= 60 ? 'text-amber-400' : 'text-emerald-400';
  const loadBar = load >= 80 ? 'bg-red-500' : load >= 60 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <header className="h-12 flex-shrink-0 flex items-center justify-between px-5" style={{ background: '#0d0d14', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Date */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-slate-400 font-medium">{today()}</span>
      </div>

      {/* Center — AAPL stock */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
          <span className="text-xs font-bold text-white">AAPL</span>
          <span className="text-sm font-black text-white tabular-nums">${stockData.price.toFixed(2)}</span>
          <span className={`flex items-center gap-0.5 text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isUp ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePct.toFixed(2)}%)
          </span>
          <span className="text-[10px] text-slate-600 bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-medium">PRE</span>
        </div>
      </div>

      {/* Right — cognitive load + time */}
      <div className="flex items-center gap-4">
        {/* Cognitive load */}
        <div className="flex items-center gap-2">
          <Brain className={`w-3.5 h-3.5 ${loadColor}`} />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500">Cognitive Load</span>
            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${load}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full ${loadBar}`}
              />
            </div>
            <span className={`text-xs font-bold tabular-nums ${loadColor}`}>{load}%</span>
          </div>
        </div>

        {/* Clock */}
        <div className="text-sm font-mono text-slate-300 tabular-nums">{time}</div>
      </div>
    </header>
  );
}
