import { useState, useCallback } from 'react';
import { urlService } from '../services';
import type { URLData } from '../types';

export const useURLAnalysis = () => {
  const [urls, setUrls] = useState<URLData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchURLs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await urlService.list(1, 10);
      setUrls(response.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeURL = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const id = await urlService.create(url);
      // Fetch the created URL data after creation
      const result = await urlService.get(id);
      setUrls(prev => [...prev, result]);
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to analyze URL');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { urls, loading, error, fetchURLs, analyzeURL };
};
export default useURLAnalysis;
