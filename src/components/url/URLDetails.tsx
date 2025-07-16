import React from 'react';
import type { BrokenLink, URLData } from '../../types';
import {
  Box,
  Flex,
  ChartPanel,
  StatusBadge,
  Button,
  Spinner,
  Alert,
  Typography,
  LinkChart,
  BrokenLinksList,
  DetailsList,
  SectionHeader,
} from '..';
import type { DetailsItem } from './DetailsList';

interface URLDetailsProps {
  url: URLData;
  brokenLinks: BrokenLink[];
  loading: boolean;
  onStartAnalysis: (id: number) => void;
  onStopAnalysis: (id: number) => void;
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
      <Box padding="xl" className="text-center">
        <Spinner
          showText
          text="Loading URL details..."
          size="xl"
          color="primary"
        />
      </Box>
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString();
  };

  const detailsItems: DetailsItem[] = [
    { label: 'HTML Version', value: url.htmlVersion || 'Unknown' },
    { label: 'Login Form', value: url.hasLoginForm ? 'Yes' : 'No' },
    { label: 'Internal Links', value: url.internalLinks },
    { label: 'External Links', value: url.externalLinks },
    { label: 'Broken Links', value: url.brokenLinks },
    { label: 'Created', value: formatDate(url.createdAt) },
  ];

  return (
    <Box background="white" rounded="lg" shadow="md">
      <Flex
        align="center"
        justify="between"
        className="px-6 py-4 border-b border-gray-200"
      >
        <Box>
          <Typography
            as="h1"
            variant="h5"
            className="text-xl font-semibold text-gray-800"
          >
            {url.title || 'Untitled Page'}
          </Typography>
          <Typography
            as="a"
            href={url.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            className="text-blue-600 hover:underline text-sm"
          >
            {url.url}
          </Typography>
        </Box>
        <StatusBadge status={url.status} />
      </Flex>

      <Box className="px-6 py-4">
        <Flex
          direction="column"
          className="md:flex-row md:justify-between mb-6"
        >
          <Box className="md:w-1/2">
            <SectionHeader title="Details" />
            <DetailsList items={detailsItems} />
          </Box>

          <Box className="md:w-1/2 mt-6 md:mt-0">
            <ChartPanel title="Link Distribution">
              <LinkChart
                internalLinks={url.internalLinks}
                externalLinks={url.externalLinks}
                brokenLinks={url.brokenLinks}
              />
            </ChartPanel>
          </Box>
        </Flex>

        <Box className="mt-6">
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
        </Box>

        {url.status === 'error' && (
          <Alert
            variant="error"
            title="Analysis failed"
            message="There was an error analyzing this URL. Please check that the URL is accessible and try again."
          />
        )}
      </Box>
    </Box>
  );
};

export default URLDetails;
