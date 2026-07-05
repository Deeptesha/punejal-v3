'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  subtextHighlight?: boolean;
  accentColor: string;
  icon: React.ReactNode;
  progress?: number;       // 0–100
  index?: number;
  badge?: string;
  badgeColor?: string;
}

export default function MetricCard({
  title,
  value,
  subtext,
  subtextHighlight,
  accentColor,
  icon,
  progress,
  index = 0,
  badge,
  badgeColor,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card glow-border relative overflow-hidden p-5"
      style={{ cursor: 'default' }}
    >
      {/* Ambient gradient corner */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
      />

      {/* Top row: title + icon */}
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: '#6B7280', letterSpacing: '0.08em' }}
        >
          {title}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Main value */}
      <div
        className="font-metric text-2xl font-bold mb-1 leading-none"
        style={{
          color: accentColor,
          textShadow: `0 0 20px ${accentColor}60`,
        }}
      >
        {value}
      </div>

      {/* Progress bar (optional) */}
      {progress !== undefined && (
        <div className="my-2.5">
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: index * 0.08 + 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
                boxShadow: `0 0 8px ${accentColor}60`,
              }}
            />
          </div>
        </div>
      )}

      {/* Subtext / badge row */}
      <div className="flex items-center gap-2 mt-2">
        {badge && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full font-metric"
            style={{
              background: `${badgeColor || accentColor}18`,
              border: `1px solid ${badgeColor || accentColor}30`,
              color: badgeColor || accentColor,
              fontSize: 10,
            }}
          >
            {badge}
          </span>
        )}
        <span
          className="text-xs"
          style={{
            color: subtextHighlight ? accentColor : '#6B7280',
            fontWeight: subtextHighlight ? 500 : 400,
          }}
        >
          {subtext}
        </span>
      </div>
    </motion.div>
  );
}
