'use client';

import React, { useState, useEffect } from 'react';
import Sidebar, { NavId } from '@/components/Sidebar';
import TopBar, { TopSection } from '@/components/TopBar';
import SimulationsView from '@/components/SimulationsView';
import NetworkDiagnosticsView from '@/components/NetworkDiagnosticsView';
import CommandCenterView from '@/components/CommandCenterView';

// Page meta per nav item
const PAGE_META: Record<NavId, { title: string; subtitle: string }> = {
  command: {
    title: 'Network Diagnostics',
    subtitle: 'Real-time infrastructure vulnerability assessment across operational sectors.',
  },
  flow: {
    title: 'Flow Network',
    subtitle: 'Live pipeline topology, flow rates, and valve state monitoring.',
  },
  equity: {
    title: 'Equity Analysis',
    subtitle: 'Ward-level water equity scoring, deficit tracking, and distribution optimization.',
  },
  simulations: {
    title: 'Khadakwasla Basin Simulator',
    subtitle: 'Monsoon Inflow Projection Model (MIPM-4)',
  },
  telemetry: {
    title: 'Telemetry Dashboard',
    subtitle: 'Real-time sensor feeds from all SCADA nodes across the PMC network.',
  },
  archives: {
    title: 'Historical Archives',
    subtitle: 'Searchable repository of past operational logs, sensor data, and incident reports.',
  },
};

function PlaceholderView({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4" style={{ opacity: 0.5 }}>
      <div className="text-4xl">🚧</div>
      <div className="text-lg font-semibold text-white">{title}</div>
      <div className="text-sm" style={{ color: '#6B7280' }}>{subtitle}</div>
    </div>
  );
}

export default function HomePage() {
  const [activeNav, setActiveNav] = useState<NavId>('simulations');
  const [activeSection, setActiveSection] = useState<TopSection>('analytics');
  const [pipelineData, setPipelineData] = useState<any>(null);

  // Fetch the actual pipeline output on mount
  useEffect(() => {
    fetch('/dashboard_data.json')
      .then((res) => res.json())
      .then((data) => {
        setPipelineData(data);
      })
      .catch((err) => {
        console.warn('Could not load live pipeline data, falling back to mock.', err);
      });
  }, []);

  const meta = PAGE_META[activeNav];

  const renderView = () => {
    switch (activeNav) {
      case 'simulations':
        return <SimulationsView pipelineData={pipelineData} />;
      case 'command':
        return <NetworkDiagnosticsView pipelineData={pipelineData} />;
      case 'equity':
        return <CommandCenterView pipelineData={pipelineData} />;
      default:
        return <PlaceholderView title={meta.title} subtitle={meta.subtitle} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0B0F19' }}>
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          pageTitle={meta.title}
          pageSubtitle={meta.subtitle}
        />

        {/* Pipeline engine status indicator */}
        {pipelineData && (
          <div
            className="px-6 py-1.5 flex items-center justify-between text-xs"
            style={{
              background: 'rgba(0, 242, 254, 0.04)',
              borderBottom: '1px solid rgba(0, 242, 254, 0.08)',
              color: '#9CA3AF',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00F2FE' }} />
              Pipeline Engine: <span className="text-white font-semibold">{pipelineData.pipeline_metadata.execution_engine}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Device: <span className="text-white font-semibold">{pipelineData.pipeline_metadata.device}</span></span>
              <span>Compute Time: <span className="text-white font-semibold">{pipelineData.pipeline_metadata.execution_time_sec.toFixed(5)}s</span></span>
            </div>
          </div>
        )}

        {/* View area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0B0F19' }}>
          {renderView()}
        </div>
      </div>
    </div>
  );
}

