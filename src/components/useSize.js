import { useEffect, useRef, useState } from 'react';

/** 容器宽度自适应(RoAF: ResizeObserver + ref) */
export default function useSize() {
  const ref = useRef(null);
  const [w, setW] = useState(960);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cw = entries[0]?.contentRect?.width;
      if (cw && Math.abs(cw - w) > 4) setW(cw);
    });
    ro.observe(el);
    setW(el.clientWidth || 960);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, w];
}
