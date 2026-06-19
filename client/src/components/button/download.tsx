import styles from "./download.module.css";

interface DownloadButtonProps {
  handlerDownload: () => void;
}

export default function DownloadButtonComponent({
  handlerDownload,
}: DownloadButtonProps) {
  return (
    <button className={styles.downloadBtn} onClick={handlerDownload}>
      Descargar CSV
    </button>
  );
}
