export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(dateString);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return dateString;
  }
};

export const formatUrl = (url: string, maxLength: number = 50): string => {
  if (!url) return '';

  try {
    let formattedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');

    if (formattedUrl.length > maxLength) {
      formattedUrl = formattedUrl.substring(0, maxLength - 3) + '...';
    }

    return formattedUrl;
  } catch (error) {
    console.error('Error formatting URL:', error);
    return url;
  }
};

export const formatNumber = (num: number): string => {
  if (num === undefined || num === null) return '';

  try {
    return new Intl.NumberFormat('en-US').format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
};

export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - 3) + '...';
};

export const formatStatus = (status: string): string => {
  if (!status) return '';

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};
