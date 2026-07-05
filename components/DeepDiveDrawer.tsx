'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Droplets,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Zap,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { DeepDiveData } from '@/lib/types';

interface DeepDiveDrawerProps {
  data: DeepDiveData | null;
  onClose: () => void;
}

const STATUS_CONFIG = {
  critical: { label: 'Critical', color: '#EF4444', icon: <AlertTriangle size={13} /> },
  watch: { label: 'Watch', color: '#F59E0B', icon: <Eye size={13} /> },
  stable: { label: 'Stable', color: '#10B981', icon: <CheckCircle size={13} /> },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{
          background: '#1a2235',
          border: '1px solid rgba(0,242,254,0.2)',
          color: '#00F2FE',
        }}
      >
        <div style={{ color: '#9CA3AF' }}>{label}</div>
        <div className="font-metric font-semibold">{payload[0].value} {payload[0].name === 'pressure' ? 'bar' : ''}</div>
      </div>
    );
  }
  return null;
};

export default function DeepDiveDrawer({ data, onClose }: DeepDiveDrawerProps) {
  return (
    <AnimatePresence>
      {data && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-y-auto"
            style={{
              width: 440,
              background: '#0E1525',
              borderLeft: '1px solid rgba(0, 242, 254, 0.15)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Drawer Header */}
            <div
              className="flex items-start justify-between p-6 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${STATUS_CONFIG[data.ward.status].color}18`,
                      border: `1px solid ${STATUS_CONFIG[data.ward.status].color}30`,
                      color: STATUS_CONFIG[data.ward.status].color,
                    }}
                  >
                    {STATUS_CONFIG[data.ward.status].icon}
                    {STATUS_CONFIG[data.ward.status].label}
                  </span>
                  <span
                    className="text-xs font-metric"
                    style={{ color: '#4B5563' }}
                  >
                    {data.ward.dmaCode}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{data.ward.name}</h3>
                <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
                  {data.ward.zone} Zone — Ward ID {data.ward.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#6B7280',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Stats row */}
            <div
              className="grid grid-cols-3 gap-3 p-6"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              {[
                { icon: <Users size={14} />, label: 'Population', value: data.ward.population.toLocaleString() },
                { icon: <Droplets size={14} />, label: 'Flow Rate', value: `${data.flowRate} L/s` },
                { icon: <MapPin size={14} />, label: 'Pipeline', value: `${data.ward.pipelineLength} km` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5" style={{ color: '#6B7280' }}>
                    {stat.icon}
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <div className="font-metric text-sm font-semibold text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Pressure History Chart */}
            <div className="px-6 pt-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">Pressure History (12h)</h4>
                <span
                  className="text-xs font-metric"
                  style={{ color: '#00F2FE' }}
                >
                  {data.ward.headPressure.toFixed(2)} bar live
                </span>
              </div>
              <div style={{ height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.pressureHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 9, fill: '#4B5563' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: '#4B5563' }}
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']}
                      width={28}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="pressure"
                      stroke="#00F2FE"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#00F2FE', stroke: '#0B0F19', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Complaint History Chart */}
            <div className="px-6 pt-5">
              <h4 className="text-sm font-semibold text-white mb-3">Complaint Volume (7d)</h4>
              <div style={{ height: 100 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.complaintHistory} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 9, fill: '#4B5563' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: '#4B5563' }}
                      axisLine={false}
                      tickLine={false}
                      width={24}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      fill={
                        data.ward.status === 'critical'
                          ? '#EF4444'
                          : data.ward.status === 'watch'
                          ? '#F59E0B'
                          : '#10B981'
                      }
                      radius={[3, 3, 0, 0]}
                      fillOpacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Network Info */}
            <div className="px-6 pt-5">
              <div
                className="rounded-lg p-4"
                style={{ background: 'rgba(0,242,254,0.04)', border: '1px solid rgba(0,242,254,0.12)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={13} style={{ color: '#00F2FE' }} />
                  <span className="text-xs font-semibold" style={{ color: '#00F2FE' }}>
                    Network Analysis
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Graph Nodes</div>
                    <div className="font-metric text-sm font-semibold text-white mt-0.5">{data.networkNodes.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Reservoir Feed</div>
                    <div className="text-sm font-semibold text-white mt-0.5" style={{ fontSize: 12 }}>{data.reservoirFeed}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} style={{ color: '#F59E0B' }} />
                <h4 className="text-sm font-semibold text-white">AI Recommendations</h4>
              </div>
              <div className="flex flex-col gap-2">
                {data.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs p-3 rounded-lg"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#9CA3AF',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      className="font-metric font-bold flex-shrink-0 mt-0.5"
                      style={{ color: '#F59E0B', fontSize: 10 }}
                    >
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
