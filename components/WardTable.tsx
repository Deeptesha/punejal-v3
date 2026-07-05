'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronUp, ChevronDown, ExternalLink, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { WARDS } from '@/lib/mock-data';
import { Ward, FilterType } from '@/lib/types';

interface WardTableProps {
  onDeepDive: (ward: Ward) => void;
}

const filterCounts = {
  all: WARDS.length,
  critical: WARDS.filter((w) => w.status === 'critical').length,
  watch: WARDS.filter((w) => w.status === 'watch').length,
  stable: WARDS.filter((w) => w.status === 'stable').length,
};

const STATUS_CONFIG = {
  critical: {
    label: 'Critical',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    icon: <AlertTriangle size={11} />,
  },
  watch: {
    label: 'Watch',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    icon: <Eye size={11} />,
  },
  stable: {
    label: 'Stable',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    icon: <CheckCircle size={11} />,
  },
};

const FILTER_CONFIG: { key: FilterType; label: string; color: string }[] = [
  { key: 'all', label: `All Wards (${filterCounts.all})`, color: '#9CA3AF' },
  { key: 'critical', label: `Critical Priority (${filterCounts.critical})`, color: '#EF4444' },
  { key: 'watch', label: `Watch List (${filterCounts.watch})`, color: '#F59E0B' },
  { key: 'stable', label: `Stable (${filterCounts.stable})`, color: '#10B981' },
];

type SortKey = 'headPressure' | 'complaints24h' | 'elevationDelta';
type SortDir = 'asc' | 'desc';

export default function WardTable({ onDeepDive }: WardTableProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortKey, setSortKey] = useState<SortKey>('complaints24h');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filteredWards = useMemo(() => {
    let data = activeFilter === 'all' ? WARDS : WARDS.filter((w) => w.status === activeFilter);
    data = [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return data;
  }, [activeFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredWards.length / PAGE_SIZE);
  const pageData = filteredWards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const handleFilter = (f: FilterType) => {
    setActiveFilter(f);
    setPage(1);
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'desc' ? (
        <ChevronDown size={12} style={{ color: '#00F2FE' }} />
      ) : (
        <ChevronUp size={12} style={{ color: '#00F2FE' }} />
      )
    ) : (
      <ChevronDown size={12} style={{ color: '#374151' }} />
    );

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Ward Equity Optimization Matrix</h2>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
            Real-time DMA telemetry &mdash; {filteredWards.length} wards displayed
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6B7280' }}>
          <div
            className="w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ background: '#10B981', boxShadow: '0 0 4px #10B981' }}
          />
          Live Telemetry
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={13} style={{ color: '#4B5563' }} />
        {FILTER_CONFIG.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilter(f.key)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all-200"
            style={{
              background: activeFilter === f.key ? `${f.color}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeFilter === f.key ? f.color + '50' : 'rgba(255,255,255,0.08)'}`,
              color: activeFilter === f.key ? f.color : '#6B7280',
              cursor: 'pointer',
              boxShadow: activeFilter === f.key ? `0 0 10px ${f.color}20` : 'none',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="flex-1 overflow-hidden rounded-xl"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#0E1525' }}
      >
        {/* Table header */}
        <div
          className="grid text-xs font-semibold uppercase"
          style={{
            gridTemplateColumns: '1.8fr 1.2fr 1fr 1fr 1fr 0.8fr',
            padding: '12px 16px',
            color: '#4B5563',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            letterSpacing: '0.07em',
            background: '#0B1020',
          }}
        >
          <span>Ward / DMA</span>
          <button
            className="flex items-center gap-1 cursor-pointer text-left"
            style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', fontWeight: 'inherit', textTransform: 'inherit' }}
            onClick={() => handleSort('headPressure')}
          >
            Head Pressure <SortIcon col="headPressure" />
          </button>
          <button
            className="flex items-center gap-1 cursor-pointer text-left"
            style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', fontWeight: 'inherit', textTransform: 'inherit' }}
            onClick={() => handleSort('elevationDelta')}
          >
            Elev. Delta <SortIcon col="elevationDelta" />
          </button>
          <button
            className="flex items-center gap-1 cursor-pointer text-left"
            style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', fontWeight: 'inherit', textTransform: 'inherit' }}
            onClick={() => handleSort('complaints24h')}
          >
            Complaints 24h <SortIcon col="complaints24h" />
          </button>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* Table rows */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 45px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + sortKey + sortDir + page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {pageData.map((ward, i) => {
                const sc = STATUS_CONFIG[ward.status];
                const pressureColor =
                  ward.headPressure < 0.5
                    ? '#EF4444'
                    : ward.headPressure < 1.2
                    ? '#F59E0B'
                    : '#10B981';

                return (
                  <motion.div
                    key={ward.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    className="table-row-hover grid items-center"
                    style={{
                      gridTemplateColumns: '1.8fr 1.2fr 1fr 1fr 1fr 0.8fr',
                      padding: '13px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {/* Ward / DMA */}
                    <div>
                      <div className="text-sm font-semibold text-white">{ward.name}</div>
                      <div
                        className="text-xs font-metric mt-0.5"
                        style={{ color: '#4B5563' }}
                      >
                        {ward.dmaCode}
                      </div>
                    </div>

                    {/* Head Pressure */}
                    <div>
                      <span
                        className="font-metric text-sm font-semibold"
                        style={{ color: pressureColor }}
                      >
                        {ward.headPressure.toFixed(2)} bar
                      </span>
                      <div className="text-xs mt-0.5" style={{ color: '#6B7280', fontSize: 10 }}>
                        {ward.pressureLabel}
                      </div>
                    </div>

                    {/* Elevation Delta */}
                    <div
                      className="font-metric text-sm font-medium"
                      style={{
                        color: ward.elevationDelta > 0 ? '#F59E0B' : '#10B981',
                      }}
                    >
                      {ward.elevationDelta > 0 ? '+' : ''}
                      {ward.elevationDelta}m
                    </div>

                    {/* Complaints */}
                    <div>
                      <span
                        className="font-metric text-sm font-semibold"
                        style={{
                          color:
                            ward.complaints24h > 120
                              ? '#EF4444'
                              : ward.complaints24h > 60
                              ? '#F59E0B'
                              : '#10B981',
                        }}
                      >
                        {ward.complaints24h}
                      </span>
                      <span className="text-xs ml-1" style={{ color: '#4B5563' }}>
                        /24h
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: sc.bg,
                          border: `1px solid ${sc.border}`,
                          color: sc.color,
                          fontSize: 11,
                        }}
                      >
                        {sc.icon}
                        {sc.label}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div>
                      <button
                        onClick={() => onDeepDive(ward)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all-200"
                        style={{
                          background: 'rgba(0, 242, 254, 0.08)',
                          border: '1px solid rgba(0, 242, 254, 0.2)',
                          color: '#00F2FE',
                          cursor: 'pointer',
                          fontSize: 11,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 242, 254, 0.16)';
                          e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 242, 254, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 242, 254, 0.08)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <ExternalLink size={11} />
                        Deep Dive
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#4B5563' }}>
            Page {page} of {totalPages} &nbsp;&mdash;&nbsp;{' '}
            {filteredWards.length} wards
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-7 h-7 rounded-md text-xs font-medium transition-all-200"
                style={{
                  background:
                    p === page ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${p === page ? 'rgba(0,242,254,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: p === page ? '#00F2FE' : '#6B7280',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
