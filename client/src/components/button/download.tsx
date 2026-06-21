import styles from "./download.module.css";

interface DownloadButtonProps {
  handlerDownload: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function DownloadButtonComponent({
  handlerDownload,
  disabled = false,
  loading = false,
}: DownloadButtonProps) {
  return (
    <button
      className={styles.downloadBtn}
      onClick={handlerDownload}
      disabled={disabled || loading}
      title={disabled ? "Sin datos para descargar" : undefined}
    >
      {loading ? "Descargando..." : "Descargar XLSX"}
    </button>
  );
}
