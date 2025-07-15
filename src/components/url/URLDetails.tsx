import React from 'react';
import type { BrokenLink, URLData } from '../../types';
import { StatusBadge, Button, Spinner, Alert } from '../common';
import LinkChart from './LinkChart';
import BrokenLinksList from './BrokenLinksList';
import DetailsList, { type DetailsItem } from './DetailsList';
import SectionHeader from './SectionHeader';
import ChartPanel from './ChartPanel';

interface URLDetailsProps {
  url: URLData;
  brokenLinks: BrokenLink[];
  loading: boolean;
  onStartAnalysis: (id: string) => void;
  onStopAnalysis: (id: string) => void;
}

const URLDetails: React.FC<URLDetailsProps> = ({
  url,
  brokenLinks,
  loading,
  onStartAnalysis,
  onStopAnalysis,
}) => {
  if (loading) {
    return (
      <div className="py-8 text-center">
        <Spinner
          showText
          text="Loading URL details..."
          size="xl"
          color="primary"
        />
      </div>
    );
  }

  const handleAnalysisAction = () => {
    if (url.status === 'running') {
      onStopAnalysis(url.id);
    } else {
      onStartAnalysis(url.id);
    }
  };

  const getAnalysisButtonText = () => {
    switch (url.status) {
      case 'running':
        return 'Stop Analysis';
      case 'queued':
        return 'Start Analysis';
      case 'error':
        return 'Retry Analysis';
      default:
        return 'Run Analysis Again';
    }
  };

  const getAnalysisButtonVariant = () => {
    return url.status === 'running' ? 'secondary' : 'primary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Build the details items array for DetailsList
  const detailsItems: DetailsItem[] = [
    { label: 'HTML Version', value: url.htmlVersion || 'Unknown' },
    { label: 'Login Form', value: url.hasLoginForm ? 'Yes' : 'No' },
    { label: 'Internal Links', value: url.internalLinks },
    { label: 'External Links', value: url.externalLinks },
    { label: 'Broken Links', value: url.brokenLinks },
    { label: 'Created', value: formatDate(url.createdAt) },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {url.title || 'Untitled Page'}
          </h1>
          <a
            href={url.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            {url.url}
          </a>
        </div>
        <StatusBadge status={url.status} />
      </div>

      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row md:justify-between mb-6">
          <div className="md:w-1/2">
            <SectionHeader title="Details" />
            <DetailsList items={detailsItems} />
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <ChartPanel title="Link Distribution">
              <LinkChart
                internalLinks={url.internalLinks}
                externalLinks={url.externalLinks}
                brokenLinks={url.brokenLinks}
              />
            </ChartPanel>
          </div>
        </div>

        <div className="mt-6">
          <SectionHeader
            title={`Broken Links ${brokenLinks.length ? `(${brokenLinks.length})` : ''}`}
            actions={
              <Button
                variant={getAnalysisButtonVariant()}
                onClick={handleAnalysisAction}
              >
                {getAnalysisButtonText()}
              </Button>
            }
          />
          <BrokenLinksList links={brokenLinks} />
        </div>

        {url.status === 'error' && (
          <Alert
            variant="error"
            title="Analysis failed"
            message="There was an error analyzing this URL. Please check that the URL is accessible and try again."
          />
        )}
      </div>
    </div>
  );
};

export default URLDetails;
