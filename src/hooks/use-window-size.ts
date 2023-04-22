import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';

type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  const handleResize = () =>
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

  const debouncedHandleResize = useMemo(() => debounce(handleResize, 100), []);

  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize);
    debouncedHandleResize();

    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, [debouncedHandleResize]);

  useEffect(() => {
    return () => {
      debouncedHandleResize.cancel();
    };
  }, [debouncedHandleResize]);

  return windowSize;
}
