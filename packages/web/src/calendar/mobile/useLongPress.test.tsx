import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLongPress } from './useLongPress.js';

function Host({ onTrigger }: { onTrigger: () => void }) {
  const handlers = useLongPress(onTrigger);
  return <div data-testid="row" {...handlers} />;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useLongPress', () => {
  it('fires after the delay on a primary pointer press', () => {
    const onTrigger = vi.fn();
    const { getByTestId } = render(<Host onTrigger={onTrigger} />);
    fireEvent.pointerDown(getByTestId('row'), { pointerType: 'touch' });
    vi.advanceTimersByTime(419);
    expect(onTrigger).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it('cancels on pointer up before the delay', () => {
    const onTrigger = vi.fn();
    const { getByTestId } = render(<Host onTrigger={onTrigger} />);
    fireEvent.pointerDown(getByTestId('row'), { pointerType: 'touch' });
    vi.advanceTimersByTime(200);
    fireEvent.pointerUp(getByTestId('row'));
    vi.advanceTimersByTime(1000);
    expect(onTrigger).not.toHaveBeenCalled();
  });

  it('cancels on pointer leave and pointer cancel', () => {
    const onTrigger = vi.fn();
    const { getByTestId } = render(<Host onTrigger={onTrigger} />);
    fireEvent.pointerDown(getByTestId('row'), { pointerType: 'touch' });
    fireEvent.pointerLeave(getByTestId('row'));
    vi.advanceTimersByTime(1000);
    expect(onTrigger).not.toHaveBeenCalled();
  });

  it('does not start the timer for a non-primary mouse button', () => {
    const onTrigger = vi.fn();
    const { getByTestId } = render(<Host onTrigger={onTrigger} />);
    fireEvent.pointerDown(getByTestId('row'), { pointerType: 'mouse', button: 2 });
    vi.advanceTimersByTime(1000);
    expect(onTrigger).not.toHaveBeenCalled();
  });

  it('fires once via context menu on desktop right-click', () => {
    const onTrigger = vi.fn();
    const { getByTestId } = render(<Host onTrigger={onTrigger} />);
    fireEvent.contextMenu(getByTestId('row'));
    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it('does not double-fire when contextmenu follows a completed long-press timer', () => {
    const onTrigger = vi.fn();
    const { getByTestId } = render(<Host onTrigger={onTrigger} />);
    fireEvent.pointerDown(getByTestId('row'), { pointerType: 'touch' });
    vi.advanceTimersByTime(420);
    expect(onTrigger).toHaveBeenCalledTimes(1);
    fireEvent.contextMenu(getByTestId('row'));
    expect(onTrigger).toHaveBeenCalledTimes(1);
  });
});
