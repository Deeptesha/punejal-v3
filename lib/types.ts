// lib/types.ts
// PuneJal — Type definitions

export type StatusType = 'critical' | 'watch' | 'stable';
export type FilterType = 'all' | 'critical' | 'watch' | 'stable';

export interface Ward {
  id: string;
  name: string;
  dmaCode: string;
  headPressure: number;       // in bar
  pressureLabel: string;      // e.g. "⚠ Low" | "Normal" | "Optimal"
  elevationDelta: number;     // in meters (+/-)
  complaints24h: number;
  status: StatusType;
  zone: string;               // Administrative zone
  population: number;
  pipelineLength: number;     // in km
  lastUpdated: string;        // ISO timestamp
}

export interface SimulatorState {
  drawRate: number;           // TMC/day, range 1.0–2.2
  agriculturalDiversion: number; // %, range 0–50
}

export interface MacroMetrics {
  reservoirCapacity: number;  // %
  reservoirTMC: number;       // TMC
  systemRunwayDays: number;
  criticalWards: number;
  computeRuntime: number;     // seconds
  gpuAcceleration: number;    // x factor
}

export interface BenchmarkEntry {
  name: string;
  runtime: number;            // seconds
  color: string;
  label: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
}

export interface DeepDiveData {
  ward: Ward;
  pressureHistory: { time: string; pressure: number }[];
  complaintHistory: { day: string; count: number }[];
  recommendations: string[];
  networkNodes: number;
  flowRate: number;           // L/s
  reservoirFeed: string;
}
