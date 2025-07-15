import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { describe, it, expect, vi } from 'vitest';

describe('Sidebar', () => {
  it('renders sidebar content when open', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );
    const sidebarElement = container.querySelector('aside');
    expect(sidebarElement).toBeInTheDocument();

    const titleElement = container.querySelector('h2');
    expect(titleElement).toHaveTextContent('URL Insight');
  });

  it('renders a logout button', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const logoutButton = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent?.includes('Log out')
    );

    expect(logoutButton).not.toBeNull();
  });

  it('has correct transformation class when closed', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const sidebarElement = container.querySelector('aside');
    expect(sidebarElement).toHaveClass('-translate-x-full');
  });
});
