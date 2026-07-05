'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GitBranch,
  BarChart2,
  FlaskConical,
  Radio,
  Archive,
  User,
  Settings,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export type NavId = 'command' | 'flow' | 'equity' | 'simulations' | 'telemetry' | 'archives';

interface SidebarProps {
  activeNav: NavId;
  onNavChange: (id: NavId) => void;
}

const NAV_ITEMS: { id: NavId; label: string; icon: React.ReactNode }[] = [
  { id: 'command', label: 'Command Center', icon: <LayoutDashboard size={17} /> },
  { id: 'flow', label: 'Flow Network', icon: <GitBranch size={17} /> },
  { id: 'equity', label: 'Equity Analysis', icon: <BarChart2 size={17} /> },
  { id: 'simulations', label: 'Simulations', icon: <FlaskConical size={17} /> },
  { id: 'telemetry', label: 'Telemetry', icon: <Radio size={17} /> },
  { id: 'archives', label: 'Archives', icon: <Archive size={17} /> },
];

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const [emergencyHover, setEmergencyHover] = useState(false);

  return (
    <aside
      style={{
        width: 210,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1220',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        height: '100vh',
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 px-4 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #00F2FE 0%, #0070F3 100%)',
            boxShadow: '0 0 14px rgba(0,242,254,0.35)',
          }}
        >
          <Zap size={16} fill="white" color="white" />
        </div>
        <div>
          <div className="font-bold text-white text-sm leading-tight">PuneJal SCADA</div>
          <div style={{ color: '#4B5563', fontSize: 10, marginTop: 1 }}>PMC Live Engine v4.2</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className="relative flex items-center gap-3 rounded-lg text-left w-full transition-all-200"
              style={{
                padding: '9px 12px',
                background: isActive ? 'rgba(0,242,254,0.08)' : 'transparent',
                border: 'none',
                color: isActive ? '#ffffff' : '#6B7280',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebarActiveBar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full"
                  style={{ background: '#10B981', boxShadow: '0 0 6px #10B981' }}
                />
              )}
              <span style={{ color: isActive ? '#00F2FE' : '#4B5563', flexShrink: 0 }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-4 flex flex-col gap-1">
        {/* Emergency Shutdown */}
        <motion.button
          onHoverStart={() => setEmergencyHover(true)}
          onHoverEnd={() => setEmergencyHover(false)}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-lg w-full mb-2"
          style={{
            padding: '10px 14px',
            background: emergencyHover ? '#DC2626' : 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.35)',
            color: '#EF4444',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
        >
          <AlertTriangle size={15} />
          Emergency Shutdown
        </motion.button>

        {/* User Profile */}
        <button
          className="flex items-center gap-2.5 rounded-lg w-full text-left"
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <User size={13} style={{ color: '#9CA3AF' }} />
          </div>
          User Profile
        </button>

        {/* System Config */}
        <button
          className="flex items-center gap-2.5 rounded-lg w-full text-left"
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Settings size={13} style={{ color: '#9CA3AF' }} />
          </div>
          System Config
        </button>
      </div>
    </aside>
  );
}
