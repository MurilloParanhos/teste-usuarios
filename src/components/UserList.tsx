import type { User } from '../types/User';
import { UserCard } from './UserCard';

interface Props {
  users: User[];
  onSelect: (user: User) => void;
}

export function UserList({ users, onSelect }: Props) {
  if (users.length === 0) {
    return <p>Nenhum usuário encontrado.</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <UserCard key={user.id} user={user} onClick={onSelect} />
      ))}
    </ul>
  );
}