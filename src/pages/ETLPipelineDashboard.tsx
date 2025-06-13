// src/pages/ETLPipelineDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Cloud, Settings, Database, ArrowRight } from "lucide-react";

interface WeatherRow {
  timestamp: string;
  city: string;
  temp_c: number;
  humidity: number;
}

export default function ETLPipelineDashboard() {
  const apiBase = import.meta.env.VITE_ETL_API_URL || "http://localhost:8000";
  const [chartData, setChartData] = useState<{ city: string; temp_c: number }[]>([]);
  const [tableData, setTableData] = useState<WeatherRow[]>([]);

  const colorMap: Record<string, string> = {
    Vancouver: "#3b82f6",
    Toronto: "#10b981",
    "New York": "#f59e0b",
    Seoul: "#8b5cf6",
  };

  const refresh = async () => {
    const res = await fetch(`${apiBase}/weather?limit=168`);
    if (!res.ok) throw new Error("Failed to fetch data");
    const payload: WeatherRow[] = await res.json();
    // Sort by timestamp ascending
    const sorted = payload.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    // Deduplicate: latest entry per city
    const dedup: WeatherRow[] = [];
    const seen = new Set<string>();
    for (let i = sorted.length - 1; i >= 0; i--) {
      const row = sorted[i];
      if (!seen.has(row.city)) {
        dedup.unshift(row); // preserve city order
        seen.add(row.city);
      }
    }
    setTableData(dedup);
    // Build chart data: one point per city
    setChartData(dedup.map(r => ({ city: r.city, temp_c: r.temp_c })));
  };

  useEffect(() => { refresh().catch(console.error); }, []);
  useEffect(() => {
    const iv = setInterval(() => { refresh().catch(console.error); }, 60000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="bg-gray-900 h-screen p-4">
      <div className="max-w-7xl mx-auto h-full">
        <div className="bg-gray-800 rounded-2xl h-full flex flex-col p-6">

          {/* Dashboard Title */}
          <h1 className="text-2xl font-bold text-gray-50 text-center mb-6">
            Weather ETL Dashboard
          </h1>

          {/* Chart & Table */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Current Temperatures */}
            <div className="bg-gray-700 rounded-lg p-4 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-50 mb-2">
                Current Temperatures
              </h2>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid stroke="#555" strokeDasharray="3 3" />
                    <XAxis dataKey="city" tick={{ fill: '#bbb', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#bbb', fontSize: 10 }} domain={["auto","auto"]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }}
                      labelStyle={{ color: '#f7fafc' }}
                      itemStyle={{ color: '#f7fafc' }}
                      formatter={(value: number) => `${value.toFixed(1)}°C`}
                      labelFormatter={label => label}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp_c"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                    >
                      <LabelList
                        dataKey="temp_c"
                        position="top"
                        formatter={(value: number) => value.toFixed(1)}
                        style={{ fill: '#f59e0b', fontSize: 12 }}
                      />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Latest Records */}
            <div className="bg-gray-700 rounded-lg p-4 overflow-auto">
              <h2 className="text-lg font-semibold text-gray-50 mb-2">
                Latest Records
              </h2>
              <table className="min-w-full text-sm text-gray-50">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="px-2 py-1">City</th>
                    <th className="px-2 py-1">Temp (°C)</th>
                    <th className="px-2 py-1">Humidity (%)</th>
                    <th className="px-2 py-1">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map(r => (
                    <tr key={r.city} className="odd:bg-gray-800">
                      <td className="px-2 py-1 text-gray-50">{r.city}</td>
                      <td className="px-2 py-1 text-gray-50">{r.temp_c.toFixed(1)}</td>
                      <td className="px-2 py-1 text-gray-50">{r.humidity}</td>
                      <td className="px-2 py-1 text-gray-50">{new Date(r.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* ETL Pipeline Steps */}
          <div className="mt-6 bg-gray-700 rounded-lg p-4 flex flex-col justify-center">
            <h2 className="text-gray-50 font-semibold mb-4">
              ETL Pipeline
            </h2>
            <div className="flex items-center justify-start space-x-4">
              <div className="bg-gray-800 rounded-lg p-3 flex flex-col items-center shadow">
                <Cloud className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-gray-50 mt-1">Extract</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="bg-gray-800 rounded-lg p-3 flex flex-col items-center shadow">
                <Settings className="w-6 h-6 text-green-400" />
                <span className="text-sm text-gray-50 mt-1">Transform</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="bg-gray-800 rounded-lg p-3 flex flex-col items-center shadow">
                <Database className="w-6 h-6 text-purple-400" />
                <span className="text-sm text-gray-50 mt-1">Load</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
