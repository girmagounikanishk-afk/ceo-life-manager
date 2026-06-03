'use client';

import { motion } from 'framer-motion';
import {
  Sun, Radio, Calendar, Users, Zap, Heart, Bell, ChevronRight
} from 'lucide-react';

export type Module = 'brief' | 'pulse' | 'calendar' | 'meetings' | 'decision' | 'health' | 'inbox';

const NAV = [
  { id: 'brief' as Module,    icon: Sun,      label: 'Morning Brief',   badge: null },
  { id: 'pulse' as Module,    icon: Radio,    label: 'Apple Pulse',     badge: '8' },
  { id: 'calendar' as Module, icon: Calendar, label: 'Today\'s Schedule', badge: null },
  { id: 'meetings' as Module, icon: Users,    label: 'Meeting Intel',   badge: '3' },
  { id: 'decision' as Module, icon: Zap,      label: 'Decision Lab',    badge: null },
  { id: 'health' as Module,   icon: Heart,    label: 'Health Command',  badge: null },
  { id: 'inbox' as Module,    icon: Bell,     label: 'Priority Inbox',  badge: '5' },
];

interface Props { active: Module; onChange: (m: Module) => void; }

export default function Sidebar({ active, onChange }: Props) {
  return (
    <aside className="w-56 flex-shrink-0 h-full flex flex-col" style={{ background: '#0d0d14', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-black text-white">A</div>
          <div>
            <div className="text-sm font-bold text-white">CEO OS</div>
            <div className="text-[10px] text-slate-500">Apple · Command Center</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 text-sm font-medium group relative ${
                isActive ? 'nav-active' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.20)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon className={`w-4 h-4 relative z-10 flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
              <span className="relative z-10 flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-500/30 text-blue-300' : 'bg-white/8 text-slate-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom — user */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-default">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold text-white">TC</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Tim Cook</div>
            <div className="text-[10px] text-slate-600 truncate">CEO, Apple Inc.</div>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-700" />
        </div>
      </div>
    </aside>
  );
}
