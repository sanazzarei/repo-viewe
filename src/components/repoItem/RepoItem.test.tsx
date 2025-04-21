import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RepoItem from './RepoItem';

describe('RepoItem Component', () => {
  const defaultProps = {
    id: 1,
    name: 'awesome-repo',
    description: 'This is an awesome repository.',
    stars: 42,
    watchers: 13,
    forks: 7,
    language: 'JavaScript',
  };

  const renderWithRouter = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <RepoItem {...props} />
      </MemoryRouter>
    );
  };

  test('renders repository name as link', () => {
    renderWithRouter();
    const link = screen.getByRole('link', { name: /awesome-repo/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/repo/awesome-repo');
  });

  test('renders description if present', () => {
    renderWithRouter();
    expect(screen.getByText('This is an awesome repository.')).toBeInTheDocument();
  });

  test('renders stats: stars, watchers, forks', () => {
    renderWithRouter();
    expect(screen.getByText(/42/)).toBeInTheDocument();  
    expect(screen.getByText(/13/)).toBeInTheDocument();  
    expect(screen.getByText(/7/)).toBeInTheDocument();    
  });



  test('does not render description or language if null', () => {
    renderWithRouter({
      ...defaultProps,
      description: null,
      language: null,
    });
    expect(screen.queryByText('This is an awesome repository.')).not.toBeInTheDocument();
    expect(screen.queryByTestId('language-tag')).not.toBeInTheDocument();
  });
});
