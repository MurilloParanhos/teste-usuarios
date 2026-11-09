import type { User } from '../types/User';

interface Props {
  user: User;
  onClick: (user: User) => void;
}

export function UserCard({ user, onClick }: Props) {
  return (
    <li onClick={() => onClick(user)}>
      <strong>{user.name}</strong>
      <p>{user.email}</p>
    </li>
  );
}