import React, { useState } from 'react';
import { Button, TextInput } from '../common';

interface URLFormProps {
  onSubmit: (url: string) => Promise<void>;
}

const URLForm: React.FC<URLFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      setError('URL is required');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      await onSubmit(url);
      setUrl('');
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
          <TextInput
            id="url-input"
            label="Website URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            error={error || undefined}
          />
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
