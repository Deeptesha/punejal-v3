#!/usr/bin/env python3
"""
PuneJal Data & ML Pipeline (RAPIDS-Accelerated)
Generates realistic SCADA ward-level telemetry, reservoir drawdowns,
and runs cuGraph/cuDF algorithms for optimal water allocation.
"""

import os
import json
import random
import time
from datetime import datetime, timedelta

# Fallback setup for GPU Acceleration Check
try:
    import cudf
    import cugraph
    import cupy
    GPU_ACCEL = True
except ImportError:
    import pandas as pd
    import networkx as nx
    GPU_ACCEL = False

# Setup pipeline export path to Next.js public folder
EXPORT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')
os.makedirs(EXPORT_DIR, exist_ok=True)
EXPORT_PATH = os.path.join(EXPORT_DIR, 'dashboard_data.json')

# 20 Wards of Pune
WARD_SECTORS = [
    {"id": "W01", "name": "Kondhwa (South)", "dma": "DMA-K42", "elevation": 82, "population": 450000},
    {"id": "W02", "name": "Hadapsar (East)", "dma": "DMA-H11", "elevation": 45, "population": 610000},
    {"id": "W03", "name": "Kothrud (West)", "dma": "DMA-KO89", "elevation": 12, "population": 520000},
    {"id": "W04", "name": "Bhavani Peth", "dma": "DMA-B02", "elevation": 28, "population": 142000},
    {"id": "W05", "name": "Shivajinagar", "dma": "DMA-S01", "elevation": -8, "population": 280000},
    {"id": "W06", "name": "Pune Cantonment", "dma": "DMA-C01", "elevation": 15, "population": 450000},
    {"id": "W07", "name": "Karve Nagar", "dma": "DMA-K04", "elevation": 38, "population": 310000},
    {"id": "W08", "name": "Warje", "dma": "DMA-W02", "elevation": 52, "population": 250000},
    {"id": "W09", "name": "Dhayari", "dma": "DMA-D07", "elevation": 61, "population": 180000},
    {"id": "W10", "name": "Ambegaon BK", "dma": "DMA-A03", "elevation": 74, "population": 120000},
    {"id": "W11", "name": "Bibvewadi", "dma": "DMA-B08", "elevation": 41, "population": 210000},
    {"id": "W12", "name": "Bavdhan", "dma": "DMA-B03", "elevation": 22, "population": 190000},
    {"id": "W13", "name": "Pashan", "dma": "DMA-P04", "elevation": 18, "population": 230000},
    {"id": "W14", "name": "Katraj", "dma": "DMA-K09", "elevation": 58, "population": 290000},
    {"id": "W15", "name": "Dhanori", "dma": "DMA-D03", "elevation": 11, "population": 160000},
    {"id": "W16", "name": "Lohegaon", "dma": "DMA-L02", "elevation": 9, "population": 220000},
    {"id": "W17", "name": "Vishrantwadi", "dma": "DMA-V05", "elevation": 24, "population": 170000},
    {"id": "W18", "name": "Mundhwa", "dma": "DMA-M06", "elevation": 4, "population": 195000},
    {"id": "W19", "name": "Yerwada", "dma": "DMA-Y03", "elevation": -2, "population": 240000},
    {"id": "W20", "name": "Aundh", "dma": "DMA-A01", "elevation": 1, "population": 320000}
]

def run_pipeline():
    print(f"=== PuneJal Pipeline Run: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===")
    t_start = time.time()
    
    # 1. Generate Raw SCADA Telemetry
    raw_data = []
    for sector in WARD_SECTORS:
        # Base pressures impacted by elevation (higher elevation = lower base pressure)
        base_pressure = max(0.2, 2.0 - (sector["elevation"] / 50.0))
        # Simulated SCADA fluctuations over past 24 hours (24 readings per ward)
        for hour in range(24):
            pressure = max(0.1, base_pressure + random.uniform(-0.15, 0.15))
            complaints = int(random.uniform(0, 10)) if pressure > 0.8 else int(random.uniform(5, 25))
            raw_data.append({
                "ward_id": sector["id"],
                "hour": hour,
                "pressure": pressure,
                "complaints": complaints,
                "elevation": sector["elevation"],
                "population": sector["population"]
            })
            
    # 2. Acceleration Layer (cuDF / Pandas): Processing SCADA reads & computing rolling stress
    print(f"Loading data using {'cuDF (GPU Accelerated)' if GPU_ACCEL else 'Pandas (CPU Baseline)'}...")
    if GPU_ACCEL:
        df = cudf.DataFrame(raw_data)
        # Compute rolling averages and stress index
        df['rolling_pressure'] = df.groupby('ward_id')['pressure'].transform(lambda x: x.rolling(4, min_periods=1).mean())
        df['rolling_complaints'] = df.groupby('ward_id')['complaints'].transform(lambda x: x.rolling(4, min_periods=1).sum())
        
        # Stress Score: High complaints + low pressure + high elevation
        df['stress_score'] = (1.5 - df['rolling_pressure']) * 0.4 + (df['rolling_complaints'] / 50.0) * 0.3 + (df['elevation'] / 100.0) * 0.3
        df['stress_score'] = df['stress_score'].clip(lower=0.1, upper=1.0)
        
        summary_df = df.groupby('ward_id').agg({
            'pressure': 'mean',
            'complaints': 'sum',
            'stress_score': 'mean'
        }).reset_index().to_pandas()
    else:
        df = pd.DataFrame(raw_data)
        df['rolling_pressure'] = df.groupby('ward_id')['pressure'].transform(lambda x: x.rolling(4, min_periods=1).mean())
        df['rolling_complaints'] = df.groupby('ward_id')['complaints'].transform(lambda x: x.rolling(4, min_periods=1).sum())
        df['stress_score'] = (1.5 - df['rolling_pressure']) * 0.4 + (df['rolling_complaints'] / 50.0) * 0.3 + (df['elevation'] / 100.0) * 0.3
        df['stress_score'] = df['stress_score'].clip(lower=0.1, upper=1.0)
        summary_df = df.groupby('ward_id').agg({
            'pressure': 'mean',
            'complaints': 'sum',
            'stress_score': 'mean'
        }).reset_index()

    # 3. Acceleration Layer (cuGraph / NetworkX): Generating pipeline topology & centrality routing
    print(f"Running graph topology centrality checks with {'cuGraph' if GPU_ACCEL else 'NetworkX'}...")
    # Build a simulated ring + radial pipe distribution network grid
    edges = []
    for i in range(len(WARD_SECTORS)):
        # Main ring connection
        edges.append((WARD_SECTORS[i]["id"], WARD_SECTORS[(i + 1) % len(WARD_SECTORS)]["id"]))
        # Radial feeder connection to water reservoir hubs (W01, W05, W10)
        if i % 3 == 0:
            edges.append(("W01", WARD_SECTORS[i]["id"]))
        if i % 4 == 0:
            edges.append(("W05", WARD_SECTORS[i]["id"]))

    if GPU_ACCEL:
        # cuGraph Edge list setup
        pdf_edges = pd.DataFrame(edges, columns=['src_id', 'dst_id'])
        # Map string IDs to integer nodes for cuGraph compatibility
        id_map = {sector["id"]: idx for idx, sector in enumerate(WARD_SECTORS)}
        pdf_edges['src'] = pdf_edges['src_id'].map(id_map)
        pdf_edges['dst'] = pdf_edges['dst_id'].map(id_map)
        
        gdf_edges = cudf.DataFrame(pdf_edges[['src', 'dst']])
        G = cugraph.Graph()
        G.from_cudf_edgelist(gdf_edges, source='src', destination='dst')
        
        centrality = cugraph.betweenness_centrality(G)
        centrality_pd = centrality.to_pandas()
        # Remap back to ward IDs
        rev_map = {idx: sector["id"] for idx, sector in enumerate(WARD_SECTORS)}
        centrality_pd['ward_id'] = centrality_pd['vertex'].map(rev_map)
        centrality_map = dict(zip(centrality_pd['ward_id'], centrality_pd['betweenness_centrality']))
    else:
        G = nx.Graph()
        G.add_edges_from(edges)
        centrality = nx.betweenness_centrality(G)
        centrality_map = centrality

    # 4. Synthesize Ward Analytics
    processed_wards = []
    for sector in WARD_SECTORS:
        ward_id = sector["id"]
        stats = summary_df[summary_df['ward_id'] == ward_id].iloc[0]
        
        # Calculate status
        stress = float(stats['stress_score'])
        if stress > 0.7:
            status = "critical"
            policy = "Mandatory Rationing"
            deficit = -int(stress * 55)
        elif stress > 0.45:
            status = "watch"
            policy = "Voluntary Reduction"
            deficit = -int(stress * 25)
        else:
            status = "stable"
            policy = "Stable (24h Supply)"
            deficit = 0

        processed_wards.append({
            "id": sector["id"],
            "name": sector["name"],
            "dmaCode": sector["dma"],
            "headPressure": float(stats['pressure']),
            "pressureLabel": "Normal" if stats['pressure'] > 1.0 else "⚠ Low",
            "elevationDelta": sector["elevation"],
            "complaints24h": int(stats['complaints']),
            "status": status,
            "policy": policy,
            "deficit": deficit,
            "fragility": float(centrality_map.get(ward_id, 0.15)) * 2.5 + (sector["elevation"] / 200.0)
        })

    # Sort so Kondhwa and Hadapsar appear first just like the mockups
    processed_wards.sort(key=lambda w: w["deficit"])

    # 5. Output JSON schema
    output_data = {
        "pipeline_metadata": {
            "execution_engine": "GPU-Accelerated (cuDF/cuGraph)" if GPU_ACCEL else "CPU-Baseline (Pandas/NetworkX)",
            "execution_time_sec": float(time.time() - t_start),
            "device": "NVIDIA L4 Tensor Core GPU" if GPU_ACCEL else "Intel Xeon CPU Core",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        },
        "wards": processed_wards,
        "reservoir": {
            "capacity_pct": 32.5,
            "total_tmc": 29.15,
            "current_tmc": 9.45,
            "simulated_inflow_tmc": 2.00,
            "buffer_days": 85,
            "pre_sim_days": 24,
            "turbidity_ntu": 18.5
        }
    }

    with open(EXPORT_PATH, 'w') as f:
        json.dump(output_data, f, indent=2)
        
    print(f"Data pipeline finished successfully. Exported to: {EXPORT_PATH}")
    print(f"Execution time: {output_data['pipeline_metadata']['execution_time_sec']:.5f}s")

if __name__ == "__main__":
    run_pipeline()
