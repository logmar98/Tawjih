import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { StudentProfile } from '../types/student';

interface LongitudinalChartProps {
  student: StudentProfile;
}

export const LongitudinalChart: React.FC<LongitudinalChartProps> = ({ student }) => {
  // 6 full grades in Moroccan secondary cycle: 1AC, 2AC, 3AC, TC, 1Bac, 2Bac
  const fullCycleLabels: { level: string; label: string; yearNum: string }[] = [
    { level: '1AC', label: '1AC (7th)', yearNum: '7th' },
    { level: '2AC', label: '2AC (8th)', yearNum: '8th' },
    { level: '3AC', label: '3AC (9th)', yearNum: '9th' },
    { level: 'TC', label: 'TC (10th)', yearNum: '10th' },
    { level: '1Bac', label: '1Bac (11th)', yearNum: '11th' },
    { level: '2Bac', label: '2Bac (12th)', yearNum: '12th' },
  ];

  const chartData = fullCycleLabels.map((slot) => {
    const hist = student.historicalYears.find((h) => h.gradeLevel === slot.level);
    if (hist) {
      return {
        name: slot.label,
        level: slot.level,
        yearNum: slot.yearNum,
        math: hist.grades.math,
        physics: hist.grades.physics,
        svt: hist.grades.svt,
        gpa: hist.gpa,
        isCurrent: slot.level === student.currentLevel,
      };
    }
    return {
      name: slot.label,
      level: slot.level,
      yearNum: slot.yearNum,
      math: null,
      physics: null,
      svt: null,
      gpa: null,
      isCurrent: false,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2">{label}</p>
          <div className="space-y-1 font-mono">
            {payload.map((item: any, idx: number) => {
              if (item.value === null) return null;
              return (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}:
                  </span>
                  <span className="font-bold text-slate-100">{item.value.toFixed(1)} / 20</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Trajectoire Longitudinale (Passeport 6 Ans)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Courbe de performance de 1AC (7th) au 2ème Bac (12th) avec gradient de tendance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
            Seuil Concours: 15.5/20
          </span>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="mathGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              domain={[8, 20]}
              ticks={[8, 10, 12, 14, 16, 18, 20]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
              iconType="circle"
            />
            <ReferenceLine
              y={15.5}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: 'Seuil Grandes Écoles (15.5)',
                position: 'insideTopRight',
                fill: '#f59e0b',
                fontSize: 10,
              }}
            />
            {/* Area with smooth gradient for overall GPA */}
            <Area
              type="monotone"
              dataKey="gpa"
              name="Moyenne Générale"
              fill="url(#gpaGradient)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981' }}
              connectNulls
            />
            {/* Smooth line for Mathematics */}
            <Line
              type="monotone"
              dataKey="math"
              name="Mathématiques"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#6366f1' }}
              activeDot={{ r: 5 }}
              connectNulls
            />
            {/* Line for Physics */}
            <Line
              type="monotone"
              dataKey="physics"
              name="Physique-Chimie"
              stroke="#06b6d4"
              strokeWidth={1.8}
              dot={{ r: 2.5, fill: '#06b6d4' }}
              connectNulls
            />
            {/* Line for SVT */}
            <Line
              type="monotone"
              dataKey="svt"
              name="SVT"
              stroke="#ec4899"
              strokeWidth={1.8}
              dot={{ r: 2.5, fill: '#ec4899' }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Cycle : <strong>1ère Année Collège ➔ Baccalauréat</strong></span>
        <span className="text-emerald-400 font-medium">Conforme Massar</span>
      </div>
    </div>
  );
};
