import type { KeyboardEvent } from 'react';
import type { User } from '../types/User';
import styles from './UserCard.module.css';

interface Props {
  user: User;
  onClick: (user: User) => void;
  highlight?: string;
}

// Envolve em <mark> o trecho do texto que corresponde ao termo buscado.
// Usa a mesma regra do filtro (sem diferenciar maiúsculas de minúsculas).
function highlightMatch(text: string, term: string) {
  if (!term) return text;

  const index = text.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className={styles.highlight}>
        {text.slice(index, index + term.length)}
      </mark>
      {text.slice(index + term.length)}
    </>
  );
}

export function UserCard({ user, onClick, highlight = '' }: Props) {
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
        <strong className={styles.name}>
          {highlightMatch(user.name, highlight)}
        </strong>
        <p className={styles.email}>{user.email}</p>
      </div>
    </li>
  );
}
