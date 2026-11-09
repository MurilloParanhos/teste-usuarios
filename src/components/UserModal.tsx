import type { User } from '../types/User';

interface Props {
  user: User;
  onClose: () => void;
}

export function UserModal({ user, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Telefone:</strong> {user.phone}</p>
        <p><strong>Empresa:</strong> {user.company.name}</p>
        <p><strong>Cidade:</strong> {user.address.city}</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}