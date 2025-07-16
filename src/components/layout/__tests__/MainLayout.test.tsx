import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainLayout from '../MainLayout';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../Header', () => ({
  default: (props: { toggleSidebar: () => void }) => (
    <div data-testid="header" onClick={props.toggleSidebar}>
      Header
    </div>
  ),
}));

vi.mock('../Sidebar', () => ({
  default: (props: { isOpen: boolean; onClose: () => void }) => (
    <div data-testid="sidebar" onClick={props.onClose}>
      {props.isOpen ? 'Open' : 'Closed'}
    </div>
  ),
}));

vi.mock('../Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('./', () => ({
  __esModule: true,
}));

describe('MainLayout', () => {
  it('renders layout structure and children correctly', () => {
    render(
      <MainLayout>
        <div data-testid="child">Main Content</div>
      </MainLayout>
    );

    // Check all components are rendered
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toHaveTextContent('Closed');
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // Check container structure using actual elements
    const outerContainer = screen
      .getByTestId('child')
      .closest('div.min-h-screen');
    expect(outerContainer).toHaveClass(
      'min-h-screen',
      'flex',
      'flex-col',
      'bg-gray-50'
    );

    const flexContainer = screen.getByTestId('sidebar').closest('div.flex');
    expect(flexContainer).toHaveClass('flex-grow');

    const mainElement = screen.getByTestId('child').closest('main');
    expect(mainElement).toHaveClass(
      'flex-grow',
      'p-4',
      'transition-all',
      'duration-300',
      'lg:ml-64'
    );

    const innerContainer = screen.getByTestId('child').closest('div.container');
    expect(innerContainer).toContainElement(screen.getByTestId('child'));
  });

  it('toggles sidebar open when header is clicked', () => {
    render(
      <MainLayout>
        <div>Main Content</div>
      </MainLayout>
    );

    const header = screen.getByTestId('header');
    const sidebar = screen.getByTestId('sidebar');

    expect(sidebar).toHaveTextContent('Closed');
    fireEvent.click(header);
    expect(sidebar).toHaveTextContent('Open');
  });

  it('closes sidebar when onClose is triggered', () => {
    render(
      <MainLayout>
        <div>Main Content</div>
      </MainLayout>
    );

    const header = screen.getByTestId('header');
    const sidebar = screen.getByTestId('sidebar');

    fireEvent.click(header);
    expect(sidebar).toHaveTextContent('Open');

    fireEvent.click(sidebar);
    expect(sidebar).toHaveTextContent('Closed');
  });

  it('applies responsive layout classes', () => {
    render(
      <MainLayout>
        <div>Main Content</div>
      </MainLayout>
    );

    const mainElement = document.querySelector('main');
    expect(mainElement).toHaveClass('lg:ml-64');
  });
});
