import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { urlService } from '../services';
import type { URLData, URLTableFilters } from '../types/urlTypes';

interface URLAnalysisParams {
  url: string;
}

interface URLContextType {
  urls: URLData[];
  loading: boolean;
  error: string | null;
  fetchURLs: (params?: URLTableFilters) => Promise<void>;
  analyzeURL: (params: URLAnalysisParams) => Promise<URLData>;
  deleteURL: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const URLContext = createContext<URLContextType | null>(null);

interface URLProviderProps {
  children: ReactNode;
}

export const URLProvider: React.FC<URLProviderProps> = ({ children }) => {
  const [urls, setURLs] = useState<URLData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchURLs = useCallback(async (params?: URLTableFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await urlService.list(1, 20, params);
      setURLs(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching URLs'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeURL = useCallback(async (params: URLAnalysisParams) => {
    setLoading(true);
    setError(null);
    try {
      const id = await urlService.create(params.url);
      const newURL = await urlService.get(id);
      await urlService.startAnalysis(id);

      setURLs(prevURLs => [newURL, ...prevURLs]);
      return newURL;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred while analyzing URL';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteURL = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await urlService.deleteUrl(id);
      setURLs(prevURLs => prevURLs.filter(url => url.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting URL'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchURLs();
  }, [fetchURLs]);

  useEffect(() => {
    fetchURLs();
  }, [fetchURLs]);

  return (
    <URLContext.Provider
      value={{
        urls,
        loading,
        error,
        fetchURLs,
        analyzeURL,
        deleteURL,
        refreshData,
      }}
    >
      {children}
    </URLContext.Provider>
  );
};

export default URLContext;
