'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Settings, HelpCircle, Cpu, Activity } from 'lucide-react';

export type TopSection = 'reservoirs' | 'pumps' | 'analytics' | 'logistics';

interface TopBarProps {
  activeSection: TopSection;
  onSectionChange: (s: TopSection) => void;
  pageTitle: string;
  pageSubtitle: string;
}

const SECTIONS: { id: TopSection; label: string }[] = [
  { id: 'reservoirs', label: 'Reservoirs' },
  { id: 'pumps', label: 'Pump Stations' },
  { id: 'analytics', label: 'Analytical Views' },
  { id: 'logistics', label: 'Logistics' },
];

export default function TopBar({ activeSection, onSectionChange, pageTitle, pageSubtitle }: TopBarProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: '#0D1220', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
      {/* Upper row */}
      <div className="flex items-center gap-6 px-6" style={{ height: 48 }}>
        {/* Brand name in topbar */}
        <span className="text-white font-bold text-lg tracking-tight" style={{ marginRight: 8 }}>PuneJal</span>

        {/* Section tabs */}
        <nav className="flex items-center gap-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSectionChange(s.id)}
              className="px-4 py-1.5 text-sm rounded transition-all-200"
              style={{
                background: 'none',
                border: 'none',
                color: activeSection === s.id ? '#ffffff' : '#6B7280',
                fontWeight: activeSection === s.id ? 600 : 400,
                cursor: 'pointer',
                fontSize: 13,
                borderBottom: activeSection === s.id ? '2px solid #00F2FE' : '2px solid transparent',
                borderRadius: 0,
                paddingBottom: '12px',
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Status chips */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Activity size={11} style={{ color: '#10B981' }} />
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>SYSTEM STATUS:</span>
            <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>ACTIVE</span>
          </div>

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

          <div className="flex items-center gap-1.5">
            <Cpu size={11} style={{ color: '#10B981' }} />
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>GPU ACCEL:</span>
            <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>ON</span>
          </div>

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

          <Bell size={16} style={{ color: '#6B7280', cursor: 'pointer' }} />
          <Settings size={16} style={{ color: '#6B7280', cursor: 'pointer' }} />
          <HelpCircle size={16} style={{ color: '#6B7280', cursor: 'pointer' }} />

          {/* Avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #0e2040)', border: '1px solid rgba(0,242,254,0.3)', color: '#00F2FE', fontSize: 11 }}
          >
            VD
          </div>
        </div>
      </div>

      {/* Page title row */}
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
        {pageSubtitle && (
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{pageSubtitle}</p>
        )}
      </div>
    </div>
  );
}
