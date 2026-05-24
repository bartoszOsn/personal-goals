import { useEffect, useRef } from 'react';

export interface UseDebouncedCallbackOptions {
  delay: number;
  flushOnUnmount?: boolean;
  leading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseDebouncedCallbackReturnValue<T extends (...args: any[]) => any> =
  ((...args: Parameters<T>) => void) & {
    flush(): void;
    cancel(): void;
    _isFirstCall: boolean;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: number | UseDebouncedCallbackOptions,
): UseDebouncedCallbackReturnValue<T> {
  const callbackRef = useRef(callback);
	// eslint-disable-next-line react-hooks/refs
  callbackRef.current = callback;

  const optionsRef = useRef(options);
	// eslint-disable-next-line react-hooks/refs
  optionsRef.current = options;

  const implRef = useRef<UseDebouncedCallbackReturnValue<T> | null>(null);

  if (implRef.current === null) {
    const timeoutRef = { current: null as ReturnType<typeof setTimeout> | null };
    const argsRef = { current: null as Parameters<T> | null };
    const isFirstCallRef = { current: true };

    const getOpts = () =>
      typeof optionsRef.current === 'number'
        ? { delay: optionsRef.current, flushOnUnmount: false, leading: false }
        : { flushOnUnmount: false, leading: false, ...optionsRef.current };

    const cancel = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isFirstCallRef.current = true;
    };

    const flush = () => {
      if (timeoutRef.current !== null && argsRef.current !== null) {
        const args = argsRef.current;
        cancel();
        callbackRef.current(...args);
      }
    };

    const debounced = (...args: Parameters<T>) => {
      const { delay, leading } = getOpts();
      argsRef.current = args;

      if (leading) {
        if (isFirstCallRef.current) {
          isFirstCallRef.current = false;
          callbackRef.current(...args);
        }
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          isFirstCallRef.current = true;
        }, delay);
      } else {
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          callbackRef.current(...(argsRef.current as Parameters<T>));
        }, delay);
      }
    };

	  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (debounced as any).flush = flush;
	  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (debounced as any).cancel = cancel;

	  // eslint-disable-next-line react-hooks/refs
    Object.defineProperty(debounced, '_isFirstCall', {
      get: () => isFirstCallRef.current,
      configurable: true,
    });

    implRef.current = debounced as UseDebouncedCallbackReturnValue<T>;
  }

  useEffect(() => {
    const impl = implRef.current!;
    return () => {
      const { flushOnUnmount } =
        typeof optionsRef.current === 'number'
          ? { flushOnUnmount: false }
          : optionsRef.current;

	  if (flushOnUnmount) {
		  impl.flush();
	  } else {
		  impl.cancel();
	  }
    };
  }, []);

	// eslint-disable-next-line react-hooks/refs
  return implRef.current;
}
