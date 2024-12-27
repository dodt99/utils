import { useEffect, useState } from "react";

export const useCalculateSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      const contentRect = entry.contentRect;
      const width = Math.trunc(contentRect?.width || 0);
      const height = Math.trunc(contentRect?.height || 0);
      setSize({ width, height });
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return size;
};
