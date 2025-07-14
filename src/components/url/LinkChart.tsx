import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  type LegendPayload,
} from 'recharts';

import type { Props as LegendContentProps } from 'recharts/types/component/DefaultLegendContent';
import type { CustomTooltipProps } from '../../types';

interface LinkChartProps {
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
}

const LinkChart: React.FC<LinkChartProps> = ({
  internalLinks,
  externalLinks,
  brokenLinks,
}) => {
  const data = [
    { name: 'Internal Links', value: internalLinks, color: '#3B82F6' },
    { name: 'External Links', value: externalLinks, color: '#10B981' },
    { name: 'Broken Links', value: brokenLinks, color: '#EF4444' },
  ].filter(d => d.value > 0);

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">No link data available</p>
      </div>
    );
  }

  const total = internalLinks + externalLinks + brokenLinks;

  const renderLegend = ({ payload }: LegendContentProps) => {
    if (!payload) return null;
    return (
      <ul className="flex flex-wrap justify-center mt-4 gap-4">
        {(payload as readonly LegendPayload[]).map((entry, i) => (
          <li key={i} className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.value}: {entry.payload?.value ?? 0} (
              {(((entry.payload?.value ?? 0) / total) * 100).toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.length) {
      const { name, value, color } = payload[0].payload;
      const pct = ((value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium" style={{ color }}>
            {name}
          </p>
          <p className="text-gray-700">
            Count: <span className="font-medium">{value}</span>
          </p>
          <p className="text-gray-700">
            Percentage: <span className="font-medium">{pct}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LinkChart;
