import { useEffect, useRef, type RefObject } from "react";

const LOAD_MORE_ROOT_MARGIN = "200px";

export type UseInfiniteScrollWeeksParams = {
  scrollRef: RefObject<HTMLDivElement | null>;
  setWeeksToShow: React.Dispatch<React.SetStateAction<number>>;
  weeksToShow: number;
};

export function useInfiniteScrollWeeks({
  scrollRef,
  setWeeksToShow,
  weeksToShow,
}: UseInfiniteScrollWeeksParams): RefObject<HTMLDivElement | null> {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = loadMoreRef.current;
    if (!root || !sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setWeeksToShow((prev) => prev + 2);
        }
      },
      { root, rootMargin: LOAD_MORE_ROOT_MARGIN, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [scrollRef, setWeeksToShow, weeksToShow]);

  return loadMoreRef;
}
