import styles from './UserListSkeleton.module.css';

interface Props {
  count?: number;
}

export function UserListSkeleton({ count = 6 }: Props) {
  return (
    <div role="status" aria-live="polite">
      <span className={styles.srOnly}>Carregando...</span>
      <ul className={styles.list} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className={styles.card}>
            <span className={`${styles.block} ${styles.avatar}`} />
            <div className={styles.info}>
              <span className={`${styles.block} ${styles.name}`} />
              <span className={`${styles.block} ${styles.email}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
