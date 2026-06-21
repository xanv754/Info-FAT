import { useState } from "react";
import styles from "./styles.module.css";
import HeaderComponent from "./components/header/header";
import TableComponent from "./components/table/table";
import { useFat } from "./hooks/useFat";
import { useFilteredFat, type FilterEntry } from "./hooks/useFilteredFat";

export default function FatMonitor() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<FilterEntry[]>([]);

  const { data: paginatedData, loading: paginatedLoading, error: paginatedError } = useFat(page, pageSize);
  const { data: filteredData, loading: filteredLoading, error: filteredError } = useFilteredFat(filters);

  const hasFilter = filters.length > 0;
  const data = hasFilter ? filteredData : paginatedData;
  const loading = hasFilter ? filteredLoading : paginatedLoading;
  const error = hasFilter ? filteredError : paginatedError;

  const handleFilterChange = (column: string, value: string) => {
    setFilters((prev) => {
      const rest = prev.filter((f) => f.column !== column);
      if (value === "") return rest;
      return [...rest, { column, value }];
    });
    setPage(0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <main className={styles.page}>
      <HeaderComponent />
      <TableComponent
        fats={data?.items ?? []}
        total={data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        filters={filters}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
        loading={loading}
      />
    </main>
  );
}
