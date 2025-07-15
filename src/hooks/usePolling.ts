import { useEffect, useRef } from 'react';

export const usePolling = (
  callback: () => void,
  delay: number,
  active = true
) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;
    const tick = () => savedCallback.current();
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, active]);
};
export default usePolling;
