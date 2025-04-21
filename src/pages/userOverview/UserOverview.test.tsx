import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import UserOverview from './UserOverview';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  }
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

jest.mock('../../components/repoItem/RepoItem', () => ({
  __esModule: true,
  default: ({ name, description }) => (
    <div data-testid="repo-item">
      <div data-testid="repo-name">{name}</div>
      <div data-testid="repo-description">{description}</div>
    </div>
  ),
}));

jest.mock('../../components/userProfile/UserProfile', () => ({
  __esModule: true,
  default: ({ name, avatarUrl }) => (
    <div data-testid="user-profile">
      <div data-testid="user-name">{name}</div>
      <img data-testid="user-avatar" src={avatarUrl} alt={name} />
    </div>
  ),
}));

const mockUseQuery = useQuery as jest.Mock;

describe('UserOverview Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile and repo info when data loads successfully', () => {
    const mockUser = {
      name: 'Jake Wharton',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Software Engineer',
      followers: 10000,
      following: 100,
      location: 'Pittsburgh, PA',
      company: 'Google',
      blog: 'https://jakewharton.com',
      public_repos: 42,
    };
  
    const mockRepos = [
      { id: 1, name: 'Repo One', description: 'First repo' },
      { id: 2, name: 'Repo Two', description: 'Second repo' },
    ];
  
    mockUseQuery
      .mockReturnValueOnce({ isLoading: false, isError: false, data: mockRepos }) 
      .mockReturnValueOnce({ isLoading: false, isError: false, data: mockUser });
  
    render(
      <QueryClientProvider client={queryClient}>
        <UserOverview />
      </QueryClientProvider>
    );
  
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    expect(screen.getByText('Jake Wharton')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Pittsburgh, PA')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('https://jakewharton.com')).toBeInTheDocument();  
    expect(screen.getAllByTestId('repo-item')).toHaveLength(2);
  });
  
  test('renders skeleton loaders when data is being fetched', () => {
    mockUseQuery
      .mockReturnValueOnce({
        isLoading: true,
        isError: false,
        data: null,
      })
      .mockReturnValueOnce({
        isLoading: true,
        isError: false,
        data: null,
      });

    render(
      <QueryClientProvider client={queryClient}>
        <UserOverview />
      </QueryClientProvider>
    );

    expect(document.querySelector('.react-loading-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('repo-item')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
    
    expect(screen.getByText('Repositories')).toBeInTheDocument();
  });

  test('displays error toast when repositories API call fails', () => {
    mockUseQuery
      .mockReturnValueOnce({
        isLoading: false,
        isError: true,
        error: new Error('Failed to load repositories'),
        data: null,
      })
      .mockReturnValueOnce({
        isLoading: false,
        isError: false,
        data: {
          name: 'Jake Wharton',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      });

    render(
      <QueryClientProvider client={queryClient}>
        <UserOverview />
      </QueryClientProvider>
    );

    expect(toast.error).toHaveBeenCalledWith('Failed to load repositories: Failed to load repositories');
    expect(screen.queryByTestId('repo-item')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
  });

  test('displays error toast when user profile API call fails', () => {
    mockUseQuery
      .mockReturnValueOnce({
        isLoading: false,
        isError: false,
        data: [
          { id: 1, name: 'Repo One', description: 'First repo' },
        ],
      })
      .mockReturnValueOnce({
        isLoading: false,
        isError: true,
        error: new Error('Failed to load user profile'),
        data: null,
      });

    render(
      <QueryClientProvider client={queryClient}>
        <UserOverview />
      </QueryClientProvider>
    );

    expect(toast.error).toHaveBeenCalledWith('Failed to load user profile: Failed to load user profile');
    expect(screen.queryByTestId('repo-item')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
  });
});