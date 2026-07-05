'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RefreshCw, Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';

// Circular gauge using SVG
function CircularGauge({ value, max = 100, color = '#00F2FE', size = 160 }: {
  value: number; max?: number; color?: string; size?: number;
}) {
  const pct = value / max;
  const r = (size / 2) - 18;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
}

const DEFAULT_ZONE_DATA = [
  { zone: 'Pune Cantonment (A1)', population: 450000, preSim: 'Critical (12h Cut)', postSim: 'Stable (24h Supply)', action: 'Lift Rationing', preColor: '#EF4444', postColor: '#10B981' },
  { zone: 'Shivajinagar (B3)', population: 280000, preSim: 'Critical (12h Cut)', postSim: 'Stable (24h Supply)', action: 'Lift Rationing', preColor: '#EF4444', postColor: '#10B981' },
  { zone: 'Kothrud (C2)', population: 520000, preSim: 'Watch (Low Pres.)', postSim: 'Stable (Nominal)', action: 'Maintain Current', preColor: '#F59E0B', postColor: '#10B981' },
  { zone: 'Hadapsar (D4)', population: 610000, preSim: 'Critical (Tanker Dep.)', postSim: 'Watch (Altn. Days)', action: 'Ease to Altn. Days', preColor: '#EF4444', postColor: '#F59E0B' },
];

const DEFAULT_TURBIDITY_DATA = [
  { name: 'K', val: 14 },
  { name: 'P', val: 22 },
  { name: 'V', val: 18 },
  { name: 'T', val: 16 },
  { name: 'Now', val: 18.5 },
];

interface SimulationsViewProps {
  pipelineData?: any;
}

export default function SimulationsView({ pipelineData }: SimulationsViewProps) {
  const [simDone, setSimDone] = useState(true);
  const [resetting, setResetting] = useState(false);

  // Read data from pipeline if loaded, otherwise fall back to design mockup defaults
  const resData = pipelineData?.reservoir || {
    capacity_pct: 32.5,
    total_tmc: 29.15,
    current_tmc: 9.45,
    simulated_inflow_tmc: 2.00,
    buffer_days: 85,
    pre_sim_days: 24,
    turbidity_ntu: 18.5,
  };

  const handleReset = () => {
    setResetting(true);
    setSimDone(false);
    setTimeout(() => {
      setResetting(false);
      setSimDone(true);
    }, 1200);
  };

  const turbidityChartData = [
    ...DEFAULT_TURBIDITY_DATA.slice(0, 4),
    { name: 'Now', val: resData.turbidity_ntu },
  ];

  return (
    <div className="flex flex-col gap-5 p-6" style={{ flex: 1, overflowY: 'auto' }}>
      {/* Page header actions */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          {simDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.3)', color: '#00F2FE' }}
            >
              <CheckCircle size={14} />
              SIMULATION COMPLETE
            </motion.div>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#9CA3AF', cursor: 'pointer' }}
          >
            {resetting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <RefreshCw size={13} />
              </motion.div>
            ) : (
              <RefreshCw size={13} />
            )}
            Reset Model
          </button>
        </div>
      </div>

      {/* Three metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 16 }}>
        {/* Aggregate Live Storage */}
        <div className="glass-card p-5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="text-sm font-semibold text-white">Aggregate Live Storage</div>
              <div style={{ color: '#4B5563', fontSize: 11, marginTop: 2 }}>Khadakwasla, Panshet, Varasgaon, Temghar</div>
            </div>
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)', color: '#00F2FE' }}>
              <TrendingUp size={10} />
              +{resData.simulated_inflow_tmc.toFixed(1)} TMC
            </div>
          </div>

          <div className="flex items-center gap-6 mt-3">
            {/* Circular gauge */}
            <div className="relative flex-shrink-0" style={{ width: 130, height: 130 }}>
              <CircularGauge value={resData.capacity_pct} size={130} color="#00F2FE" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-metric text-3xl font-bold" style={{ color: '#00F2FE', lineHeight: 1 }}>{resData.capacity_pct}%</div>
                <div className="text-xs mt-1" style={{ color: '#10B981', fontSize: 10 }}>+6.8%</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div style={{ color: '#6B7280', fontSize: 11 }}>Total Volume</div>
                <div className="font-metric text-lg font-bold text-white">{resData.current_tmc.toFixed(2)} / {resData.total_tmc} TMC</div>
              </div>
              <div>
                <div style={{ color: '#6B7280', fontSize: 11 }}>Simulated Inflow</div>
                <div className="font-metric text-2xl font-bold" style={{ color: '#00F2FE' }}>{resData.simulated_inflow_tmc.toFixed(2)} TMC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Buffer */}
        <div className="glass-card p-5 flex flex-col justify-between" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <div className="text-sm font-semibold text-white">Estimated Buffer</div>
            <div style={{ color: '#4B5563', fontSize: 11, marginTop: 2 }}>At current draw rate (1350 MLD)</div>
          </div>
          <div>
            <div className="font-metric text-5xl font-bold mb-1" style={{ color: '#00F2FE', textShadow: '0 0 24px rgba(0,242,254,0.5)' }}>~{resData.buffer_days} Days</div>
            <div style={{ color: '#EF4444', fontSize: 11, textDecoration: 'line-through', marginBottom: 8 }}>Pre-Sim: ~{resData.pre_sim_days} Days</div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${resData.buffer_days}%` }} transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #10B981, #00F2FE)', boxShadow: '0 0 8px #10B98160' }} />
            </div>
          </div>
        </div>

        {/* Turbidity Est. */}
        <div className="glass-card p-5 flex flex-col gap-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <div className="text-sm font-semibold text-white">Turbidity Est.</div>
            <div style={{ color: '#4B5563', fontSize: 11, marginTop: 2 }}>Post-inflow projection</div>
          </div>
          <div className="font-metric text-3xl font-bold" style={{ color: '#F59E0B', textShadow: '0 0 16px rgba(245,158,11,0.4)' }}>{resData.turbidity_ntu.toFixed(1)} NTU</div>
          <div style={{ height: 60 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={turbidityChartData} barSize={14}>
                <Bar dataKey="val" radius={[3, 3, 0, 0]}>
                  {turbidityChartData.map((_, i) => (
                    <Cell key={i} fill={i === turbidityChartData.length - 1 ? '#F59E0B' : 'rgba(255,255,255,0.12)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs" style={{ color: '#F59E0B', fontSize: 10 }}>Treatment adj. required</div>
        </div>
      </div>

      {/* Zone Rationing Status Table */}
      <div className="glass-card" style={{ borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div>
            <div className="text-sm font-bold text-white">Zone Rationing Status</div>
            <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>Updated based on simulation success</div>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}>
            <Download size={16} />
          </button>
        </div>

        {/* Table header */}
        <div
          className="grid text-xs font-semibold"
          style={{
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
            padding: '10px 24px',
            color: '#4B5563',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            background: '#0A0F1A',
          }}
        >
          <span>Zone</span>
          <span>Population Impacted</span>
          <span>Pre-Sim Status</span>
          <span>Post-Sim Status</span>
          <span>Recommended Action</span>
        </div>

        {DEFAULT_ZONE_DATA.map((row, i) => (
          <motion.div
            key={row.zone}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="grid items-center table-row-hover"
            style={{
              gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
              padding: '14px 24px',
              borderBottom: i < DEFAULT_ZONE_DATA.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <span className="font-metric text-sm font-semibold text-white">{row.zone}</span>
            <span className="font-metric text-sm" style={{ color: '#9CA3AF' }}>{row.population.toLocaleString()}</span>
            <span>
              <span className="text-xs font-metric px-2.5 py-1 rounded" style={{ background: `${row.preColor}18`, border: `1px solid ${row.preColor}35`, color: row.preColor }}>
                {row.preSim}
              </span>
            </span>
            <span>
              <span className="text-xs font-metric px-2.5 py-1 rounded" style={{ background: `${row.postColor}18`, border: `1px solid ${row.postColor}35`, color: row.postColor }}>
                {row.postSim}
              </span>
            </span>
            <span className="font-metric text-sm font-semibold" style={{ color: '#9CA3AF' }}>{row.action}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

