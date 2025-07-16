import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import { Box, Button, Flex, TextInput } from '..';

interface SearchBarProps {
  onSearch: (query: string | number | object) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search URLs...',
  className = '',
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} className={className}>
      <Flex
        direction="column"
        align="stretch"
        gap="sm"
        className="sm:flex-row sm:items-center sm:gap-md"
      >
        <Box className="w-full">
          <TextInput
            id="search-input"
            label="Search"
            labelClassName="sr-only"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            icon={
              <FiSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            }
            iconPosition="left"
            className="mb-0"
            inputClassName="pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2"
          />
        </Box>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="sm:flex-shrink-0"
        >
          <FiSearch className="w-3.5 h-3.5 sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </Flex>
    </Box>
  );
};

export default SearchBar;
