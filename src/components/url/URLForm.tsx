import React, { useState } from 'react';
import Button from '../common/Button';

interface URLFormProps {
  onSubmit: (url: string) => Promise<void>;
}

const URLForm: React.FC<URLFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic URL validation
    if (!url) {
      setError('URL is required');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      await onSubmit(url);
      setUrl(''); // Clear the input after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 bg-white rounded-lg shadow"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label
            htmlFor="url-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Website URL
          </label>
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full md:w-auto"
          >
            Add URL for Analysis
          </Button>
        </div>
      </div>
    </form>
  );
};

export default URLForm;
