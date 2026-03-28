import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('React custom demo app', () => {
  it('renders the custom-brand messaging and the button examples', () => {
    const { container } = render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /the same react wrapper gets a completely custom identity from external css/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Custom brand default')).toBeInTheDocument();
    expect(screen.getByText('Host class override')).toBeInTheDocument();
    expect(screen.getByText('Inline token tweak')).toBeInTheDocument();
    expect(container.querySelector('ff-dropdown')).toBeInTheDocument();
  });

  it('updates the shell theme without changing the component API', () => {
    render(<App />);

    const mainElement = screen.getByRole('main');

    expect(mainElement).toHaveAttribute('data-theme', 'light');

    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(mainElement).toHaveAttribute('data-theme', 'dark');

    fireEvent.click(screen.getByRole('button', { name: 'Light' }));
    expect(mainElement).toHaveAttribute('data-theme', 'light');
  });

  it('renders the dropdown section with the initial deployment status', () => {
    const { container } = render(<App />);
    const dropdownElement = container.querySelector('ff-dropdown') as HTMLElement | null;

    expect(dropdownElement).not.toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Current selection: Design review');
  });
});
