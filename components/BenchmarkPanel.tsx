'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Layers, Network, ArrowRight, Cpu, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BENCHMARK_DATA } from '@/lib/mock-data';

const WORKFLOW = [
  { id: 'bq', label: 'BigQuery', sublabel: 'SCADA Reads', icon: <Database size={15} />, color: '#60A5FA' },
  { id: 'cudf', label: 'cuDF', sublabel: 'Vector Joins', icon: <Layers size={15} />, color: '#A78BFA' },
  { id: 'cugraph', label: 'cuGraph', sublabel: 'Betweenness Centrality', icon: <Network size={15} />, color: '#34D399' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', color: '#F9FAFB' }}>
        <div style={{ color: '#9CA3AF' }}>{label}</div>
        <div className="font-metric font-bold">{payload[0].value}s</div>
      </div>
    );
  }
  return null;
};

export default function BenchmarkPanel() {
  return (
    <div className="glass-card flex flex-col gap-4 p-5" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <Cpu size={14} style={{ color: '#10B981' }} />
        </div>
        <div>
          <div className="text-sm font-bold text-white">NVIDIA RAPIDS Analytics</div>
          <div className="text-xs" style={{ color: '#4B5563' }}>Real-Time Graph Optimization Workflow</div>
        </div>
      </div>

      {/* Workflow Chain */}
      <div className="flex items-center gap-1">
        {WORKFLOW.map((step, i) => (
          <React.Fragment key={step.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12, duration: 0.3 }}
              className="flex-1 rounded-lg p-2.5"
              style={{ background: `${step.color}0D`, border: `1px solid ${step.color}25` }}
            >
              <div className="flex items-center gap-1.5 mb-1" style={{ color: step.color }}>
                {step.icon}
                <span className="text-xs font-bold" style={{ fontSize: 11 }}>{step.label}</span>
              </div>
              <div className="text-xs" style={{ color: '#4B5563', fontSize: 9, lineHeight: 1.3 }}>{step.sublabel}</div>
            </motion.div>
            {i < WORKFLOW.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 + 0.2 }}
              >
                <ArrowRight size={12} style={{ color: '#374151', flexShrink: 0 }} />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Benchmark Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white">Runtime Benchmark</span>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#10B981', fontSize: 10 }}>
            <Zap size={10} />
            <span className="font-metric font-semibold">2,338x GPU Acceleration</span>
          </div>
        </div>

        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BENCHMARK_DATA} barSize={32} layout="vertical">
              <XAxis type="number" hide domain={[0, 45]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={88} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="runtime" radius={[0, 4, 4, 0]}>
                {BENCHMARK_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metric pills */}
        <div className="flex gap-2 mt-2">
          <div className="flex-1 rounded-lg p-2.5 text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="font-metric text-base font-bold" style={{ color: '#EF4444' }}>42.10s</div>
            <div className="text-xs mt-0.5" style={{ color: '#6B7280', fontSize: 9 }}>CPU Baseline</div>
          </div>
          <div className="flex items-center justify-center" style={{ color: '#374151' }}>
            <ArrowRight size={12} />
          </div>
          <div className="flex-1 rounded-lg p-2.5 text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 0 16px rgba(16,185,129,0.1)' }}>
            <div className="font-metric text-base font-bold" style={{ color: '#10B981' }}>0.018s</div>
            <div className="text-xs mt-0.5" style={{ color: '#6B7280', fontSize: 9 }}>GPU Accelerated</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Zap size={11} style={{ color: '#10B981' }} />
        <p className="text-xs italic" style={{ color: '#6B7280', fontSize: 11 }}>
          Sub-second real-time routing unlocked.
        </p>
      </div>
    </div>
  );
}
