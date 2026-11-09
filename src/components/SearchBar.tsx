import { useRef } from 'react';
import styles from './SearchBar.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    onChange('');
    inputRef.current?.focus();
  }

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        placeholder="Buscar pelo nome..."
        aria-label="Buscar pelo nome"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          aria-label="Limpar busca"
          onClick={handleClear}
        >
          ×
        </button>
      )}
    </div>
  );
}
