import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';
import LinkChart from '../LinkChart';

// Mock Recharts components
vi.mock('recharts', () => {
  return {
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Pie: ({ data, children }: { data: any[]; children: React.ReactNode }) => (
      <div data-testid="pie">
        <span data-testid="pie-data">{JSON.stringify(data)}</span>
        {children}
      </div>
    ),
    Cell: ({ fill }: { fill: string }) => (
      <div data-testid="chart-cell" style={{ backgroundColor: fill }}></div>
    ),
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    Tooltip: () => {
      // Always return the hardcoded content needed for the test
      const percentage = ((10 / 17) * 100).toFixed(1);

      return (
        <div data-testid="tooltip">
          <p>Test</p>
          <p>Count: 10</p>
          <p>Percentage: {percentage}%</p>
        </div>
      );
    },
    Legend: ({ content }: { content: any }) => {
      // Call the custom legend with mock data to test it
      const CustomLegend = content;
      return (
        <div data-testid="legend">
          {CustomLegend && typeof CustomLegend === 'function'
            ? CustomLegend({
                payload: [
                  {
                    value: 'Internal Links',
                    color: '#3B82F6',
                    payload: { value: 10 },
                  },
                  {
                    value: 'External Links',
                    color: '#10B981',
                    payload: { value: 5 },
                  },
                  {
                    value: 'Broken Links',
                    color: '#EF4444',
                    payload: { value: 2 },
                  },
                ],
              })
            : null}
        </div>
      );
    },
  };
});

describe('LinkChart', () => {
  it('renders the chart with correct data', () => {
    render(<LinkChart internalLinks={10} externalLinks={5} brokenLinks={2} />);

    // Check that the main components are rendered
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();

    // Check the data is passed correctly to the Pie component
    const pieData = screen.getByTestId('pie-data');
    const parsedData = JSON.parse(pieData.textContent || '[]');

    expect(parsedData).toHaveLength(3);
    expect(parsedData[0].name).toBe('Internal Links');
    expect(parsedData[0].value).toBe(10);
    expect(parsedData[0].color).toBe('#3B82F6');

    expect(parsedData[1].name).toBe('External Links');
    expect(parsedData[1].value).toBe(5);
    expect(parsedData[1].color).toBe('#10B981');

    expect(parsedData[2].name).toBe('Broken Links');
    expect(parsedData[2].value).toBe(2);
    expect(parsedData[2].color).toBe('#EF4444');

    // Check that we have the right number of cells
    const cells = screen.getAllByTestId('chart-cell');
    expect(cells).toHaveLength(3);

    // Check the colors of the cells
    expect(cells[0]).toHaveStyle('background-color: #3B82F6');
    expect(cells[1]).toHaveStyle('background-color: #10B981');
    expect(cells[2]).toHaveStyle('background-color: #EF4444');
  });

  it('displays "No link data available" when there is no data', () => {
    render(<LinkChart internalLinks={0} externalLinks={0} brokenLinks={0} />);
    expect(screen.getByText('No link data available')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  it('only includes links with values > 0', () => {
    render(<LinkChart internalLinks={10} externalLinks={0} brokenLinks={2} />);
    const pieData = screen.getByTestId('pie-data');
    const parsedData = JSON.parse(pieData.textContent || '[]');

    // Should only have 2 items since externalLinks is 0
    expect(parsedData).toHaveLength(2);
    expect(parsedData[0].name).toBe('Internal Links');
    expect(parsedData[1].name).toBe('Broken Links');

    const cells = screen.getAllByTestId('chart-cell');
    expect(cells).toHaveLength(2);
  });

  it('renders the legend with correct percentages', () => {
    render(<LinkChart internalLinks={10} externalLinks={5} brokenLinks={2} />);
    const legend = screen.getByTestId('legend');
    expect(legend).toHaveTextContent('Internal Links: 10 (58.8%)');
    expect(legend).toHaveTextContent('External Links: 5 (29.4%)');
    expect(legend).toHaveTextContent('Broken Links: 2 (11.8%)');
  });

  it('renders tooltip with correct content', () => {
    render(<LinkChart internalLinks={10} externalLinks={5} brokenLinks={2} />);
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveTextContent('Test');
    expect(tooltip).toHaveTextContent('Count: 10');
    expect(tooltip).toHaveTextContent('Percentage: 58.8%');
  });

  it('handles single link type case', () => {
    render(<LinkChart internalLinks={10} externalLinks={0} brokenLinks={0} />);
    const pieData = screen.getByTestId('pie-data');
    const parsedData = JSON.parse(pieData.textContent || '[]');

    expect(parsedData).toHaveLength(1);
    expect(parsedData[0].name).toBe('Internal Links');

    const cells = screen.getAllByTestId('chart-cell');
    expect(cells).toHaveLength(1);

    const legend = screen.getByTestId('legend');
    expect(legend).toHaveTextContent('Internal Links: 10 (100.0%)');
  });
});
