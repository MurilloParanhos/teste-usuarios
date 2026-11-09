import { useEffect, useState } from 'react';
import type { User } from './types/User';
import { buscarUsuarios } from './services/api';
import { UserList } from './components/UserList';
import { SearchBar } from './components/SearchBar';
import { UserModal } from './components/UserModal';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    buscarUsuarios()
      .then(setUsers)
      .catch(() => setError('Não foi possível carregar os usuários.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Usuários</h1>
      <SearchBar value={search} onChange={setSearch} />
      <UserList users={filteredUsers} onSelect={setSelectedUser} />

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

export default App;