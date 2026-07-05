'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Eye, RefreshCw } from 'lucide-react';

const DEFAULT_WARDS = [
  { sector: 'Bhavani Peth', mld: 14.2, score: 0.35, status: 'stable', tooltip: null },
  {
    sector: 'Kondhwa (South)',
    mld: 28.5,
    score: 0.92,
    status: 'critical',
    tooltip: 'Calculated based on pipe age (42 yrs), elevation delta (82m), and recent burst history. High risk of vacuum-induced collapse during intermittent supply cycles.',
  },
  { sector: 'Shivajinagar', mld: 41.0, score: 0.67, status: 'warning', tooltip: null },
  { sector: 'Kothrud', mld: 32.0, score: 0.31, status: 'stable', tooltip: null },
];

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  stable: { label: 'STABLE', color: '#10B981', icon: <CheckCircle size={11} /> },
  critical: { label: 'CRITICAL', color: '#EF4444', icon: <AlertTriangle size={11} /> },
  warning: { label: 'WARNING', color: '#F59E0B', icon: <Eye size={11} /> },
};

// Circular pressure gauge using SVG arc
function PressureGauge({ value = 4.2 }: { value?: number }) {
  const pct = value / 8;
  const r = 52;
  const circ = 2 * Math.PI * r * 0.75;
  const offset = circ * (1 - pct);
  return (
    <div className="relative flex flex-col items-center">
      <svg width={130} height={100} viewBox="0 0 130 100">
        {/* Background arc */}
        <path
          d="M 15 90 A 52 52 0 1 1 115 90"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d="M 15 90 A 52 52 0 1 1 115 90"
          fill="none"
          stroke="#00F2FE"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ filter: 'drop-shadow(0 0 4px #00F2FE80)', transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute" style={{ bottom: 8, left: '50%', transform: 'translateX(-50%)' }}>
        <div className="font-metric text-3xl font-bold text-white text-center">{value.toFixed(1)}</div>
        <div className="font-metric text-xs text-center" style={{ color: '#6B7280' }}>bar</div>
      </div>
    </div>
  );
}

// Fake map placeholder with dots for Pune localities
function LiveTopologyMap() {
  const nodes = [
    { x: 52, y: 34, color: '#10B981', label: 'Panshet' },
    { x: 29, y: 52, color: '#10B981', label: 'Kothrud' },
    { x: 70, y: 48, color: '#EF4444', label: 'Kondhwa' },
    { x: 62, y: 30, color: '#10B981', label: 'Hadapsar' },
    { x: 44, y: 22, color: '#F59E0B', label: 'Pashan' },
  ];
  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        width: '100%',
        height: 140,
        background: 'linear-gradient(145deg, #0f1e30 0%, #0a1525 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Grid lines */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
        {[20, 40, 60, 80].map((v) => (
          <React.Fragment key={v}>
            <line x1={`${v}%`} y1="0%" x2={`${v}%`} y2="100%" stroke="#00F2FE" strokeWidth={0.5} />
            <line x1="0%" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke="#00F2FE" strokeWidth={0.5} />
          </React.Fragment>
        ))}
      </svg>
      {/* Nodes */}
      {nodes.map((n) => (
        <div
          key={n.label}
          className="absolute"
          style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)' }}
        >
          <div
            className="w-2 h-2 rounded-full pulse-dot"
            style={{ background: n.color, boxShadow: `0 0 6px ${n.color}` }}
          />
        </div>
      ))}
      {/* City label */}
      <div
        className="absolute font-metric text-xs font-bold"
        style={{ left: '50%', top: '40%', transform: 'translate(-50%,-50%)', color: '#ffffff60', fontSize: 11 }}
      >
        पुणे
      </div>
      <div
        className="absolute bottom-1.5 left-2 text-xs font-metric"
        style={{ color: '#4B5563', fontSize: 10 }}
      >
        SEC: S-4
      </div>
      <div
        className="absolute top-1.5 left-2 text-xs"
        style={{ color: '#4B5563', fontSize: 10 }}
      >
        Live Network Topology
      </div>
    </div>
  );
}

interface NetworkDiagnosticsViewProps {
  pipelineData?: any;
}

export default function NetworkDiagnosticsView({ pipelineData }: NetworkDiagnosticsViewProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sysPressure] = useState(4.2);

  // Derive dynamic list of wards from pipeline data if available
  const wards = pipelineData?.wards
    ? pipelineData.wards.slice(0, 8).map((w: any) => ({
        sector: w.name,
        mld: parseFloat(((w.elevationDelta + 100) / 7).toFixed(1)),
        score: Math.min(0.99, w.fragility),
        status: w.status === 'critical' ? 'critical' : w.status === 'watch' ? 'warning' : 'stable',
        tooltip: w.name.includes('Kondhwa')
          ? 'Calculated based on pipe age (42 yrs), elevation delta (82m), and recent burst history. High risk of vacuum-induced collapse during intermittent supply cycles.'
          : null,
      }))
    : DEFAULT_WARDS;

  return (
    <div className="flex gap-5 p-6" style={{ flex: 1, overflow: 'hidden' }}>
      {/* Left: Ward Fragility Index */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
        <div className="glass-card flex-1 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="text-sm font-bold text-white">Ward Fragility Index</div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#EF4444' }}>
              <div className="w-2 h-2 rounded-sm" style={{ background: '#EF4444' }} />
              Critical Risk
            </div>
          </div>

          {/* Column headers */}
          <div
            className="grid text-xs font-semibold px-5 py-2.5"
            style={{
              gridTemplateColumns: '1.5fr 0.8fr 1.5fr 0.8fr',
              color: '#4B5563',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: '#0A0F1A',
            }}
          >
            <span>Sector / Ward</span>
            <span>Base MLD</span>
            <span>Fragility Score</span>
            <span>Status</span>
          </div>

          {wards.map((ward: any) => {
            const sc = STATUS_CFG[ward.status] || STATUS_CFG.stable;
            const barColor = ward.score > 0.8 ? '#EF4444' : ward.score > 0.5 ? '#F59E0B' : '#10B981';
            const isHovered = hoveredRow === ward.sector;

            return (
              <div key={ward.sector}>
                <div
                  className="grid items-center px-5 py-3.5 cursor-pointer table-row-hover relative"
                  style={{
                    gridTemplateColumns: '1.5fr 0.8fr 1.5fr 0.8fr',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: isHovered && ward.tooltip ? 'rgba(0,242,254,0.03)' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredRow(ward.sector)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <span className="font-metric text-sm font-semibold text-white">{ward.sector}</span>
                  <span className="font-metric text-sm" style={{ color: '#9CA3AF' }}>{ward.mld}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', maxWidth: 120 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ward.score * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className="h-full rounded-full"
                        style={{ background: barColor, boxShadow: `0 0 6px ${barColor}60` }}
                      />
                    </div>
                    <span className="font-metric text-xs font-semibold" style={{ color: barColor }}>{ward.score.toFixed(2)}</span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded"
                    style={{ background: `${sc.color}15`, border: `1px solid ${sc.color}30`, color: sc.color, width: 'fit-content' }}
                  >
                    {sc.icon} {sc.label}
                  </span>
                </div>

                {/* Tooltip popup */}
                <AnimatePresence>
                  {isHovered && ward.tooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="mx-5 mb-2 p-3 rounded-lg text-xs"
                      style={{
                        background: '#1a2235',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: '#9CA3AF',
                        lineHeight: 1.6,
                        zIndex: 10,
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5 font-semibold" style={{ color: '#F59E0B' }}>
                        <AlertTriangle size={12} />
                        Fragility Index: {ward.score.toFixed(2)}
                      </div>
                      {ward.tooltip.split('. ').map((s: string, i: number) => (
                        <span key={i}>{s}{i < ward.tooltip!.split('. ').length - 1 ? '. ' : ''}</span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Sys Pressure + Map */}
      <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
        {/* Sys Pressure */}
        <div className="glass-card p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <RefreshCw size={12} style={{ color: '#00F2FE' }} />
            <span className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Sys Pressure</span>
          </div>
          <PressureGauge value={sysPressure} />
          <div className="text-center mt-2">
            <div className="font-metric text-xs" style={{ color: '#10B981', fontSize: 11 }}>+0.3 bar / hr</div>
          </div>
        </div>

        {/* Live Network Topology */}
        <div className="glass-card p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <LiveTopologyMap />
        </div>
      </div>
    </div>
  );
}

