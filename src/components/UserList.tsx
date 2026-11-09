import type { User } from '../types/User';
import { UserCard } from './UserCard';
import styles from './UserList.module.css';

interface Props {
  users: User[];
  onSelect: (user: User) => void;
}

export function UserList({ users, onSelect }: Props) {
  if (users.length === 0) {
    return <p className={styles.empty}>Nenhum usuário encontrado.</p>;
  }

  return (
    <ul className={styles.list}>
      {users.map((user) => (
        <UserCard key={user.id} user={user} onClick={onSelect} />
      ))}
    </ul>
  );
}
