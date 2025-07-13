// URL status types
export type URLStatus = 'queued' | 'running' | 'done' | 'error' | 'stopped';

// URL data structure
export interface URLData {
  id: string;
  url: string;
  title?: string;
  htmlVersion?: string;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  hasLoginForm: boolean;
  status: URLStatus;
  createdAt: string;
  updatedAt?: string;
}

// Link data structure
export interface LinkData {
  id: string;
  url: string;
  statusCode: number;
  isExternal: boolean;
}

// Filter options for URL table
export interface URLTableFilters {
  status?: URLStatus | 'all';
  hasLoginForm?: boolean;
  hasBrokenLinks?: boolean;
}

// API response structure for paginated URL list
export interface URLListResponse {
  items: URLData[];
  total: number;
  page: number;
  perPage: number;
}

// URL details with links
export interface URLDetailsResponse {
  url: URLData;
  links: LinkData[];
}
