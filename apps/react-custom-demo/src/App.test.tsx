import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('React custom demo app', () => {
  it('renders the custom-brand messaging and the button examples', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /the same react wrapper gets a completely custom identity from external css/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Custom brand default')).toBeInTheDocument();
    expect(screen.getByText('Host class override')).toBeInTheDocument();
    expect(screen.getByText('Inline token tweak')).toBeInTheDocument();
    expect(
      screen.getByText(/consumer-owned brand can style the same button/i)
    ).toBeInTheDocument();
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

});
