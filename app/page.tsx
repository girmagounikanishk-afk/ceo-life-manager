'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar, { type Module } from '@/components/sidebar';
import TopBar from '@/components/topbar';
import MorningBrief from '@/components/modules/morning-brief';
import ApplePulse from '@/components/modules/apple-pulse';
import CalendarView from '@/components/modules/calendar-view';
import MeetingIntel from '@/components/modules/meeting-intel';
import DecisionLab from '@/components/modules/decision-lab';
import HealthCommand from '@/components/modules/health-command';
import PriorityInbox from '@/components/modules/priority-inbox';

const MODULES: Record<Module, React.ComponentType> = {
  brief:    MorningBrief,
  pulse:    ApplePulse,
  calendar: CalendarView,
  meetings: MeetingIntel,
  decision: DecisionLab,
  health:   HealthCommand,
  inbox:    PriorityInbox,
};

export default function Dashboard() {
  const [active, setActive] = useState<Module>('brief');
  const ActiveModule = MODULES[active];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#07070a]">
      {/* Top bar */}
      <TopBar />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar active={active} onChange={setActive} />

        {/* Main content */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute inset-0 overflow-y-auto"
            >
              <ActiveModule />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
