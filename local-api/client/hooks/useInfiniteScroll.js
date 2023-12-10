import { useRef, useState, useEffect } from 'react';

const useInfiniteScroll = (targetEl) => {
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  const getObserver = () => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        setIntersecting(entries.some((entry) => entry.isIntersecting));
      });
    }

    return observerRef.current;
  };

  useEffect(() => {
    if (targetEl.current) getObserver().observe(targetEl.current);

    return () => {
      getObserver().disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
