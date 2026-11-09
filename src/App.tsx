import { useEffect, useState } from 'react';
import type { User } from './types/User';
import { buscarUsuarios } from './services/api';
import { UserList } from './components/UserList';
import { SearchBar } from './components/SearchBar';
import { UserModal } from './components/UserModal';
import { UserListSkeleton } from './components/UserListSkeleton';
import styles from './App.module.css';

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

  if (loading)
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>Usuários</h1>
        </header>
        <UserListSkeleton />
      </div>
    );
  if (error)
    return (
      <div className={styles.status}>
        <p className={styles.error} role="alert">{error}</p>
      </div>
    );

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Usuários</h1>
      </header>
      <SearchBar value={search} onChange={setSearch} />
      <p className={styles.count} aria-live="polite">
        Mostrando {filteredUsers.length} de {users.length} usuários
      </p>
      <UserList
        users={filteredUsers}
        onSelect={setSelectedUser}
        search={search}
      />

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

export default App;
