"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const REVEAL_THRESHOLD = 6;
const HIDE_THRESHOLD = 24;
const SETTLE_DELAY = 100;

export function ScrollAwareHeader({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const showOnFocus = useRef<() => void>(() => {});
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!headerRef.current) return;
    const header = headerRef.current;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previousY = Math.max(0, window.scrollY);
    let movement = 0;
    let reveal = 0;
    let mode: "shown" | "hidden" | "tracking" = "shown";
    let settleToShown = true;
    let frame = 0;
    let settleTimer = 0;

    function clearSettleTimer() {
      if (settleTimer !== 0) window.clearTimeout(settleTimer);
      settleTimer = 0;
    }

    function settle(show: boolean) {
      clearSettleTimer();
      mode = show ? "shown" : "hidden";
      movement = 0;
      reveal = show ? header.offsetHeight : 0;
      header.style.transitionDuration = reduceMotion.matches
        ? "0ms"
        : show
          ? "520ms"
          : "420ms";
      header.style.transitionTimingFunction = show
        ? "cubic-bezier(0.16, 1, 0.3, 1)"
        : "cubic-bezier(0.32, 0.72, 0, 1)";
      header.style.transform = show
        ? "translate3d(0, 0, 0)"
        : "translate3d(0, -100%, 0)";
      setVisible(show);
    }

    function currentReveal() {
      const height = header.offsetHeight;
      const transform = window.getComputedStyle(header).transform;
      const offset =
        transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
      return Math.max(0, Math.min(height, height + offset));
    }

    function track(delta: number) {
      const height = header.offsetHeight;
      reveal = Math.max(0, Math.min(height, reveal - delta));
      header.style.transitionDuration = "0ms";
      header.style.transform = `translate3d(0, ${reveal - height}px, 0)`;
      setVisible(true);
    }

    function scheduleSettle(show: boolean) {
      clearSettleTimer();
      settleTimer = window.setTimeout(() => settle(show), SETTLE_DELAY);
    }

    function update() {
      frame = 0;

      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - previousY;
      previousY = currentY;
      setScrolled(currentY > 8);

      if (currentY <= 24) {
        if (mode !== "shown") settle(true);
        return;
      }

      if (delta === 0) return;

      movement = Math.sign(delta) === Math.sign(movement)
        ? movement + delta
        : delta;

      if (mode === "shown") {
        if (delta > 0 && currentY > 128 && movement >= HIDE_THRESHOLD) {
          settle(false);
        }
        return;
      }

      if (mode === "hidden") {
        if (delta < 0 && movement <= -REVEAL_THRESHOLD) {
          if (reduceMotion.matches) {
            settle(true);
          } else {
            reveal = currentReveal();
            mode = "tracking";
            settleToShown = true;
            track(movement + REVEAL_THRESHOLD);
            scheduleSettle(true);
          }
        }
        return;
      }

      track(delta);
      if (delta < 0) settleToShown = true;
      else if (movement >= 10) settleToShown = false;
      scheduleSettle(settleToShown);
    }

    function onScroll() {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    }

    showOnFocus.current = () => settle(true);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      clearSettleTimer();
      showOnFocus.current = () => {};
    };
  }, []);

  return (
    <div
      ref={headerRef}
      data-header-shell
      onFocusCapture={() => showOnFocus.current()}
      className={`sticky top-0 z-40 w-full shrink-0 transform-gpu transition-[transform,box-shadow] motion-reduce:transition-none ${
        visible && scrolled
          ? "shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]"
          : "shadow-none"
      }`}
    >
      {children}
    </div>
  );
}
