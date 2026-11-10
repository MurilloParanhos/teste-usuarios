import type { User } from '../types/User';

const URL = 'https://jsonplaceholder.typicode.com/users';

export async function buscarUsuarios(): Promise<User[]> {
  const resposta = await fetch(URL);
  if (!resposta.ok) {
    throw new Error('Erro ao buscar usuários');
  }
  return resposta.json();
}
