import type { Table } from "@tanstack/react-table";
import type { FatRecord } from "../../models/fat";
import styles from "./toolbar.module.css";

interface ToolbarProps {
  table: Table<FatRecord>;
  totalData: number;
}

export default function ToolbarComponent({ table, totalData }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <span className={styles.recordCount}>
        {table.getFilteredRowModel().rows.length} de {totalData} registros
      </span>
    </div>
  );
}
