'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, RefreshCw, CheckCircle, Play } from 'lucide-react';

// Circular gauge
function CircularGauge({ value, color = '#EF4444' }: { value: number; color?: string }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <svg width={150} height={150} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={75} cy={75} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
      <circle cx={75} cy={75} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${color}70)`, transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

const DEFAULT_EQUITY_ROWS = [
  { sector: 'Kondhwa (South)', node: 'Node K-42', status: 'RED', policy: 'Mandatory Rationing', deficit: -42 },
  { sector: 'Hadapsar (East)', node: 'Node H-11', status: 'RED', policy: 'Mandatory Rationing', deficit: -38 },
  { sector: 'Kothrud (West)', node: 'Node KO-89', status: 'AMBER', policy: 'Voluntary Reduction', deficit: -15 },
];

interface CommandCenterViewProps {
  pipelineData?: any;
}

export default function CommandCenterView({ pipelineData }: CommandCenterViewProps) {
  const [agriCut, setAgriCut] = useState(50);
  const [committed, setCommitted] = useState(false);
  const [committing, setCommitting] = useState(false);

  const projectedYield = Math.round((agriCut / 100) * 96);

  const handleCommit = () => {
    setCommitting(true);
    setTimeout(() => {
      setCommitting(false);
      setCommitted(true);
    }, 1400);
  };

  // Derive dynamic list of critical wards from pipeline data if available
  const equityRows = pipelineData?.wards
    ? pipelineData.wards
        .filter((w: any) => w.deficit < 0)
        .slice(0, 4)
        .map((w: any) => ({
          sector: w.name,
          node: w.dmaCode,
          status: w.status === 'critical' ? 'RED' : 'AMBER',
          policy: w.policy,
          deficit: w.deficit,
        }))
    : DEFAULT_EQUITY_ROWS;

  return (
    <div className="flex flex-col" style={{ flex: 1, overflow: 'hidden' }}>
      {/* Emergency Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-6 py-2.5"
        style={{ background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.3)', flexShrink: 0 }}
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle size={14} style={{ color: '#EF4444' }} />
          <span className="font-metric text-xs font-semibold" style={{ color: '#EF4444', letterSpacing: '0.08em' }}>
            EMERGENCY: ACTIVE RATIONING STATE ENFORCED ACROSS ALL WARDS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-metric text-xs" style={{ color: '#4B5563' }}>OVERRIDE CODE:</span>
          <span className="font-metric text-xs font-bold" style={{ color: '#EF4444' }}>RED-77A</span>
        </div>
      </motion.div>

      <div className="flex gap-5 p-6" style={{ flex: 1, overflow: 'hidden' }}>
        {/* Left: Khadakwasla Live Telemetry */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            className="glass-card p-5 flex flex-col gap-4"
            style={{ borderColor: 'rgba(239,68,68,0.25)', flex: 1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Khadakwasla Live Telemetry</div>
                <div style={{ color: '#4B5563', fontSize: 11, marginTop: 2 }}>Sensor Array 04-Alpha</div>
              </div>
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444' }}
              >
                <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#EF4444' }} />
                CRITICAL
              </span>
            </div>

            {/* Circular gauge */}
            <div className="relative flex items-center justify-center">
              <CircularGauge value={8.5} color="#EF4444" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-metric text-4xl font-bold" style={{ color: '#EF4444', lineHeight: 1 }}>8.5%</div>
                <div className="font-metric text-xs mt-1.5 uppercase tracking-widest" style={{ color: '#6B7280', fontSize: 9 }}>VDL REMAINING</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ color: '#6B7280', fontSize: 11 }}>Outflow Rate</div>
                <div className="font-metric text-sm font-bold text-white mt-1">1.2k m³/s</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ color: '#6B7280', fontSize: 11 }}>Est. Depletion</div>
                <div className="font-metric text-sm font-bold mt-1" style={{ color: '#EF4444' }}>14.2 Hrs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Equity Matrix + Simulator */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {/* Ward-Level Equity Matrix */}
          <div className="glass-card overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2">
                <div style={{ color: '#00F2FE' }}>&#8718;</div>
                <span className="text-sm font-bold text-white">Ward-Level Equity Matrix</span>
              </div>
              <span
                className="text-xs px-3 py-1 rounded"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}
              >
                Filter: Critical Priority
              </span>
            </div>

            {/* Column headers */}
            <div
              className="grid text-xs px-5 py-2.5"
              style={{
                gridTemplateColumns: '1.5fr 1fr 0.8fr 1.2fr 0.6fr',
                color: '#4B5563',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: '#0A0F1A',
              }}
            >
              <span>Ward Sector</span>
              <span>Pressure Node</span>
              <span>Status</span>
              <span>Supply Policy</span>
              <span>Deficit</span>
            </div>

            {equityRows.map((row: any, i: number) => (
              <div
                key={row.sector}
                className="grid items-center px-5 py-3.5 table-row-hover"
                style={{
                  gridTemplateColumns: '1.5fr 1fr 0.8fr 1.2fr 0.6fr',
                  borderBottom: i < equityRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <span className="font-metric text-sm font-semibold text-white">{row.sector}</span>
                <span className="font-metric text-sm" style={{ color: '#6B7280' }}>{row.node}</span>
                <span>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      background: row.status === 'RED' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                      border: `1px solid ${row.status === 'RED' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                      color: row.status === 'RED' ? '#EF4444' : '#F59E0B',
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: row.status === 'RED' ? '#EF4444' : '#F59E0B' }}
                    />
                    {row.status}
                  </span>
                </span>
                <span className="font-metric text-sm" style={{ color: '#9CA3AF' }}>{row.policy}</span>
                <span className="font-metric text-sm font-bold" style={{ color: '#EF4444' }}>{row.deficit}%</span>
              </div>
            ))}
          </div>

          {/* Emergency Response Simulator */}
          <div
            className="glass-card p-5"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span style={{ fontSize: 16 }}>⚗</span>
              <span className="text-sm font-bold text-white">Emergency Response Simulator (&apos;What-If&apos;)</span>
            </div>

            <div className="flex items-end gap-6">
              {/* Slider control */}
              <div style={{ flex: 1 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <div className="text-sm font-semibold text-white">Agricultural Allocation Cut</div>
                    <div className="font-metric text-xs mt-0.5" style={{ color: '#EF4444', letterSpacing: '0.08em' }}>MAX RESTRICTION ENFORCED</div>
                  </div>
                  <span
                    className="font-metric font-bold text-sm px-3 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff' }}
                  >
                    {agriCut}%
                  </span>
                </div>

                <div className="relative mt-2 mb-1">
                  <input
                    type="range" min={0} max={100} step={1} value={agriCut}
                    onChange={(e) => { setAgriCut(parseInt(e.target.value, 10)); setCommitted(false); }}
                    style={{
                      background: `linear-gradient(90deg, #EF4444 ${agriCut}%, rgba(255,255,255,0.1} ${agriCut}%)`,
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#374151', fontSize: 10 }}>0% (Baseline)</span>
                  <span style={{ color: '#374151', fontSize: 10 }}>100% (Full Stop)</span>
                </div>
              </div>

              {/* Projected yield */}
              <div style={{ minWidth: 200, flexShrink: 0 }}>
                <div style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>Projected System Lifespan</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={projectedYield}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <TrendingUp size={16} style={{ color: '#10B981' }} />
                    <span className="font-metric text-xl font-bold" style={{ color: '#10B981' }}>+{projectedYield} Hrs Yield</span>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  onClick={handleCommit}
                  disabled={committing || committed}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold font-metric transition-all-200"
                  style={{
                    background: committed ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #00F2FE 0%, #0070F3 100%)',
                    border: committed ? '1px solid rgba(16,185,129,0.4)' : 'none',
                    color: committed ? '#10B981' : '#000000',
                    cursor: committing || committed ? 'default' : 'pointer',
                    boxShadow: committed ? 'none' : '0 0 24px rgba(0,242,254,0.3)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {committing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <RefreshCw size={14} />
                    </motion.div>
                  ) : committed ? (
                    <><CheckCircle size={14} /> COMMITTED TO LIVE</>
                  ) : (
                    <><Play size={14} fill="currentColor" /> COMMIT SCENARIO TO LIVE</>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

