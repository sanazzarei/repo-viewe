import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile Component', () => {
  const mockProps = {
    name: 'Jake Wharton',
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  test('renders user name', () => {
    render(<UserProfile {...mockProps} />);
    expect(screen.getByText('Jake Wharton')).toBeInTheDocument();
  });

  test('renders avatar with correct src and alt', () => {
    render(<UserProfile {...mockProps} />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', mockProps.avatarUrl);
    expect(avatar).toHaveAttribute('alt', 'Jake Wharton avatar');
  });

  test('has correct CSS classes applied', () => {
    render(<UserProfile {...mockProps} />);
    const avatar = screen.getByRole('img');
    const name = screen.getByText('Jake Wharton');
    expect(avatar.className).toMatch(/avatar/);
    expect(name.className).toMatch(/name/);
  });
});
