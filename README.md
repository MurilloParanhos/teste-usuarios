# Teste Usuários

Aplicação em React + Vite + TypeScript que consome a API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) e exibe uma lista de usuários, com busca pelo nome e um modal de detalhes.

Desenvolvida como desafio técnico para a vaga de Desenvolvedor Front-End Júnior.

## Como rodar

Pré-requisito: Node.js em uma versão LTS recente (o projeto foi testado com o Node 24).

```bash
npm install
npm run dev
```

Depois, acesse o endereço exibido no terminal (por padrão, http://localhost:5173).

### Outros comandos

| Comando | O que faz |
| --- | --- |
| `npm test` | Roda os testes uma vez |
| `npm run test:watch` | Roda os testes e fica observando alterações |
| `npm run build` | Verifica os tipos com TypeScript e gera a versão de produção |
| `npm run lint` | Analisa o código com o Oxlint |

## Funcionalidades

### Requisitos do desafio

- Listagem de usuários a partir de `https://jsonplaceholder.typicode.com/users`, exibindo nome e email.
- Campo de busca que filtra os usuários pelo nome, sem diferenciar maiúsculas de minúsculas e ignorando espaços no começo e no fim.
- Modal de detalhes ao clicar em um usuário, com nome completo, email, telefone, empresa e cidade.
- Estados visuais de carregando e de erro.

### Melhorias de UI/UX

- **Skeleton loading:** durante o carregamento, aparecem cards provisórios com o mesmo tamanho dos cards reais, evitando que o layout "pule" quando os dados chegam.
- **Tentar novamente:** em caso de erro, um botão refaz a requisição sem precisar recarregar a página.
- **Destaque na busca:** o trecho digitado aparece destacado no nome do usuário.
- **Contador de resultados:** "Mostrando X de Y usuários", atualizado conforme a busca.
- **Botão para limpar a busca**, que devolve o foco ao campo.
- **Avatares com iniciais e uma cor fixa por usuário**, o que facilita identificar cada pessoa na lista.
- **Modal mais completo:** ícones nos campos, email e telefone clicáveis (abrem o app de email e o discador) e botão para copiar o email, com confirmação visual.
- **Visual responsivo**, com suporte a tema claro e escuro conforme a preferência do sistema.
- **Paleta de cores baseada na identidade visual da CDT Software**, com os tons ajustados para manter contraste acessível.

### Acessibilidade

- Os cards podem ser acessados com Tab e abertos com Enter ou Espaço.
- O modal fecha com a tecla Esc, recebe o foco ao abrir e devolve o foco ao card de origem ao fechar.
- Com o modal aberto, Tab e Shift+Tab circulam apenas entre os elementos do modal, sem escapar para a página ao fundo.
- A rolagem da página fica travada enquanto o modal está aberto.
- Os elementos têm rótulos para leitores de tela (`aria-label`, `role="dialog"`, `role="alert"`, `aria-live`).
- As cores principais de texto, links e botões foram conferidas para atender ao contraste mínimo da WCAG AA.
- As animações respeitam a preferência de "reduzir movimento" do sistema.

## Tecnologias

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [CSS Modules](https://github.com/css-modules/css-modules) para estilização
- [Vitest](https://vitest.dev/) e [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) para testes
- [Oxlint](https://oxc.rs/) para análise de código

## Estrutura do projeto

```
src/
├── components/
│   ├── SearchBar.tsx          # Campo de busca com botão de limpar
│   ├── UserCard.tsx           # Card de um usuário (avatar, nome e email)
│   ├── UserList.tsx           # Lista de cards e mensagem de "nenhum resultado"
│   ├── UserListSkeleton.tsx   # Cards provisórios do estado de carregando
│   └── UserModal.tsx          # Modal com os detalhes do usuário
├── services/
│   └── api.ts                 # Requisição à API JSONPlaceholder
├── types/
│   └── User.ts                # Tipo User
├── App.tsx                    # Estado da aplicação, busca e composição da tela
├── App.test.tsx               # Testes da aplicação
├── index.css                  # Variáveis de cores e estilos globais
└── main.tsx                   # Ponto de entrada
```

Cada componente tem o seu arquivo `.module.css` ao lado, com estilos isolados.

## Decisões técnicas

- **Separação de responsabilidades:** a requisição fica em `services/`, os tipos em `types/` e a interface em `components/`. O `App` concentra o estado (usuários, carregando, erro, busca e usuário selecionado) e repassa dados e callbacks aos componentes por props.
- **Busca no lado do cliente:** como a API retorna poucos usuários de uma vez, o filtro é feito em memória a cada digitação, sem novas requisições.
- **CSS Modules:** escolhidos por isolar os estilos de cada componente sem adicionar dependências, já que o Vite tem suporte nativo. As cores ficam centralizadas em variáveis CSS no `index.css`, o que facilita trocar o tema.
- **Vitest em vez de Jest:** o Vitest usa a mesma configuração do Vite e tem a mesma API do Jest (`describe`, `it`, `expect`), o que simplifica a configuração.

## Testes

Os testes ficam em `src/App.test.tsx` e cobrem os requisitos do desafio:

- estado de carregando, listagem com nome e email, estado de erro e o botão "Tentar novamente";
- busca sem diferenciar maiúsculas e ignorando espaços, destaque do trecho buscado, mensagem de "nenhum usuário encontrado" e botão de limpar;
- abertura do modal com todos os detalhes, fechamento pelo botão e pela tecla Esc, navegação pelo teclado e foco preso dentro do modal.

A API é simulada com `vi.mock`, então os testes não dependem de conexão com a internet. Os elementos são buscados como o usuário os percebe (pelo papel e pelo texto acessível), seguindo as boas práticas da Testing Library.

## Uso de IA

A estrutura do projeto, o consumo da API, a busca e o modal foram desenvolvidos por mim. Usei o Claude (IA da Anthropic) como apoio para acelerar a parte de estilização e UI/UX (CSS Modules, acessibilidade, skeleton loading, destaque da busca, avatares, melhorias do modal) e na configuração dos testes. Revisei e testei cada alteração antes de incorporá-la ao projeto.
