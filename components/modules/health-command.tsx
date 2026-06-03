'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Moon, Activity, Brain, Footprints, Wind } from 'lucide-react';
import { healthData } from '@/lib/mock-data';

function Ring({ value, max, color, label, sub }: { value: number; max: number; color: string; label: string; sub: string }) {
  const pct = value / max;
  const r = 36;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeDasharray={circ}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-white">{value}</span>
          <span className="text-[9px] text-slate-500">/{max}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-white">{label}</div>
        <div className="text-[10px] text-slate-500">{sub}</div>
      </div>
    </div>
  );
}

export default function HealthCommand() {
  const [energy, setEnergy] = useState(healthData.energy);
  const load = healthData.cognitiveLoad;
  const loadColor = load >= 80 ? '#ef4444' : load >= 60 ? '#f59e0b' : '#10b981';
  const recovery = healthData.recoveryScore;
  const recoveryColor = recovery >= 80 ? '#10b981' : recovery >= 60 ? '#f59e0b' : '#ef4444';

  const metrics = [
    { icon: Moon,      label: 'Sleep',      value: `${healthData.sleep}h`,  sub: healthData.sleepQuality,  color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
    { icon: Activity,  label: 'HRV',        value: `${healthData.hrv}ms`,   sub: 'Heart rate variability', color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
    { icon: Heart,     label: 'Resting HR', value: `${healthData.restingHR}bpm`, sub: 'Excellent for age',  color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
    { icon: Footprints,label: 'Steps',      value: healthData.steps.toLocaleString(), sub: `${Math.round(healthData.steps / healthData.stepGoal * 100)}% of goal`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Wind,      label: 'Mindful',    value: `${healthData.mindfulMinutes}m`, sub: 'Mindful minutes',  color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { icon: Brain,     label: 'Stand Hrs',  value: `${healthData.standHours}`,  sub: 'of 12 target',       color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  ];

  return (
    <div className="h-full scroll-area p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-400" />
        <h1 className="text-xl font-black text-white">Health Command</h1>
      </div>

      {/* Ring metrics */}
      <div className="card rounded-2xl p-6">
        <div className="flex items-center justify-around flex-wrap gap-6">
          <Ring value={energy} max={10} color="#8b5cf6" label="Energy" sub="Self-reported" />
          <Ring value={load} max={100} color={loadColor} label="Cog. Load" sub="Today's demand" />
          <Ring value={recovery} max={100} color={recoveryColor} label="Recovery" sub="Overall score" />
        </div>
      </div>

      {/* Energy slider */}
      <div className="card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">Energy Check-In</span>
          <span className="text-2xl font-black text-violet-400">{energy}/10</span>
        </div>
        <input type="range" min={1} max={10} value={energy} onChange={e => setEnergy(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none"
          style={{ background: `linear-gradient(to right, #8b5cf6 ${energy * 10}%, rgba(255,255,255,0.08) ${energy * 10}%)` }} />
        <div className="flex justify-between text-[10px] text-slate-600 mt-2">
          <span>Depleted</span><span>Peak Performance</span>
        </div>
        {energy <= 4 && <div className="mt-3 text-xs text-amber-400 bg-amber-500/8 px-3 py-2 rounded-lg border border-amber-500/15">⚠️ Low energy detected — consider moving high-stakes decisions to tomorrow morning.</div>}
        {energy >= 8 && <div className="mt-3 text-xs text-emerald-400 bg-emerald-500/8 px-3 py-2 rounded-lg border border-emerald-500/15">✓ Peak energy window — ideal time for your most important decisions.</div>}
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`card rounded-xl p-4 border ${m.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
              <span className="text-[10px] text-slate-500">{m.label}</span>
            </div>
            <div className={`text-xl font-black ${m.color} tabular-nums`}>{m.value}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">{m.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Recovery protocol */}
      <div className="card rounded-2xl p-5 border border-white/[0.05]">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recovery Protocol — Today</div>
        <div className="space-y-2">
          {[
            { time: '12:00', action: '60-min lunch break — no screens, no decisions', done: false },
            { time: '14:00', action: 'Protected deep work begins — DND mode on', done: false },
            { time: '18:30', action: '30-min walk — Apple Park trail', done: false },
            { time: '21:00', action: 'Wind-down: no email after 9pm', done: false },
            { time: '22:30', action: 'Sleep target — 7+ hours for tomorrow\'s board prep', done: false },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-xs text-slate-600 w-12 flex-shrink-0 tabular-nums">{r.time}</span>
              <span className={r.done ? 'line-through text-slate-600' : 'text-slate-400'}>{r.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
