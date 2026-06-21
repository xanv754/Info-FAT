import styles from "./pagination.module.css";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];

export default function PaginationComponent({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const isFirst = page === 0;
  const isLast = page >= totalPages - 1;

  return (
    <div className={styles.pagination}>
      <div className={styles.pageSize}>
        <label htmlFor="page-size-select">Filas por página</label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className={styles.select}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.controls}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={isFirst}
          className={styles.button}
          title="Página anterior"
        >
          ‹
        </button>
        <span className={styles.pageInfo}>
          Página {page + 1} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          className={styles.button}
          title="Página siguiente"
        >
          ›
        </button>
      </div>
    </div>
  );
}
