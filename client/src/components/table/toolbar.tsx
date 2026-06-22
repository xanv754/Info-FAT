import styles from "./toolbar.module.css";

interface ToolbarProps {
  count: number;
  from: number;
  to: number;
  total: number;
  loading: boolean;
}

export default function ToolbarComponent({
  count,
  from,
  to,
  total,
  loading,
}: ToolbarProps) {
  let label: string;

  if (loading && count === 0) {
    label = "Cargando registros...";
  } else if (total === 0) {
    label = "Sin registros";
  } else {
    label = `${from}–${to} de ${total} registros`;
  }

  return <span className={styles.recordCount}>{label}</span>;
}
