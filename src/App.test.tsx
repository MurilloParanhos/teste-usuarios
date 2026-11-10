import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { buscarUsuarios } from './services/api';
import type { User } from './types/User';

// Simula a API: os testes não dependem da internet nem da JSONPlaceholder.
vi.mock('./services/api', () => ({
  buscarUsuarios: vi.fn(),
}));

const mockedBuscarUsuarios = vi.mocked(buscarUsuarios);

const users: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031 x56442',
    company: { name: 'Romaguera-Crona' },
    address: { city: 'Gwenborough' },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    email: 'Shanna@melissa.tv',
    phone: '010-692-6593 x09125',
    company: { name: 'Deckow-Crist' },
    address: { city: 'Wisokyburgh' },
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    email: 'Nathan@yesenia.net',
    phone: '1-463-123-4447',
    company: { name: 'Romaguera-Jacobson' },
    address: { city: 'McKenziehaven' },
  },
];

// Os cards têm aria-label "Ver detalhes de <nome>", então é por ele que os
// encontramos (o nome pode estar dividido em pedaços pelo destaque da busca).
function getCard(name: string) {
  return screen.getByRole('button', { name: `Ver detalhes de ${name}` });
}

async function renderWithUsers() {
  mockedBuscarUsuarios.mockResolvedValue(users);
  const user = userEvent.setup();
  render(<App />);
  await screen.findByRole('button', { name: 'Ver detalhes de Leanne Graham' });
  return user;
}

describe('App', () => {
  beforeEach(() => {
    mockedBuscarUsuarios.mockReset();
  });

  describe('carregamento e erro', () => {
    it('mostra o estado de carregando enquanto a API não responde', () => {
      mockedBuscarUsuarios.mockReturnValue(new Promise(() => {}));
      render(<App />);

      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('lista o nome e o email de cada usuário', async () => {
      await renderWithUsers();

      for (const { name, email } of users) {
        expect(getCard(name)).toBeInTheDocument();
        expect(screen.getByText(email)).toBeInTheDocument();
      }
      expect(screen.getByText('Mostrando 3 de 3 usuários')).toBeInTheDocument();
    });

    it('mostra uma mensagem quando a API falha', async () => {
      mockedBuscarUsuarios.mockRejectedValue(new Error('falha de rede'));
      render(<App />);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Não foi possível carregar os usuários.'
      );
      expect(screen.getByRole('heading', { name: 'Usuários' })).toBeInTheDocument();
    });

    it('busca de novo ao clicar em "Tentar novamente"', async () => {
      mockedBuscarUsuarios
        .mockRejectedValueOnce(new Error('falha de rede'))
        .mockResolvedValueOnce(users);
      const user = userEvent.setup();
      render(<App />);

      await user.click(
        await screen.findByRole('button', { name: 'Tentar novamente' })
      );

      expect(
        await screen.findByRole('button', { name: 'Ver detalhes de Leanne Graham' })
      ).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(mockedBuscarUsuarios).toHaveBeenCalledTimes(2);
    });
  });

  describe('busca', () => {
    it('filtra pelo nome, sem diferenciar maiúsculas, e destaca o trecho', async () => {
      const user = await renderWithUsers();

      await user.type(screen.getByLabelText('Buscar pelo nome'), 'LEA');

      expect(getCard('Leanne Graham')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Ver detalhes de Ervin Howell' })
      ).not.toBeInTheDocument();
      expect(screen.getByText('Mostrando 1 de 3 usuários')).toBeInTheDocument();

      const highlight = getCard('Leanne Graham').querySelector('mark');
      expect(highlight).toHaveTextContent('Lea');
    });

    it('ignora espaços no começo e no fim da busca', async () => {
      const user = await renderWithUsers();

      await user.type(screen.getByLabelText('Buscar pelo nome'), '  ervin  ');

      expect(getCard('Ervin Howell')).toBeInTheDocument();
      expect(screen.getByText('Mostrando 1 de 3 usuários')).toBeInTheDocument();
    });

    it('mostra uma mensagem quando nenhum usuário corresponde', async () => {
      const user = await renderWithUsers();

      await user.type(screen.getByLabelText('Buscar pelo nome'), 'zzz');

      expect(screen.getByText('Nenhum usuário encontrado.')).toBeInTheDocument();
    });

    it('limpa a busca pelo botão "×"', async () => {
      const user = await renderWithUsers();
      const input = screen.getByLabelText('Buscar pelo nome');

      await user.type(input, 'ervin');
      await user.click(screen.getByRole('button', { name: 'Limpar busca' }));

      expect(input).toHaveValue('');
      expect(input).toHaveFocus();
      expect(screen.getByText('Mostrando 3 de 3 usuários')).toBeInTheDocument();
    });
  });

  describe('modal de detalhes', () => {
    it('abre ao clicar no usuário, com todos os detalhes', async () => {
      const user = await renderWithUsers();

      await user.click(getCard('Leanne Graham'));

      const dialog = screen.getByRole('dialog', { name: 'Leanne Graham' });
      expect(within(dialog).getByText('Sincere@april.biz')).toBeInTheDocument();
      expect(within(dialog).getByText('1-770-736-8031 x56442')).toBeInTheDocument();
      expect(within(dialog).getByText('Romaguera-Crona')).toBeInTheDocument();
      expect(within(dialog).getByText('Gwenborough')).toBeInTheDocument();
    });

    it('fecha pelo botão "Fechar" e pela tecla Esc', async () => {
      const user = await renderWithUsers();

      await user.click(getCard('Ervin Howell'));
      await user.click(screen.getByRole('button', { name: 'Fechar' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(getCard('Ervin Howell'));
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('pode ser aberto pelo teclado e devolve o foco ao card ao fechar', async () => {
      const user = await renderWithUsers();
      const card = getCard('Clementine Bauch');

      card.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('dialog', { name: 'Clementine Bauch' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();

      await user.keyboard('{Escape}');
      expect(card).toHaveFocus();
    });

    it('mantém o foco dentro do modal ao navegar com Tab', async () => {
      const user = await renderWithUsers();

      await user.click(getCard('Leanne Graham'));
      const dialog = screen.getByRole('dialog');
      const closeButton = within(dialog).getByRole('button', { name: 'Fechar' });
      const emailLink = within(dialog).getByRole('link', { name: 'Sincere@april.biz' });

      // O foco começa em "Fechar", o último elemento: Tab volta ao primeiro.
      expect(closeButton).toHaveFocus();
      await user.tab();
      expect(emailLink).toHaveFocus();

      // Shift+Tab no primeiro elemento vai para o último.
      await user.tab({ shift: true });
      expect(closeButton).toHaveFocus();
    });
  });
});
