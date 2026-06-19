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
import styles from "./table.styles.module.css";

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

export default function TableComponent() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: [], //TODO: Importar data obtenida
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

  return (
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
                  ).style.backgroundColor = i % 2 === 0 ? "#ffffff" : "#f8fafc";
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
