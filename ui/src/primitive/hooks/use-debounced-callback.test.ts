import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedCallback } from './use-debounced-callback';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebouncedCallback — trailing (default)', () => {
  it('calls callback once after delay when invoked multiple times rapidly', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current('a');
      result.current('b');
      result.current('c');
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(200); });

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('does not fire before the delay elapses', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => { result.current('x'); });
    act(() => { vi.advanceTimersByTime(299); });

    expect(fn).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(1); });

    expect(fn).toHaveBeenCalledOnce();
  });

  it('accepts options as a plain number (shorthand for delay)', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 100));

    act(() => { result.current(); });
    act(() => { vi.advanceTimersByTime(100); });

    expect(fn).toHaveBeenCalledOnce();
  });
});

describe('useDebouncedCallback — flush()', () => {
  it('invokes callback immediately when flush() is called with a pending timeout', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 500));

    act(() => { result.current('hello'); });

    expect(fn).not.toHaveBeenCalled();

    act(() => { result.current.flush(); });

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('hello');
  });

  it('does not double-call after flush + timer expiry', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 500));

    act(() => { result.current('x'); });
    act(() => { result.current.flush(); });
    act(() => { vi.advanceTimersByTime(500); });

    expect(fn).toHaveBeenCalledOnce();
  });

  it('is a no-op when there is no pending call', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => { result.current.flush(); });

    expect(fn).not.toHaveBeenCalled();
  });
});

describe('useDebouncedCallback — cancel()', () => {
  it('prevents the callback from firing', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => { result.current('y'); });
    act(() => { result.current.cancel(); });
    act(() => { vi.advanceTimersByTime(200); });

    expect(fn).not.toHaveBeenCalled();
  });

  it('resets _isFirstCall to true', () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(fn, { delay: 200, leading: true }),
    );

    act(() => { result.current('a'); }); // fires immediately, isFirstCall → false
    act(() => { result.current.cancel(); }); // should reset isFirstCall → true

    expect(result.current._isFirstCall).toBe(true);
  });
});

describe('useDebouncedCallback — leading edge', () => {
  it('calls callback immediately on first call', () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(fn, { delay: 300, leading: true }),
    );

    act(() => { result.current('first'); });

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('first');
  });

  it('ignores subsequent calls within cooldown', () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(fn, { delay: 300, leading: true }),
    );

    act(() => {
      result.current('a');
      result.current('b');
      result.current('c');
    });

    act(() => { vi.advanceTimersByTime(300); });

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('fires again on the next call after cooldown expires', () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(fn, { delay: 300, leading: true }),
    );

    act(() => { result.current('first'); });
    act(() => { vi.advanceTimersByTime(300); });
    act(() => { result.current('second'); });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, 'second');
  });

  it('tracks _isFirstCall correctly', () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(fn, { delay: 300, leading: true }),
    );

    expect(result.current._isFirstCall).toBe(true);

    act(() => { result.current('x'); });

    expect(result.current._isFirstCall).toBe(false);

    act(() => { vi.advanceTimersByTime(300); });

    expect(result.current._isFirstCall).toBe(true);
  });
});

describe('useDebouncedCallback — flushOnUnmount', () => {
  it('flushes pending callback when component unmounts with flushOnUnmount: true', () => {
    const fn = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(fn, { delay: 500, flushOnUnmount: true }),
    );

    act(() => { result.current('data'); });

    expect(fn).not.toHaveBeenCalled();

    unmount();

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('data');
  });

  it('cancels pending callback on unmount by default (flushOnUnmount: false)', () => {
    const fn = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(fn, { delay: 500 }),
    );

    act(() => { result.current('data'); });
    unmount();

    act(() => { vi.advanceTimersByTime(500); });

    expect(fn).not.toHaveBeenCalled();
  });
});
