import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MobileToast } from './MobileToast.js';

describe('MobileToast', () => {
  it('renders nothing when there is no toast', () => {
    const { container } = render(<MobileToast toast={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the toast message', () => {
    render(<MobileToast toast={{ id: 1, text: 'Event published' }} />);
    expect(screen.getByText('Event published')).toBeInTheDocument();
  });
});
