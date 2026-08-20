import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NavControls } from './NavControls.js';

describe('NavControls', () => {
  it('calls onPrev, onNext, and onToday when clicked', async () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const onToday = vi.fn();
    render(<NavControls onPrev={onPrev} onNext={onNext} onToday={onToday} />);

    await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));
    expect(onPrev).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Next week' }));
    expect(onNext).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(onToday).toHaveBeenCalledTimes(1);
  });
});
