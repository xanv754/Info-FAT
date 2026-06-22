import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import * as XLSX from "xlsx";
import type { FatRecord, FatInfo } from "../../models/fat";
import type { FilterEntry } from "../../hooks/useFilteredFat";
import styles from "./table.module.css";
import ToolbarComponent from "./toolbar";
import DownloadButtonComponent from "../button/download";
import PaginationComponent from "./pagination";

const columnHelper = createColumnHelper<FatRecord>();

const COLUMNS = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("serial", { header: "Serial" }),
  columnHelper.accessor("fat", {
    header: "FAT",
    cell: (info) =>
      info.getValue() ?? <span className={styles.nullCell}>—</span>,
  }),
  columnHelper.accessor("state", { header: "Estado" }),
  columnHelper.accessor("region", { header: "Región" }),
  columnHelper.accessor("municipality", { header: "Municipio" }),
  columnHelper.accessor("parish", { header: "Parroquia" }),
  columnHelper.accessor("ip", { header: "IP" }),
  columnHelper.accessor("address", {
    header: "Dirección",
    cell: (info) =>
      info.getValue() ?? <span className={styles.nullCell}>—</span>,
  }),
  columnHelper.accessor("card", { header: "Tarjeta" }),
  columnHelper.accessor("port", { header: "Puerto" }),
  columnHelper.accessor("acronym", { header: "Acrónimo" }),
];

const FILTERABLE_COLUMNS = new Set([
  "serial",
  "fat",
  "state",
  "region",
  "municipality",
  "parish",
  "ip",
  "address",
  "card",
  "port",
  "acronym",
]);

const XLSX_HEADERS = [
  "ID",
  "Serial",
  "FAT",
  "Estado",
  "Región",
  "Municipio",
  "Parroquia",
  "IP",
  "Dirección",
  "Card",
  "Puerto",
  "Acrónimo",
];
const XLSX_KEYS: (keyof FatRecord)[] = [
  "id",
  "serial",
  "fat",
  "state",
  "region",
  "municipality",
  "parish",
  "ip",
  "address",
  "card",
  "port",
  "acronym",
];

function exportToXLSX(rows: FatRecord[], filename: string) {
  const sheetData = [
    XLSX_HEADERS,
    ...rows.map((r) => XLSX_KEYS.map((k) => r[k] ?? "")),
  ];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "FAT");
  XLSX.writeFile(wb, filename);
}

interface TableProps {
  fats: FatRecord[];
  total: number;
  page: number;
  pageSize: number;
  filters: FilterEntry[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onFilterChange: (column: string, value: string) => void;
  loading?: boolean;
}

export default function TableComponent({
  fats,
  total,
  page,
  pageSize,
  filters,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  loading = false,
}: TableProps) {
  const [downloading, setDownloading] = useState(false);

  const table = useReactTable({
    data: fats,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getCoreRowModel().rows;
  const hasFilter = filters.length > 0;
  const from = total > 0 ? page * pageSize + 1 : 0;
  const to = page * pageSize + fats.length;

  const getFilterValue = (columnId: string) =>
    filters.find((f) => f.column === columnId)?.value ?? "";

  const isDownloadDisabled = (hasFilter && fats.length === 0) || total === 0;

  const handleDownload = async () => {
    if (hasFilter) {
      exportToXLSX(fats, "fat_filtrado.xlsx");
      return;
    }

    setDownloading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const params = new URLSearchParams({ ge: "0", le: String(total) });
      const res = await fetch(`${apiUrl}/?${params}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = (await res.json()) as FatInfo;
      exportToXLSX(json.items, "fat_completo.xlsx");
    } catch (err) {
      console.error("Error al descargar datos:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.toolbar}>
        <ToolbarComponent
          count={fats.length}
          from={from}
          to={to}
          total={total}
          loading={loading}
        />
        <DownloadButtonComponent
          handlerDownload={handleDownload}
          disabled={isDownloadDisabled}
          loading={downloading}
        />
      </div>

      <div
        className={`${styles.tableWrapper}${loading ? ` ${styles.loading}` : ""}`}
      >
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.th}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}

            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={`filter-${headerGroup.id}`} className={styles.filterRow}>
                {headerGroup.headers.map((header) => (
                  <th key={`filter-${header.id}`} className={styles.filterTh}>
                    {FILTERABLE_COLUMNS.has(header.column.id) ? (
                      <input
                        type="text"
                        value={getFilterValue(header.column.id)}
                        onChange={(e) =>
                          onFilterChange(header.column.id, e.target.value)
                        }
                        placeholder="Filtrar..."
                        className={styles.filterInput}
                      />
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading && fats.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.emptyCell}>
                  Cargando registros...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.emptyCell}>
                  No hay registros que coincidan con los filtros aplicados.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor = "#e0f2fe";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor =
                      i % 2 === 0 ? "#ffffff" : "#f8fafc";
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.td}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationComponent
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  );
}
