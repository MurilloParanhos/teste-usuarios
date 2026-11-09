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
  // Cada nova tentativa muda este número e faz o useEffect buscar de novo.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    buscarUsuarios()
      .then(setUsers)
      .catch(() => setError('Não foi possível carregar os usuários.'))
      .finally(() => setLoading(false));
  }, [attempt]);

  function handleRetry() {
    setError('');
    setLoading(true);
    setAttempt((current) => current + 1);
  }

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
        <div className={styles.error}>
          <p role="alert">{error}</p>
          <button type="button" className={styles.retry} onClick={handleRetry}>
            Tentar novamente
          </button>
        </div>
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
