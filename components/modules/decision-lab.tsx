'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, ChevronRight, Target, AlertTriangle, TrendingUp, Users, Star, BookOpen } from 'lucide-react';
import { decisionScenarios } from '@/lib/mock-data';

interface Analysis {
  firstPrinciples: string;
  riskMap: string;
  opportunity: string;
  boardReaction: string;
  recommendation: string;
  precedent: string;
}

const LENSES = [
  { key: 'firstPrinciples', icon: Target,       label: 'First Principles',  color: 'text-blue-400',    bg: 'bg-blue-500/8 border-blue-500/15' },
  { key: 'riskMap',         icon: AlertTriangle, label: 'Risk Map',          color: 'text-red-400',     bg: 'bg-red-500/8 border-red-500/15' },
  { key: 'opportunity',     icon: TrendingUp,    label: 'Opportunity',       color: 'text-emerald-400', bg: 'bg-emerald-500/8 border-emerald-500/15' },
  { key: 'boardReaction',   icon: Users,         label: 'Board Reaction',    color: 'text-violet-400',  bg: 'bg-violet-500/8 border-violet-500/15' },
  { key: 'recommendation',  icon: Star,          label: 'Recommendation',    color: 'text-amber-400',   bg: 'bg-amber-500/8 border-amber-500/15' },
  { key: 'precedent',       icon: BookOpen,      label: 'Precedent',         color: 'text-slate-400',   bg: 'bg-white/[0.03] border-white/[0.07]' },
] as const;

export default function DecisionLab() {
  const [scenario, setScenario] = useState('');
  const [streaming, setStreaming] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async (text?: string) => {
    const input = text || scenario;
    if (!input.trim()) return;
    setLoading(true);
    setStreaming('');
    setAnalysis(null);
    setError('');

    try {
      const res = await fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: input }),
      });
      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      let full = '';
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
          try { const { text } = JSON.parse(raw); full += text; setStreaming(full); } catch {}
        }
      }
      // Parse JSON
      const clean = full.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      setAnalysis(JSON.parse(clean));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to analyze. Check your API key.');
    }
    setLoading(false);
  };

  return (
    <div className="h-full scroll-area p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-400" />
        <h1 className="text-xl font-black text-white">Decision Lab</h1>
        <span className="text-xs text-slate-500 ml-1">Live AI advisor for CEO-level decisions</span>
      </div>

      {/* Input */}
      <div className="card rounded-2xl p-5 space-y-4">
        <textarea
          value={scenario}
          onChange={e => setScenario(e.target.value)}
          placeholder="Describe a real decision you're facing as Apple CEO…"
          rows={3}
          className="ceo-input w-full px-4 py-3 text-sm resize-none"
        />
        <button
          onClick={() => analyze()}
          disabled={loading || !scenario.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/25 font-semibold text-sm hover:bg-amber-500/25 transition-colors disabled:opacity-40"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Analyzing…' : 'Analyze Decision'}
        </button>
      </div>

      {/* Quick scenario chips */}
      <div>
        <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Real Apple scenarios — click to analyze</div>
        <div className="space-y-1.5">
          {decisionScenarios.map((s, i) => (
            <button key={i} onClick={() => { setScenario(s); analyze(s); }}
              className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl glass border border-white/[0.06] hover:border-amber-500/25 hover:bg-amber-500/5 transition-all group">
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 flex-shrink-0" />
              <span className="text-xs text-slate-400 group-hover:text-slate-200">{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Streaming raw (while parsing) */}
      {loading && streaming && !analysis && (
        <div className="card rounded-xl p-4">
          <p className="text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">{streaming}<span className="animate-pulse text-amber-400">▌</span></p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-sm text-red-400">{error}</div>
      )}

      {/* Analysis results */}
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">4-Perspective Analysis</div>
            {LENSES.map((lens, i) => (
              <motion.div key={lens.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className={`card rounded-xl p-4 border ${lens.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <lens.icon className={`w-4 h-4 ${lens.color}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${lens.color}`}>{lens.label}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{analysis[lens.key]}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
