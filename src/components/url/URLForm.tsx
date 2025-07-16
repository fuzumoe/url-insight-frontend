import React, { useState } from 'react';
import { Box, Flex, Button, TextInput } from '..';
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
    <Box
      as="form"
      onSubmit={handleSubmit}
      background="white"
      shadow="md"
      rounded="lg"
      padding="md"
      className="mb-6"
    >
      <Flex direction="column" gap="md" className="md:flex-row">
        <Box className="flex-1">
          <TextInput
            id="url-input"
            label="Website URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            error={error || undefined}
          />
        </Box>
        <Flex align="end">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full md:w-auto"
          >
            Add URL for Analysis
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default URLForm;
