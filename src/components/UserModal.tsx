import type { User } from '../types/User';
import styles from './UserModal.module.css';

interface Props {
  user: User;
  onClose: () => void;
}

export function UserModal({ user, onClose }: Props) {
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
        <button className={styles.button} onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
