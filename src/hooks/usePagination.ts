import { useState } from 'react';

export const usePagination = (initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page: number) => setCurrentPage(page);
  const nextPage = () => setCurrentPage(p => p + 1);
  const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));

  return { currentPage, goToPage, nextPage, prevPage };
};
export default usePagination;
