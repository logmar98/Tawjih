import React, { useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { SubjectGrades } from '../types/student';

interface SubjectClusterChartProps {
  grades: SubjectGrades;
  careerTarget?: string;
}

export const SubjectClusterChart: React.FC<SubjectClusterChartProps> = ({
  grades,
  careerTarget = "Ingénieur (ENSA / CPGE)",
}) => {
  const [viewType, setViewType] = useState<'radar' | 'bar'>('radar');

  const clusterData = [
    {
      subject: 'Mathématiques',
      current: grades.math,
      baseline: 15.5,
      fullMark: 20,
    },
    {
      subject: 'Physique-Chimie',
      current: grades.physics,
      baseline: 15.0,
      fullMark: 20,
    },
    {
      subject: 'SVT',
      current: grades.svt,
      baseline: 14.5,
      fullMark: 20,
    },
    {
      subject: 'Français',
      current: grades.french,
      baseline: 14.0,
      fullMark: 20,
    },
    {
      subject: 'Anglais',
      current: grades.english,
      baseline: 15.0,
      fullMark: 20,
    },
  ];

  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-slate-200 mb-1">{payload[0]?.payload?.subject}</p>
          <div className="space-y-1 font-mono">
            <p className="text-emerald-400">
              Note Actuelle: <strong>{payload[0]?.payload?.current}/20</strong>
            </p>
            <p className="text-indigo-400">
              Cible Seuil: <strong>{payload[0]?.payload?.baseline}/20</strong>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Cluster Disciplinaire vs Seuil Cible
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparatif des compétences par pôle vs le profil requis pour {careerTarget}.
          </p>
        </div>

        {/* View Toggle (Radar vs Bar) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setViewType('radar')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              viewType === 'radar'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => setViewType('bar')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              viewType === 'bar'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Barres
          </button>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'radar' ? (
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={clusterData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="subject"
                stroke="#94a3b8"
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 20]}
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <Radar
                name="Profil Actuel Élève"
                dataKey="current"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.45}
                strokeWidth={2}
              />
              <Radar
                name="Seuil Requis Cible"
                dataKey="baseline"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
              <Tooltip content={<CustomRadarTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            </RadarChart>
          ) : (
            <BarChart data={clusterData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="subject" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 20]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomRadarTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="current" name="Profil Actuel Élève" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="baseline" name="Seuil Requis Cible" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>
          🟢 Vert : Notes actuelles | 🟣 Indigo : Seuils cibles
        </span>
        <span className="font-medium text-slate-300">
          Couverture Pôles :{' '}
          <strong className="text-emerald-400">
            {clusterData.filter((d) => d.current >= d.baseline).length} / 5 Seuils Validés
          </strong>
        </span>
      </div>
    </div>
  );
};
