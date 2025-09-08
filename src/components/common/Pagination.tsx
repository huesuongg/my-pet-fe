import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element => {
  const maxVisiblePages = 3;

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];

    if (totalPages <= maxVisiblePages * 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const startPages = [...Array(maxVisiblePages)].map((_, i) => i + 1);
      const endPages = [...Array(maxVisiblePages)].map((_, i) => totalPages - maxVisiblePages + i + 1);

      const showMiddle = currentPage > maxVisiblePages && currentPage <= totalPages - maxVisiblePages;

      pages.push(...startPages);

      if (showMiddle) {
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
      } else {
        pages.push('...');
      }

      pages.push(...endPages);
    }

    // Remove duplicates (e.g. when currentPage overlaps with start/end)
    return [...new Set(pages)];
  };

  const goToPrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={styles.pagination}>
      <button onClick={goToPrevious} disabled={currentPage === 1}>
        &laquo; Prev
      </button>

      {getPageNumbers().map((number, idx) =>
        number === '...' ? (
          <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={number}
            className={number === currentPage ? styles.active : ''}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        )
      )}

      <button onClick={goToNext} disabled={currentPage === totalPages}>
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;
