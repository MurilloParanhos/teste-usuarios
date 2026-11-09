import type { CSSProperties, KeyboardEvent } from 'react';
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

// Iniciais do primeiro e do último nome, ignorando títulos ("Mrs.")
// e sufixos de uma letra ("V"). Ex.: "Mrs. Dennis Schulist" -> "DS".
function getInitials(name: string) {
  const words = name
    .split(' ')
    .filter((word) => word.length > 1 && !word.endsWith('.'));

  if (words.length === 0) return name.charAt(0).toUpperCase();

  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

// Matiz (0–360) fixa por usuário. O "ângulo de ouro" (~137,5°) espalha
// bem as cores, então ids próximos não ficam com tons parecidos.
function getAvatarHue(id: number) {
  return Math.round((id * 137.508) % 360);
}

export function UserCard({ user, onClick, highlight = '' }: Props) {
  const avatarStyle = { '--avatar-hue': getAvatarHue(user.id) } as CSSProperties;

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
      <span className={styles.avatar} style={avatarStyle} aria-hidden="true">
        {getInitials(user.name)}
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
