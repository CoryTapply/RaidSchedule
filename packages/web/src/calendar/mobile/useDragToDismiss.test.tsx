import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDragToDismiss } from './useDragToDismiss.js';

function Host({ onDismiss }: { onDismiss: () => void }) {
  const { style, handleProps } = useDragToDismiss(onDismiss);
  return (
    <div data-testid="sheet" style={style}>
      <div data-testid="handle" {...handleProps} />
    </div>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useDragToDismiss', () => {
  it('tracks the pointer downward 1:1 while dragging', () => {
    const { getByTestId } = render(<Host onDismiss={vi.fn()} />);
    fireEvent.pointerDown(getByTestId('handle'), { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(getByTestId('handle'), { clientY: 140 });
    expect(getByTestId('sheet').style.transform).toBe('translateY(40px)');
  });

  it('ignores upward movement, clamping to 0', () => {
    const { getByTestId } = render(<Host onDismiss={vi.fn()} />);
    fireEvent.pointerDown(getByTestId('handle'), { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(getByTestId('handle'), { clientY: 60 });
    expect(getByTestId('sheet').style.transform).toBe('translateY(0px)');
  });

  it('springs back below the threshold on release', () => {
    const { getByTestId } = render(<Host onDismiss={vi.fn()} />);
    fireEvent.pointerDown(getByTestId('handle'), { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(getByTestId('handle'), { clientY: 150 });
    fireEvent.pointerUp(getByTestId('handle'));
    expect(getByTestId('sheet').style.transform).toBe('translateY(0px)');
  });

  it('dismisses past the threshold, calling onDismiss after the transition', () => {
    const onDismiss = vi.fn();
    const { getByTestId } = render(<Host onDismiss={onDismiss} />);
    fireEvent.pointerDown(getByTestId('handle'), { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(getByTestId('handle'), { clientY: 200 });
    fireEvent.pointerUp(getByTestId('handle'));
    expect(getByTestId('sheet').style.transform).toBe('translateY(900px)');
    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss again on unmount after a dismiss was already scheduled', () => {
    const onDismiss = vi.fn();
    const { getByTestId, unmount } = render(<Host onDismiss={onDismiss} />);
    fireEvent.pointerDown(getByTestId('handle'), { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(getByTestId('handle'), { clientY: 200 });
    fireEvent.pointerUp(getByTestId('handle'));
    unmount();
    vi.advanceTimersByTime(200);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
