import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/User';
import styles from './UserModal.module.css';

interface Props {
  user: User;
  onClose: () => void;
}

type CopyStatus = 'idle' | 'copied' | 'failed';

// Ícones simples em SVG (traço), sem dependência externa.
function Icon({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </svg>
  );
}

const icons = {
  email: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Icon>
  ),
  phone: (
    <Icon>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Icon>
  ),
  company: (
    <Icon>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </Icon>
  ),
  city: (
    <Icon>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  ),
};

// A API traz telefones como "1-770-736-8031 x56442".
// Para o link tel: usamos só o número principal, sem o ramal.
function toTelHref(phone: string) {
  const mainNumber = phone.split(' x')[0];
  return `tel:${mainNumber.replace(/[^\d+]/g, '')}`;
}

export function UserModal({ user, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

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

  // Teclado: Esc fecha o modal, e Tab / Shift+Tab circulam só entre os
  // elementos do modal, sem escapar para a página atrás do fundo escuro.
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const focusIsInside = modalRef.current.contains(active);

      if (e.shiftKey && (active === first || !focusIsInside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !focusIsInside)) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Depois de 2s, o botão "Copiado!" volta ao texto original.
  useEffect(() => {
    if (copyStatus === 'idle') return;

    const timeout = setTimeout(() => setCopyStatus('idle'), 2000);
    return () => clearTimeout(timeout);
  }, [copyStatus]);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(user.email);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }

  const copyLabel = {
    idle: 'Copiar',
    copied: 'Copiado!',
    failed: 'Não foi possível copiar',
  }[copyStatus];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="user-modal-title" className={styles.title}>{user.name}</h2>

        <p className={styles.field}>
          <strong className={styles.label}>{icons.email} Email:</strong>
          <span className={styles.value}>
            <a className={styles.link} href={`mailto:${user.email}`}>
              {user.email}
            </a>
            <button
              type="button"
              className={`${styles.copy} ${copyStatus === 'copied' ? styles.copied : ''}`}
              onClick={handleCopyEmail}
              aria-label={copyStatus === 'idle' ? 'Copiar email' : copyLabel}
            >
              {copyLabel}
            </button>
          </span>
        </p>
        <p className={styles.field}>
          <strong className={styles.label}>{icons.phone} Telefone:</strong>
          <a className={`${styles.value} ${styles.link}`} href={toTelHref(user.phone)}>
            {user.phone}
          </a>
        </p>
        <p className={styles.field}>
          <strong className={styles.label}>{icons.company} Empresa:</strong>
          <span className={styles.value}>{user.company.name}</span>
        </p>
        <p className={styles.field}>
          <strong className={styles.label}>{icons.city} Cidade:</strong>
          <span className={styles.value}>{user.address.city}</span>
        </p>

        <span className={styles.srOnly} aria-live="polite">
          {copyStatus === 'copied' ? 'Email copiado' : ''}
        </span>

        <button ref={closeButtonRef} className={styles.button} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
