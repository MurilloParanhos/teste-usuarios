import { useEffect, useRef } from 'react';
import type { User } from '../types/User';
import styles from './UserModal.module.css';

interface Props {
  user: User;
  onClose: () => void;
}

export function UserModal({ user, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Ao abrir: trava a rolagem da página e leva o foco para o botão "Fechar".
  // Ao fechar: restaura a rolagem e devolve o foco ao card que abriu o modal.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  // Fecha o modal com a tecla Esc.
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="user-modal-title" className={styles.title}>{user.name}</h2>
        <p className={styles.field}><strong>Email:</strong> {user.email}</p>
        <p className={styles.field}><strong>Telefone:</strong> {user.phone}</p>
        <p className={styles.field}><strong>Empresa:</strong> {user.company.name}</p>
        <p className={styles.field}><strong>Cidade:</strong> {user.address.city}</p>
        <button ref={closeButtonRef} className={styles.button} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
