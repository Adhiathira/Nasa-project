import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders with default placeholder text', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search research papers...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder text', () => {
    render(<SearchBar placeholder="Custom placeholder" />);
    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search research papers...') as HTMLInputElement;

    await user.type(input, 'quantum computing');
    expect(input.value).toBe('quantum computing');
  });

  it('calls onSearch callback when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    const consoleSpy = vi.spyOn(console, 'log');

    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search research papers...');

    await user.type(input, 'machine learning');
    await user.keyboard('{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('machine learning');
    expect(consoleSpy).toHaveBeenCalledWith('Search query:', 'machine learning');

    consoleSpy.mockRestore();
  });

  it('calls onSearch callback when search button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    const consoleSpy = vi.spyOn(console, 'log');

    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search research papers...');
    const searchButton = screen.getByLabelText('Search');

    await user.type(input, 'neural networks');
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('neural networks');
    expect(consoleSpy).toHaveBeenCalledWith('Search query:', 'neural networks');

    consoleSpy.mockRestore();
  });

  it('does not trigger search for empty query', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    const consoleSpy = vi.spyOn(console, 'log');

    render(<SearchBar onSearch={mockOnSearch} />);
    const searchButton = screen.getByLabelText('Search');

    await user.click(searchButton);

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('does not trigger search for whitespace-only query', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    const consoleSpy = vi.spyOn(console, 'log');

    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search research papers...');
    const searchButton = screen.getByLabelText('Search');

    await user.type(input, '   ');
    await user.click(searchButton);

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('logs query to console when no callback is provided', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log');

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search research papers...');
    const searchButton = screen.getByLabelText('Search');

    await user.type(input, 'test query');
    await user.click(searchButton);

    expect(consoleSpy).toHaveBeenCalledWith('Search query:', 'test query');

    consoleSpy.mockRestore();
  });
});
