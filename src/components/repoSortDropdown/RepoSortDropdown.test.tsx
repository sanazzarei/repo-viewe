import { render, screen, fireEvent } from '@testing-library/react';
import RepoSortDropdown from './RepoSortDropdown';
import { RepoSortOption } from '../../type';

describe('RepoSortDropdown', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default value selected', () => {
    render(<RepoSortDropdown value="default" onChange={mockOnChange} />);
    
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveValue('default');
    
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Stars (Most → Least)')).toBeInTheDocument();
    expect(screen.getByText('Last Commit (Newest → Oldest)')).toBeInTheDocument();
    expect(screen.getByText('Recently Created')).toBeInTheDocument();
  });

  test('renders with stars value selected', () => {
    render(<RepoSortDropdown value="stars" onChange={mockOnChange} />);
    
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveValue('stars');
  });

  test('calls onChange handler when a different option is selected', () => {
    render(<RepoSortDropdown value="default" onChange={mockOnChange} />);
    
    const dropdown = screen.getByRole('combobox');
    
    fireEvent.change(dropdown, { target: { value: 'stars' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('stars');
    
    // Change to 'latest' option
    fireEvent.change(dropdown, { target: { value: 'latest' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenCalledWith('latest');
  });

  test('handles all possible sort options', () => {
    const sortOptions: RepoSortOption[] = ['default', 'stars', 'latest', 'created'];
    
    for (const option of sortOptions) {
      const { unmount } = render(<RepoSortDropdown value={option} onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveValue(option);
      
      unmount();
    }
  });

  test('applies a class to the select element', () => {
    render(<RepoSortDropdown value="default" onChange={mockOnChange} />);
    
    const dropdown = screen.getByRole('combobox');
    expect(dropdown.className).not.toBe('');
  });
});