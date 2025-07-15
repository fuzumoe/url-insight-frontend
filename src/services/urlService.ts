import apiService from './apiService';
import type { URLData, URLTableFilters, BrokenLink, URLStatus } from '../types';

export const urlService = {
  create: async (url: string): Promise<number> => {
    const response = await apiService.post('/urls', { original_url: url });
    return response.data.id;
  },

  list: async (
    page: number,
    pageSize: number,
    filters?: URLTableFilters
  ): Promise<{
    data: URLData[];
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> => {
    const params = { page, page_size: pageSize, ...filters };
    const response = await apiService.get('/urls', { params });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  get: async (id: string): Promise<URLData> => {
    const response = await apiService.get(`/urls/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: { original_url?: string; status?: string }
  ): Promise<void> => {
    await apiService.put(`/urls/${id}`, data);
  },

  getResults: async (
    id: number
  ): Promise<{ url: URLData; brokenLinks: BrokenLink[] }> => {
    const response = await apiService.get(`/urls/${id}/results`);

    const {
      url: urlData,
      analysis_results: analysisResults,
      links,
    } = response.data;

    interface ApiLink {
      id: number;
      href: string;
      status_code: number;
    }

    const url: URLData = {
      id: urlData.id,
      url: urlData.original_url,
      title: analysisResults?.[0]?.title || '',
      htmlVersion: analysisResults?.[0]?.html_version || '',
      internalLinks: analysisResults?.[0]?.internal_link_count || 0,
      externalLinks: analysisResults?.[0]?.external_link_count || 0,
      brokenLinks: links.filter((l: ApiLink) => l.status_code >= 400).length,
      hasLoginForm: analysisResults?.[0]?.has_login_form || false,
      status: urlData.status.toLowerCase() as URLStatus,
      createdAt: urlData.created_at,
    };

    // Map the broken links
    const brokenLinks: BrokenLink[] = links
      .filter((l: ApiLink) => l.status_code >= 400)
      .map((l: ApiLink) => ({
        id: l.id,
        url: l.href,
        statusCode: l.status_code,
      }));

    return { url, brokenLinks };
  },

  startAnalysis: async (id: number): Promise<void> => {
    await apiService.patch(`/urls/${id}/start`);
  },

  stopAnalysis: async (id: number): Promise<void> => {
    await apiService.patch(`/urls/${id}/stop`);
  },

  deleteUrl: async (id: number): Promise<void> => {
    await apiService.delete(`/urls/${id}`);
  },

  deleteUrls: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map(id => apiService.delete(`/urls/${id}`)));
  },
};

export default urlService;
