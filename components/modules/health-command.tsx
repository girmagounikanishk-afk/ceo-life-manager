'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home, Clock, BarChart2, Target, MessageSquare, Settings,
  Bell, Heart, Activity, Droplets, ChevronDown, ChevronLeft, ChevronRight, Check
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────── */
const ACTIVITY = [
  { day: 'Sun', pct: 23 }, { day: 'Tue', pct: 55 }, { day: 'Wed', pct: 50 },
  { day: 'Thu', pct: 70 }, { day: 'Fri', pct: 40 }, { day: 'Sat', pct: 65 },
  { day: 'Mon', pct: 30 },
];

const CHALLENGES = [
  { label: '15,000 steps in a day', current: 12540, target: 15000, unit: 'steps', status: 'ongoing' },
  { label: '3L Water Drink in a day', current: 3,     target: 3,     unit: 'L',     status: 'complete' },
  { label: 'One hour exercise',       current: 40,    target: 60,    unit: 'Min',   status: 'ongoing' },
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_DATES = [18, 19, 20, 21, 22, 23, 24];

const NAV_ICONS = [Home, Clock, BarChart2, Target, MessageSquare, Settings];

/* ─── Donut ─────────────────────────────────────────── */
function Donut({ pct, color1, color2 }: { pct: number; color1: string; color2: string }) {
  const r = 52, cx = 64, cy = 64, stroke = 12;
  const circ = 2 * Math.PI * r;
  const filled1 = circ * (pct / 100);
  const filled2 = circ * 0.25;
  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
      <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color1} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - filled1 }}
        transform={`rotate(-90 ${cx} ${cy})`} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
      <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color2} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - filled2 }}
        transform={`rotate(${-90 + (pct / 100 * 360)} ${cx} ${cy})`} transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={22} fontWeight={800} fill="#1a1a1a">{pct}%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fill="#888">1034 ml</text>
    </svg>
  );
}

/* ─── Circular progress for challenges ──────────────── */
function CircleProgress({ pct, done }: { pct: number; done: boolean }) {
  const r = 16, circ = 2 * Math.PI * r;
  return (
    <div className="relative w-9 h-9 flex-shrink-0">
      <svg width={36} height={36} viewBox="0 0 36 36" className="-rotate-90">
        <circle cx={18} cy={18} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={3} />
        {!done && (
          <motion.circle cx={18} cy={18} r={r} fill="none"
            stroke={pct >= 100 ? '#5EC269' : '#4B9FE1'} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
        )}
      </svg>
      {done && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-[#5EC269] flex items-center justify-center">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Count-up hook ──────────────────────────────────── */
function useCountUp(target: number, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

/* ─── Main component ─────────────────────────────────── */
export default function HealthCommand() {
  const [activeNav, setActiveNav] = useState(0);
  const [activityView, setActivityView] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [overviewView, setOverviewView] = useState<'Monthly' | 'Weekly'>('Monthly');
  const [selectedDay, setSelectedDay] = useState(20);

  const bpm = useCountUp(108, 1200);
  const steps = useCountUp(12540, 1500);

  return (
    /* Outer wrapper — blurred room background */
    <div className="h-full w-full relative overflow-hidden flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #1a3a4a 0%, #2a5a6a 30%, #1a4a5a 60%, #0d2a3a 100%)' }}>

      {/* Blurred background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-teal-500/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex gap-4 h-full max-h-[640px]">

        {/* ── Left pill sidebar ── */}
        <div className="flex flex-col items-center justify-center gap-5 px-3 py-6 rounded-[28px]"
          style={{ background: 'rgba(15,25,35,0.75)', backdropFilter: 'blur(20px)', minWidth: 56 }}>
          {NAV_ICONS.map((Icon, i) => (
            <button key={i} onClick={() => setActiveNav(i)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeNav === i ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'
              }`}>
              <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            </button>
          ))}
        </div>

        {/* ── Main glass card ── */}
        <div className="flex-1 rounded-[28px] overflow-hidden flex flex-col"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.20)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-6 pb-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Lifestats</h1>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                <Bell className="w-4 h-4 text-white/70" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-black text-white shadow-lg">TC</div>
            </div>
          </div>

          {/* Top grid — 3 columns */}
          <div className="grid grid-cols-3 gap-4 px-7 pt-3 flex-1 min-h-0">

            {/* ── Activity ── */}
            <div className="rounded-[20px] p-4 flex flex-col" style={{ background: 'rgba(255,255,255,0.10)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">Activity</span>
                <button onClick={() => setActivityView(v => v === 'Weekly' ? 'Monthly' : 'Weekly')}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
                  {activityView} <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              {/* Pill bar chart */}
              <div className="flex-1 flex items-end gap-1.5 pb-1">
                {ACTIVITY.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ originY: 1, height: `${Math.max(d.pct * 0.9, 16)}px` }}
                      className={`w-full rounded-full relative ${d.pct >= 60 ? 'bg-[#5EC269]' : 'bg-white/20'}`}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-white/60 font-semibold">{d.pct}%</span>
                    </motion.div>
                    <span className="text-[9px] text-white/40">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Center stats ── */}
            <div className="flex flex-col gap-3">
              {[
                { icon: Heart,    color: '#E07070', label: 'Heart Rate', value: `${bpm}bpm` },
                { icon: Activity, color: '#7090E0', label: 'Distance',   value: '2.5km' },
                { icon: Droplets, color: '#70B0E0', label: 'Water',      value: '1.7l' },
              ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className="flex-1 rounded-[16px] flex items-center gap-3 px-4"
                  style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}22` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <div className="text-base font-black text-white">{value}</div>
                    <div className="text-[10px] text-white/40">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Overview donut ── */}
            <div className="rounded-[20px] p-4 flex flex-col" style={{ background: 'rgba(255,255,255,0.10)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">Overview</span>
                <button onClick={() => setOverviewView(v => v === 'Monthly' ? 'Weekly' : 'Monthly')}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
                  {overviewView} <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-3 flex-1">
                <Donut pct={75} color1="#F0C040" color2="#4B9FE1" />
                <div className="flex-1 space-y-2.5">
                  {[
                    { dot: '#F0C040', label: 'Calories Burn', value: '37.5', delta: '+1.27%' },
                    { dot: '#4B9FE1', label: 'Protein',       value: '37.5', delta: '+3.54%' },
                    { dot: '#A0A0A0', label: 'Carbs',         value: '25',   delta: '+1.34%' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                        <span className="text-[9px] text-white/40">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-3">
                        <span className="text-sm font-black text-white">{item.value}</span>
                        <span className="text-[9px] text-[#5EC269]">{item.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom grid — 2 columns */}
          <div className="grid grid-cols-2 gap-4 px-7 pb-6 pt-4">

            {/* ── Challenges ── */}
            <div className="rounded-[20px] p-4" style={{ background: 'rgba(255,255,255,0.10)' }}>
              <h3 className="text-sm font-bold text-white mb-3">Challenges</h3>
              <div className="space-y-2.5">
                {CHALLENGES.map((c, i) => {
                  const pct = Math.round((c.current / c.target) * 100);
                  const done = c.status === 'complete';
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <CircleProgress pct={pct} done={done} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{c.label}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-white/40">
                          {typeof c.current === 'number' && c.current >= 1000
                            ? `${c.current.toLocaleString()}/${c.target.toLocaleString()}`
                            : `${c.current}${c.unit}/${c.target}${c.unit}`}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          done
                            ? 'bg-[#5EC269] text-white'
                            : 'bg-[#5EC269]/20 text-[#5EC269]'
                        }`}>
                          {done ? 'Complete' : 'On Going'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Calendar + Output ── */}
            <div className="flex flex-col gap-3">
              {/* Calendar */}
              <div className="rounded-[20px] p-4 flex-1" style={{ background: 'rgba(255,255,255,0.10)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">June 2026</span>
                  <div className="flex gap-1">
                    <button className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                      <ChevronLeft className="w-3 h-3 text-white/50" />
                    </button>
                    <button className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                      <ChevronRight className="w-3 h-3 text-white/50" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {WEEK_DAYS.map(d => (
                    <div key={d} className="text-center text-[9px] text-white/30 font-medium pb-1">{d}</div>
                  ))}
                  {WEEK_DATES.map(date => (
                    <button key={date} onClick={() => setSelectedDay(date)}
                      className={`h-7 rounded-lg text-xs font-bold transition-all duration-150 ${
                        selectedDay === date
                          ? 'bg-[#5EC269] text-white shadow-lg shadow-[#5EC269]/30'
                          : 'text-white/60 hover:bg-white/10'
                      }`}>
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output */}
              <div className="rounded-[20px] p-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.10)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                    <span className="text-base">⚖️</span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">2.5 Kg</div>
                    <div className="text-[10px] text-white/40">Weight Loss</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">Monthly</span>
                  <ChevronDown className="w-3 h-3 text-white/30" />
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/70">amazing!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
