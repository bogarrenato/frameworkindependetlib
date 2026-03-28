import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('React brand 2 showcase app', () => {
  it('renders the key consumer messaging and buttons', () => {
    const { container } = render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /react consumes only the wrapper logic, then receives brand 2 from figma-based css/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Brand 2 default')).toBeInTheDocument();
    expect(screen.getByText('Class-based override')).toBeInTheDocument();
    expect(screen.getByText('Inline token tweak')).toBeInTheDocument();
    expect(container.querySelector('ff-dropdown')).toBeInTheDocument();
  });

  it('switches the outer shell theme attribute when the user changes theme', () => {
    render(<App />);

    const mainElement = screen.getByRole('main');

    expect(mainElement).toHaveAttribute('data-theme', 'light');

    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(mainElement).toHaveAttribute('data-theme', 'dark');

    fireEvent.click(screen.getByRole('button', { name: 'Light' }));
    expect(mainElement).toHaveAttribute('data-theme', 'light');
  });

  it('renders the dropdown section with the initial release status', () => {
    const { container } = render(<App />);
    const dropdownElement = container.querySelector('ff-dropdown') as HTMLElement | null;

    expect(dropdownElement).not.toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Current selection: Pilot release');
  });
});
