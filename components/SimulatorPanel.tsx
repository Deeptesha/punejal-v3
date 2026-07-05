'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Play, RefreshCw, Droplets, Clock } from 'lucide-react';
import { calculateRunway } from '@/lib/mock-data';

interface SimulatorPanelProps {
  onRunwayChange: (days: number) => void;
}

export default function SimulatorPanel({ onRunwayChange }: SimulatorPanelProps) {
  const [drawRate, setDrawRate] = useState(1.55);
  const [agriDiversion, setAgriDiversion] = useState(15);
  const [previewing, setPreviewing] = useState(false);
  const [previewRunway, setPreviewRunway] = useState<number | null>(null);

  const liveRunway = calculateRunway(drawRate, agriDiversion);

  const handleDrawRate = useCallback((val: number) => {
    setDrawRate(val);
    onRunwayChange(calculateRunway(val, agriDiversion));
    setPreviewRunway(null);
  }, [agriDiversion, onRunwayChange]);

  const handleAgri = useCallback((val: number) => {
    setAgriDiversion(val);
    onRunwayChange(calculateRunway(drawRate, val));
    setPreviewRunway(null);
  }, [drawRate, onRunwayChange]);

  const handlePreview = () => {
    setPreviewing(true);
    setTimeout(() => {
      const runway = calculateRunway(drawRate, agriDiversion);
      setPreviewRunway(runway);
      setPreviewing(false);
      onRunwayChange(runway);
    }, 1200);
  };

  const handleReset = () => {
    setDrawRate(1.55);
    setAgriDiversion(15);
    setPreviewRunway(null);
    onRunwayChange(calculateRunway(1.55, 15));
  };

  const runwayColor = liveRunway < 15 ? '#EF4444' : liveRunway < 25 ? '#F59E0B' : '#00F2FE';

  return (
    <div className="glass-card flex flex-col gap-4 p-5" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
            <Sliders size={14} style={{ color: '#00F2FE' }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Simulated Mitigation</div>
            <div className="text-xs" style={{ color: '#4B5563' }}>Scenario planning controls</div>
          </div>
        </div>
        <button onClick={handleReset} title="Reset" className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6B7280', cursor: 'pointer' }}>
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Draw Rate Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Droplets size={12} style={{ color: '#00F2FE' }} />
            <span className="text-xs font-semibold text-white">City Draw Rate</span>
          </div>
          <span className="font-metric text-sm font-bold" style={{ color: '#00F2FE' }}>{drawRate.toFixed(2)} TMC/day</span>
        </div>
        <input type="range" min={1.0} max={2.2} step={0.01} value={drawRate}
          onChange={(e) => handleDrawRate(parseFloat(e.target.value))}
          style={{ background: `linear-gradient(90deg, #00F2FE ${((drawRate - 1.0) / 1.2) * 100}%, rgba(255,255,255,0.1) ${((drawRate - 1.0) / 1.2) * 100}%)` }}
        />
        <div className="flex justify-between mt-1">
          <span style={{ color: '#374151', fontSize: 10 }}>1.0</span>
          <span style={{ color: '#374151', fontSize: 10 }}>2.2 TMC/day</span>
        </div>
      </div>

      {/* Agri Diversion Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white">🌾 Agricultural Diversion</span>
          <span className="font-metric text-sm font-bold" style={{ color: '#F59E0B' }}>{agriDiversion}%</span>
        </div>
        <input type="range" min={0} max={50} step={1} value={agriDiversion}
          onChange={(e) => handleAgri(parseInt(e.target.value, 10))}
          style={{ background: `linear-gradient(90deg, #F59E0B ${(agriDiversion / 50) * 100}%, rgba(255,255,255,0.1) ${(agriDiversion / 50) * 100}%)` }}
        />
        <div className="flex justify-between mt-1">
          <span style={{ color: '#374151', fontSize: 10 }}>0%</span>
          <span style={{ color: '#374151', fontSize: 10 }}>50%</span>
        </div>
      </div>

      {/* Live Runway */}
      <div className="rounded-xl p-4" style={{ background: `${runwayColor}08`, border: `1px solid ${runwayColor}25` }}>
        <div className="flex items-center gap-1.5 mb-1">
          <Clock size={12} style={{ color: runwayColor }} />
          <span className="text-xs font-semibold" style={{ color: runwayColor }}>Projected System Runway</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={liveRunway} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
            className="font-metric text-2xl font-bold" style={{ color: runwayColor, textShadow: `0 0 20px ${runwayColor}60` }}>
            ~{liveRunway} Days
          </motion.div>
        </AnimatePresence>
        <div className="text-xs mt-1" style={{ color: '#4B5563' }}>At {drawRate.toFixed(2)} TMC/day with {agriDiversion}% agri diversion</div>
      </div>

      {/* Preview Button */}
      <motion.button onClick={handlePreview} disabled={previewing} whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold"
        style={{ background: previewing ? 'rgba(0,242,254,0.08)' : 'linear-gradient(135deg, rgba(0,242,254,0.18) 0%, rgba(0,112,243,0.18) 100%)', border: '1px solid rgba(0,242,254,0.35)', color: '#00F2FE', cursor: previewing ? 'wait' : 'pointer', boxShadow: '0 0 20px rgba(0,242,254,0.12)' }}>
        {previewing ? (
          <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RefreshCw size={14} /></motion.div> Computing...</>
        ) : (
          <><Play size={14} fill="#00F2FE" /> Preview Re-routing Plan</>
        )}
      </motion.button>

      <AnimatePresence>
        {previewRunway !== null && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', lineHeight: 1.5 }}>
              ✓ Computed. Runway updated to <strong className="font-metric">~{previewRunway} days</strong>. Auxiliary feeds rerouted via Holkar Bridge Sub-station.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
