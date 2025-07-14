/* eslint-disable @typescript-eslint/no-explicit-any */
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

    // Backend returns { data: [...], pagination: {...} }
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
    id: string
  ): Promise<{ url: URLData; brokenLinks: BrokenLink[] }> => {
    const response = await apiService.get(`/urls/${id}/results`);

    // The backend returns lowercase field names according to URLResultsDTO
    const {
      url: urlData,
      analysis_results: analysisResults,
      links,
    } = response.data;

    // Map the URL data to our frontend format
    const url: URLData = {
      id: urlData.id.toString(),
      url: urlData.original_url,
      title: analysisResults?.[0]?.title || '',
      htmlVersion: analysisResults?.[0]?.html_version || '',
      internalLinks: analysisResults?.[0]?.internal_link_count || 0,
      externalLinks: analysisResults?.[0]?.external_link_count || 0,
      brokenLinks: links.filter((l: any) => l.status_code >= 400).length,
      hasLoginForm: analysisResults?.[0]?.has_login_form || false,
      status: urlData.status.toLowerCase() as URLStatus,
      createdAt: urlData.created_at,
    };

    // Map the broken links
    const brokenLinks: BrokenLink[] = links
      .filter((l: any) => l.status_code >= 400)
      .map((l: any) => ({
        id: l.id.toString(),
        url: l.href, // Backend uses href for the URL field
        statusCode: l.status_code,
      }));

    return { url, brokenLinks };
  },

  startAnalysis: async (id: string): Promise<void> => {
    await apiService.patch(`/urls/${id}/start`);
  },

  stopAnalysis: async (id: string): Promise<void> => {
    await apiService.patch(`/urls/${id}/stop`);
  },

  deleteUrl: async (id: string): Promise<void> => {
    await apiService.delete(`/urls/${id}`);
  },

  deleteUrls: async (ids: string[]): Promise<void> => {
    // For batch deletes, we'll need to make separate calls
    await Promise.all(ids.map(id => apiService.delete(`/urls/${id}`)));
  },
};

export default urlService;
