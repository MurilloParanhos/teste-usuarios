import type { User } from '../types/User';
import styles from './UserCard.module.css';

interface Props {
  user: User;
  onClick: (user: User) => void;
}

export function UserCard({ user, onClick }: Props) {
  return (
    <li className={styles.card} onClick={() => onClick(user)}>
      <span className={styles.avatar} aria-hidden="true">
        {user.name.charAt(0)}
      </span>
      <div className={styles.info}>
        <strong className={styles.name}>{user.name}</strong>
        <p className={styles.email}>{user.email}</p>
      </div>
    </li>
  );
}
