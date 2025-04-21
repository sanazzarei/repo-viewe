import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RepositoryDetails from './RepositoryDetails';
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

const mockUseQuery = useQuery as jest.Mock;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function renderWithRouter(ui: React.ReactNode, { route = '/repo/DemoRepo' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/repo/:repoName" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('RepositoryDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays skeleton loaders when data is being fetched', () => {
    mockUseQuery
      .mockReturnValueOnce({ isLoading: true, isError: false, data: null }) 
      .mockReturnValueOnce({ isLoading: true, isError: false, data: null }); 

    renderWithRouter(<RepositoryDetails />);

    expect(document.querySelector('.react-loading-skeleton')).toBeInTheDocument();
    expect(document.querySelectorAll('.react-loading-skeleton').length).toBeGreaterThan(1);
  });

  test('displays error toast if repository query fails', () => {
    const errorMessage = 'Repository not found';
    
    mockUseQuery
      .mockReturnValueOnce({ 
        isLoading: false, 
        isError: true, 
        error: new Error(errorMessage), 
        data: null 
      }) 
      .mockReturnValueOnce({ 
        isLoading: false, 
        isError: false, 
        data: [] 
      }); 

    renderWithRouter(<RepositoryDetails />);

    expect(toast.error).toHaveBeenCalledWith(`Failed to load repository: ${errorMessage}`);
    expect(screen.queryByText('DemoRepo')).not.toBeInTheDocument();
  });

  test('displays error toast if commits query fails', () => {
    const errorMessage = 'Commits not found';
    
    mockUseQuery
      .mockReturnValueOnce({
        isLoading: false,
        isError: false,
        data: { name: 'DemoRepo', description: 'Test repo' }
      })
      .mockReturnValueOnce({
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
        data: null
      });

    renderWithRouter(<RepositoryDetails />);

    expect(toast.error).toHaveBeenCalledWith(`Failed to load commits: ${errorMessage}`);
    expect(screen.queryByText('DemoRepo')).not.toBeInTheDocument();
  });

  test('renders repository details and recent commits', () => {
    const mockRepo = {
      name: 'DemoRepo',
      description: 'This is a demo repo.',
    };

    const mockCommits = [
      {
        sha: '123abc',
        html_url: 'https://github.com/commit/123abc',
        commit: {
          message: 'Initial commit\n\nExtra details',
          author: {
            name: 'John Doe',
            date: '2024-04-19T10:00:00Z',
          },
        },
      },
    ];

    mockUseQuery
      .mockReturnValueOnce({ isLoading: false, isError: false, data: mockRepo })     
      .mockReturnValueOnce({ isLoading: false, isError: false, data: mockCommits }); 

    renderWithRouter(<RepositoryDetails />);

    expect(screen.getByText('DemoRepo')).toBeInTheDocument();
    expect(screen.getByText('This is a demo repo.')).toBeInTheDocument();
    expect(screen.getByText('Initial commit')).toBeInTheDocument();
    expect(screen.getByText('By John Doe')).toBeInTheDocument();
  });
});