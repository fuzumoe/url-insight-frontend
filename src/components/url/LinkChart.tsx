import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

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
  // Prepare data for the chart
  const data = [
    { name: 'Internal Links', value: internalLinks, color: '#3B82F6' }, // blue
    { name: 'External Links', value: externalLinks, color: '#10B981' }, // green
    { name: 'Broken Links', value: brokenLinks, color: '#EF4444' }, // red
  ].filter(item => item.value > 0); // Only include links with values > 0

  // If there's no data, show a message
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">No link data available</p>
      </div>
    );
  }

  // Calculate total links for percentage display
  const totalLinks = internalLinks + externalLinks + brokenLinks;

  // Custom tooltip to show count and percentage
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, color } = payload[0].payload;
      const percentage = ((value / totalLinks) * 100).toFixed(1);

      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium" style={{ color }}>
            {name}
          </p>
          <p className="text-gray-700">
            Count: <span className="font-medium">{value}</span>
          </p>
          <p className="text-gray-700">
            Percentage: <span className="font-medium">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend with colored squares
  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center mt-4 gap-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.value}: {entry.payload.value} (
              {((entry.payload.value / totalLinks) * 100).toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    );
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LinkChart;
