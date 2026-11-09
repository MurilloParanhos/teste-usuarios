// Adiciona matchers como toBeInTheDocument() ao expect do Vitest
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Desmonta os componentes renderizados entre um teste e outro
afterEach(() => {
  cleanup();
});
