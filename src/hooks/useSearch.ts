import { useState } from 'react';

export const useSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);

  const onSearch = (q: string) => setQuery(q);

  return { query, onSearch };
};
export default useSearch;
