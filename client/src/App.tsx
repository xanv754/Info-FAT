// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <></>
//   )
// }

// export default App

/**
 * FatMonitor.tsx
 *
 * Vista autónoma para visualizar registros FAT de equipos OLT.
 * Stack: React + TypeScript + TanStack Table v8
 *
 * Dependencias necesarias:
 *   npm install @tanstack/react-table
 *
 * TanStack Query está listado en el stack pero no aplica aquí todavía:
 * los datos llegan de mock. Cuando conectes el backend, reemplaza
 * MOCK_DATA por un useQuery que llame a tu endpoint paginado.
 */

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

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface FatRecord {
  id: number;
  serial: string;
  fat: string | null;
  state: string;
  region: string;
  municipality: string;
  parish: string;
  ip: string;
  address: string | null;
  card: number;
  port: number;
  acronym: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DATA: FatRecord[] = [
  {
    id: 1,
    serial: "HWTC8A2B1F03",
    fat: "FAT-CCS-001",
    state: "Distrito Capital",
    region: "Capital",
    municipality: "Libertador",
    parish: "El Recreo",
    ip: "192.168.10.1",
    address: "Av. Urdaneta, Edif. Centro Simón Bolívar",
    card: 1,
    port: 4,
    acronym: "CCS",
  },
  {
    id: 2,
    serial: "ZTEG7B19D40A",
    fat: "FAT-MCY-014",
    state: "Aragua",
    region: "Central",
    municipality: "Girardot",
    parish: "Las Delicias",
    ip: "10.0.5.22",
    address: "Calle Bermúdez, Local 3",
    card: 2,
    port: 8,
    acronym: "MCY",
  },
  {
    id: 3,
    serial: "HWTC9C3E2210",
    fat: null,
    state: "Zulia",
    region: "Occidental",
    municipality: "Maracaibo",
    parish: "Olegario Villalobos",
    ip: "172.16.0.45",
    address: null,
    card: 1,
    port: 2,
    acronym: "MAR",
  },
  {
    id: 4,
    serial: "FBHN1A88E7C2",
    fat: "FAT-VLN-007",
    state: "Carabobo",
    region: "Central",
    municipality: "Valencia",
    parish: "San José",
    ip: "10.1.3.100",
    address: "Urb. Prebo, Av. Bolívar Norte",
    card: 3,
    port: 1,
    acronym: "VLN",
  },
  {
    id: 5,
    serial: "ZTEG6F2A9C11",
    fat: "FAT-BRQ-021",
    state: "Lara",
    region: "Centroccidental",
    municipality: "Iribarren",
    parish: "Catedral",
    ip: "192.168.50.8",
    address: "Cra. 19 con Calle 21",
    card: 2,
    port: 6,
    acronym: "BRQ",
  },
  {
    id: 6,
    serial: "HWTC4D55B019",
    fat: "FAT-PZO-003",
    state: "Bolívar",
    region: "Guayana",
    municipality: "Caroní",
    parish: "Cachamay",
    ip: "10.20.1.77",
    address: null,
    card: 4,
    port: 3,
    acronym: "PZO",
  },
  {
    id: 7,
    serial: "FBHN2E71C803",
    fat: null,
    state: "Mérida",
    region: "Los Andes",
    municipality: "Libertador",
    parish: "El Sagrario",
    ip: "172.20.0.12",
    address: "Av. 3 Los Próceres, Torre A",
    card: 1,
    port: 7,
    acronym: "MRD",
  },
  {
    id: 8,
    serial: "ZTEG8A40F2D7",
    fat: "FAT-MAT-012",
    state: "Anzoátegui",
    region: "Oriental",
    municipality: "Sotillo",
    parish: "Pozuelos",
    ip: "10.5.8.200",
    address: "Sector La Llanada, Galpón 7",
    card: 2,
    port: 9,
    acronym: "MAT",
  },
  {
    id: 9,
    serial: "HWTC7B12A6E0",
    fat: "FAT-CUM-005",
    state: "Sucre",
    region: "Oriental",
    municipality: "Sucre",
    parish: "Altagracia",
    ip: "192.168.100.3",
    address: "Calle Mariño, frente a Plaza Bolívar",
    card: 3,
    port: 5,
    acronym: "CUM",
  },
  {
    id: 10,
    serial: "FBHN3C90D154",
    fat: "FAT-SCS-019",
    state: "Táchira",
    region: "Los Andes",
    municipality: "San Cristóbal",
    parish: "Pedro María Morantes",
    ip: "10.10.2.55",
    address: null,
    card: 1,
    port: 1,
    acronym: "SCS",
  },
];

// ---------------------------------------------------------------------------
// Filtro de texto personalizado (case-insensitive, null-safe)
// ---------------------------------------------------------------------------

const fuzzyFilter: FilterFn<FatRecord> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (value === null || value === undefined) return false;
  return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
};

// ---------------------------------------------------------------------------
// Column helper
// ---------------------------------------------------------------------------

const columnHelper = createColumnHelper<FatRecord>();

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
    cell: (info) => info.getValue() ?? <span style={styles.nullCell}>—</span>,
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
    cell: (info) => info.getValue() ?? <span style={styles.nullCell}>—</span>,
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

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

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
      headers.map((h) => escape(r[h as keyof FatRecord] as string | number | null)).join(",")
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

// ---------------------------------------------------------------------------
// Subcomponente: input de filtro por columna
// ---------------------------------------------------------------------------

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
      style={styles.filterInput}
    />
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function FatMonitor() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: MOCK_DATA,
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
    [columnFilters]
  );

  const setFilterValue = useCallback(
    (columnId: string, value: string) => {
      setColumnFilters((prev) => {
        const rest = prev.filter((f) => f.id !== columnId);
        return value === "" ? rest : [...rest, { id: columnId, value }];
      });
    },
    []
  );

  const handleDownload = () => {
    const filteredRows = table.getFilteredRowModel().rows.map((r) => r.original);
    const hasFilters = columnFilters.length > 0;
    exportToCSV(filteredRows, hasFilters ? "fat_filtrado.csv" : "fat_completo.csv");
  };

  const numericColumns = new Set(["id", "card", "port"]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>FAT Monitor — OLT Equipment</h1>
        <p style={styles.subtitle}>Optical Line Terminal Traffic Overview</p>
      </header>

      {/* Contenido */}
      <main style={styles.main}>
        {/* Toolbar */}
        <div style={styles.toolbar}>
          <span style={styles.recordCount}>
            {table.getFilteredRowModel().rows.length} de {MOCK_DATA.length} registros
          </span>
          <button style={styles.downloadBtn} onClick={handleDownload}>
            Descargar CSV
          </button>
        </div>

        {/* Tabla con scroll horizontal */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              {/* Fila de encabezados */}
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} style={styles.th}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
              {/* Fila de filtros */}
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={`filter-${headerGroup.id}`} style={styles.filterRow}>
                  {headerGroup.headers.map((header) => (
                    <th key={`filter-${header.id}`} style={styles.filterTh}>
                      <ColumnFilter
                        value={getFilterValue(header.column.id)}
                        onChange={(v) => setFilterValue(header.column.id, v)}
                        type={numericColumns.has(header.column.id) ? "number" : "text"}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={styles.emptyCell}>
                    No hay registros que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                table.getFilteredRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#e0f2fe";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        i % 2 === 0 ? "#ffffff" : "#f8fafc";
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={styles.td}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Estilos inline (sin dependencia de CSS externo ni Tailwind)
// Cuando modularices, pásalos a un .module.css o tu sistema de estilos.
// ---------------------------------------------------------------------------

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: "#0f172a",
  },
  header: {
    backgroundColor: "#0f172a",
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "0.375rem 0 0",
    fontSize: "0.875rem",
    color: "#94a3b8",
  },
  main: {
    maxWidth: "1800px",
    margin: "0 auto",
    padding: "1.5rem",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  recordCount: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  downloadBtn: {
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    border: "none",
    padding: "0.5rem 1.25rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: 600,
    transition: "background-color 0.15s ease",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    backgroundColor: "#ffffff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.875rem",
    minWidth: "1000px",
  },
  th: {
    backgroundColor: "#1e3a5f",
    color: "#e2e8f0",
    padding: "0.75rem 1rem",
    textAlign: "left",
    fontWeight: 600,
    whiteSpace: "nowrap",
    borderBottom: "2px solid #0f172a",
  },
  filterRow: {
    backgroundColor: "#f8fafc",
  },
  filterTh: {
    padding: "0.4rem 0.5rem",
    borderBottom: "1px solid #e2e8f0",
  },
  filterInput: {
    width: "100%",
    padding: "0.3rem 0.5rem",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    fontSize: "0.8rem",
    color: "#0f172a",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
    outline: "none",
  },
  td: {
    padding: "0.65rem 1rem",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
    color: "#1e293b",
  },
  rowEven: {
    backgroundColor: "#ffffff",
  },
  rowOdd: {
    backgroundColor: "#f8fafc",
  },
  nullCell: {
    color: "#94a3b8",
    fontStyle: "italic",
  },
  emptyCell: {
    padding: "2rem",
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.875rem",
  },
};