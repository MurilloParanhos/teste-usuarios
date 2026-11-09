import type { KeyboardEvent } from 'react';
import type { User } from '../types/User';
import styles from './UserCard.module.css';

interface Props {
  user: User;
  onClick: (user: User) => void;
}

export function UserCard({ user, onClick }: Props) {
  function handleKeyDown(e: KeyboardEvent<HTMLLIElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(user);
    }
  }

  return (
    <li
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${user.name}`}
      onClick={() => onClick(user)}
      onKeyDown={handleKeyDown}
    >
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
