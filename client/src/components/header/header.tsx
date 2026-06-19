import styles from "./header.module.css";

export default function HeaderComponent() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>FAT Monitor — OLT Equipment</h1>
      <p className={styles.subtitle}>Optical Line Terminal Traffic Overview</p>
    </header>
  );
}
