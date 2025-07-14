import React from 'react';
import type { BrokenLink, URLData } from '../../types';
import StatusBadge from '../common/StatusBadge';
import LinkChart from './LinkChart';
import BrokenLinksList from './BrokenLinksList';
import Button from '../common/Button';

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
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading URL details...</p>
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
            <h2 className="text-lg font-medium text-gray-800 mb-4">Details</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-sm font-medium text-gray-500">
                HTML Version
              </dt>
              <dd className="text-sm text-gray-900">
                {url.htmlVersion || 'Unknown'}
              </dd>

              <dt className="text-sm font-medium text-gray-500">Login Form</dt>
              <dd className="text-sm text-gray-900">
                {url.hasLoginForm ? 'Yes' : 'No'}
              </dd>

              <dt className="text-sm font-medium text-gray-500">
                Internal Links
              </dt>
              <dd className="text-sm text-gray-900">{url.internalLinks}</dd>

              <dt className="text-sm font-medium text-gray-500">
                External Links
              </dt>
              <dd className="text-sm text-gray-900">{url.externalLinks}</dd>

              <dt className="text-sm font-medium text-gray-500">
                Broken Links
              </dt>
              <dd className="text-sm text-gray-900">{url.brokenLinks}</dd>

              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="text-sm text-gray-900">
                {formatDate(url.createdAt)}
              </dd>
            </dl>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Link Distribution
            </h2>
            <div className="h-64">
              <LinkChart
                internalLinks={url.internalLinks}
                externalLinks={url.externalLinks}
                brokenLinks={url.brokenLinks}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">
              Broken Links {brokenLinks.length ? `(${brokenLinks.length})` : ''}
            </h2>
            <Button
              variant={getAnalysisButtonVariant()}
              onClick={handleAnalysisAction}
            >
              {getAnalysisButtonText()}
            </Button>
          </div>

          <BrokenLinksList links={brokenLinks} />
        </div>

        {url.status === 'error' && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Analysis failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    There was an error analyzing this URL. Please check that the
                    URL is accessible and try again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default URLDetails;
