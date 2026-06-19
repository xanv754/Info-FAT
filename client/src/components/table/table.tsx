import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
  type FilterFn,
} from "@tanstack/react-table";
import { useState, useCallback } from "react";
import type { FatRecord } from "../../models/fat";
import styles from "./table.module.css";
import ToolbarComponent from "./toolbar";
import DownloadButtonComponent from "../button/download";

const columnHelper = createColumnHelper<FatRecord>();

const fuzzyFilter: FilterFn<FatRecord> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (value === null || value === undefined) return false;
  return String(value)
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());
};

const COLUMNS = [
  columnHelper.accessor("id", {
    header: "ID",
    filterFn: "includesString",
  }),
  columnHelper.accessor("serial", {
    header: "Serial",
    filterFn: fuzzyFilter,
  }),
  columnHelper.accessor("fat", {
    header: "FAT",
    filterFn: fuzzyFilter,
    cell: (info) =>
      info.getValue() ?? <span className={styles.nullCell}>—</span>,
  }),
  columnHelper.accessor("state", {
    header: "Estado",
    filterFn: fuzzyFilter,
  }),
  columnHelper.accessor("region", {
    header: "Región",
    filterFn: fuzzyFilter,
  }),
  columnHelper.accessor("municipality", {
    header: "Municipio",
    filterFn: fuzzyFilter,
  }),
  columnHelper.accessor("parish", {
    header: "Parroquia",
    filterFn: fuzzyFilter,
  }),
  columnHelper.accessor("ip", {
    header: "IP",
    filterFn: fuzzyFilter,
  }),
  columnHelper.accessor("address", {
    header: "Dirección",
    filterFn: fuzzyFilter,
    cell: (info) =>
      info.getValue() ?? <span className={styles.nullCell}>—</span>,
  }),
  columnHelper.accessor("card", {
    header: "Card",
    filterFn: "includesString",
  }),
  columnHelper.accessor("port", {
    header: "Puerto",
    filterFn: "includesString",
  }),
  columnHelper.accessor("acronym", {
    header: "Acrónimo",
    filterFn: fuzzyFilter,
  }),
];

function ColumnFilter({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number";
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filtrar..."
      className={styles.filterInput}
    />
  );
}

function exportToCSV(rows: FatRecord[], filename: string) {
  const headers = [
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

  const escape = (v: string | number | null) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const csvContent = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => escape(r[h as keyof FatRecord] as string | number | null))
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

interface TableProps {
  fats: FatRecord[];
}

export default function TableComponent({ fats }: TableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: fats, //TODO: Importar data obtenida
    columns: COLUMNS,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const getFilterValue = useCallback(
    (columnId: string) => {
      const f = columnFilters.find((f) => f.id === columnId);
      return f ? String(f.value) : "";
    },
    [columnFilters],
  );

  const setFilterValue = useCallback((columnId: string, value: string) => {
    setColumnFilters((prev) => {
      const rest = prev.filter((f) => f.id !== columnId);
      return value === "" ? rest : [...rest, { id: columnId, value }];
    });
  }, []);

  const numericColumns = new Set(["id", "card", "port"]);

  const handleDownload = () => {
    const filteredRows = table
      .getFilteredRowModel()
      .rows.map((r) => r.original);
    const hasFilters = columnFilters.length > 0;
    exportToCSV(
      filteredRows,
      hasFilters ? "fat_filtrado.csv" : "fat_completo.csv",
    );
  };

  return (
    <section>
      <div className={styles.toolbar}>
        <ToolbarComponent table={table} totalData={fats.length} />
        <DownloadButtonComponent handlerDownload={handleDownload} />
      </div>
      <div className={styles.tableWrapper}>
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
                    <ColumnFilter
                      value={getFilterValue(header.column.id)}
                      onChange={(v) => setFilterValue(header.column.id, v)}
                      type={
                        numericColumns.has(header.column.id) ? "number" : "text"
                      }
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.emptyCell}>
                  No hay registros que coincidan con los filtros aplicados.
                </td>
              </tr>
            ) : (
              table.getFilteredRowModel().rows.map((row, i) => (
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
    </section>
  );
}
