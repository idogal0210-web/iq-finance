import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Wordmark from '../components/Wordmark';

describe('Wordmark', () => {
  it('renders without crashing', () => {
    render(<Wordmark />);
  });

  it('shows tagline by default', () => {
    render(<Wordmark showTagline={true} />);
    expect(screen.getByText(/value your money/i)).toBeInTheDocument();
  });

  it('hides tagline when showTagline=false', () => {
    render(<Wordmark showTagline={false} />);
    expect(screen.queryByText(/value your money/i)).not.toBeInTheDocument();
  });
});
