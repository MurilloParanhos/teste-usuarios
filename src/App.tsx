import { UserList } from './components/UserList';
import { useEffect, useState } from 'react';
import type { User } from './types/User';
import { buscarUsuarios } from './services/api';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    buscarUsuarios()
      .then(setUsers)
      .catch(() => setError('Não foi possível carregar os usuários.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
  <div>
    <h1>Usuários</h1>
    <UserList users={users} onSelect={(user) => console.log(user)} />
  </div>
);
}

export default App;