'use client';

import React, { useState } from 'react';
import { Search, Database, Cpu, Wifi, Activity } from 'lucide-react';

interface TelemetryViewProps {
  pipelineData?: any;
}

export default function TelemetryView({ pipelineData }: TelemetryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Default sensor metrics if pipeline data is not yet loaded
  const defaultSensors = [
    { id: 'SEN-01', ward: 'Bhavani Peth', pressure: 4.2, flow: 12.8, latency: 12, status: 'Active' },
    { id: 'SEN-02', ward: 'Kondhwa (South)', pressure: 1.8, flow: 24.5, latency: 45, status: 'Unstable' },
    { id: 'SEN-03', ward: 'Shivajinagar', pressure: 5.1, flow: 38.2, latency: 8, status: 'Active' },
    { id: 'SEN-04', ward: 'Kothrud', pressure: 4.8, flow: 29.0, latency: 15, status: 'Active' },
    { id: 'SEN-05', ward: 'Hadapsar (East)', pressure: 2.1, flow: 31.4, latency: 19, status: 'Active' },
  ];

  // Derive dynamic list of telemetry feeds from pipeline data if available
  const sensors = pipelineData?.wards
    ? pipelineData.wards.map((w: any, idx: number) => ({
        id: `SCADA-W${String(idx + 1).padStart(2, '0')}`,
        ward: w.name,
        pressure: parseFloat(w.headPressure.toFixed(2)),
        flow: parseFloat(((w.elevationDelta + 120) / 6).toFixed(1)),
        latency: Math.round(10 + Math.random() * 40),
        status: w.status === 'critical' ? 'Critical' : w.status === 'watch' ? 'Warning' : 'Active',
      }))
    : defaultSensors;

  const filteredSensors = sensors.filter((s: any) =>
    s.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 p-6" style={{ flex: 1, overflowY: 'auto' }}>
      {/* Telemetry Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="glass-card p-4 flex items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,242,254,0.08)', color: '#00F2FE' }}>
            <Activity size={18} />
          </div>
          <div>
            <div className="text-xs" style={{ color: '#6B7280' }}>Active SCADA Sensors</div>
            <div className="font-metric text-xl font-bold text-white mt-1">{sensors.length} Nodes</div>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981' }}>
            <Wifi size={18} />
          </div>
          <div>
            <div className="text-xs" style={{ color: '#6B7280' }}>Avg Sensor Latency</div>
            <div className="font-metric text-xl font-bold text-white mt-1">
              {(sensors.reduce((acc: number, s: any) => acc + s.latency, 0) / sensors.length).toFixed(1)} ms
            </div>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B' }}>
            <Cpu size={18} />
          </div>
          <div>
            <div className="text-xs" style={{ color: '#6B7280' }}>Data Ingestion Engine</div>
            <div className="font-metric text-xl font-bold text-white mt-1">
              {pipelineData?.pipeline_metadata?.execution_engine || 'Local CPU'}
            </div>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
            <Database size={18} />
          </div>
          <div>
            <div className="text-xs" style={{ color: '#6B7280' }}>Telemetry Buffer</div>
            <div className="font-metric text-xl font-bold text-white mt-1">24-Hour Logs</div>
          </div>
        </div>
      </div>

      {/* Sensor Table */}
      <div className="glass-card overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="text-sm font-bold text-white">Live Node Telemetry Table</div>
            <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>Real-time hydraulic pressures and sensor signals</div>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Node or Ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs px-3 py-2 pl-8 rounded-lg font-medium text-white placeholder-gray-500 transition-all-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                width: 200,
                outline: 'none',
              }}
            />
            <Search className="absolute left-2.5 top-2.5 text-gray-500" size={12} />
          </div>
        </div>

        {/* Column headers */}
        <div
          className="grid text-xs font-semibold px-6 py-3"
          style={{
            gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr',
            color: '#4B5563',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: '#0A0F1A',
          }}
        >
          <span>Node ID</span>
          <span>Ward Location</span>
          <span>Head Pressure</span>
          <span>Flow Rate</span>
          <span>Latency</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {filteredSensors.length > 0 ? (
            filteredSensors.map((s: any, idx: number) => {
              const statusColor = s.status === 'Critical' ? '#EF4444' : s.status === 'Warning' ? '#F59E0B' : '#10B981';
              return (
                <div
                  key={s.id}
                  className="grid items-center px-6 py-3 table-row-hover"
                  style={{
                    gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr',
                    borderBottom: idx < filteredSensors.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <span className="font-metric text-xs font-bold text-gray-400">{s.id}</span>
                  <span className="font-metric text-sm font-semibold text-white">{s.ward}</span>
                  <span className="font-metric text-sm text-gray-300">{s.pressure.toFixed(2)} bar</span>
                  <span className="font-metric text-sm text-gray-300">{s.flow.toFixed(1)} m³/s</span>
                  <span className="font-metric text-xs text-gray-400">{s.latency} ms</span>
                  <span>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded"
                      style={{
                        background: `${statusColor}12`,
                        border: `1px solid ${statusColor}30`,
                        color: statusColor,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                      {s.status}
                    </span>
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-gray-600">No sensors match search parameters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
