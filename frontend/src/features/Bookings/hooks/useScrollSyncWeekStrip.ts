import { useEffect, useCallback, type RefObject } from "react";
import { toDateKey } from "../utils/dateUtils";

const SCROLL_TOP_THRESHOLD = 200;

export type UseScrollSyncWeekStripParams = {
  scrollRef: RefObject<HTMLDivElement | null>;
  sectionRefs: RefObject<Record<string, HTMLElement>>;
  allDates: Date[];
  selectedDate: Date;
  setSelectedDate: (date: Date | ((prev: Date) => Date)) => void;
};

export function useScrollSyncWeekStrip({
  scrollRef,
  sectionRefs,
  allDates,
  selectedDate,
  setSelectedDate,
}: UseScrollSyncWeekStripParams): void {
  const sync = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const topEdge = scrollTop + SCROLL_TOP_THRESHOLD;
    const keys = allDates.map((d) => toDateKey(d));
    let leadingKey: string | null = null;
    for (const key of keys) {
      const el = sectionRefs.current[key];
      if (!el) continue;
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (top <= topEdge && top + height > topEdge) {
        leadingKey = key;
        break;
      }
      if (top > topEdge) break;
      leadingKey = key;
    }
    if (leadingKey) {
      const date = allDates.find((d) => toDateKey(d) === leadingKey);
      if (date && toDateKey(date) !== toDateKey(selectedDate)) {
        setSelectedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
      }
    }
  }, [scrollRef, sectionRefs, allDates, selectedDate, setSelectedDate]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        sync();
        raf = 0;
      });
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollRef, sync]);
}
