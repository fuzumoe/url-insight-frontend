export type URLStatus = 'queued' | 'running' | 'done' | 'error' | 'stopped';

export interface URLData {
  id: number;
  url: string;
  title?: string;
  htmlVersion?: string;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  hasLoginForm: boolean;
  status: URLStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface LinkData {
  id: string;
  url: string;
  statusCode: number;
  isExternal: boolean;
}

export interface URLTableFilters {
  status?: URLStatus;
  hasLoginForm?: boolean;
  hasBrokenLinks?: boolean;
  latestOnly?: boolean;
}

export interface URLListResponse {
  items: URLData[];
  total: number;
  page: number;
  perPage: number;
}

export interface URLDetailsResponse {
  url: URLData;
  links: LinkData[];
}
