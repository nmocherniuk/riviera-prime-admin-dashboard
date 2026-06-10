/**
 * Mobile touch helpers — prevent the same tap from firing on elements
 * that appear after a menu closes or a modal opens (ghost / through clicks).
 */

export const BACKDROP_CLICK_GUARD_MS = 400;

export function deferUserAction(action: () => void): void {
  window.setTimeout(action, 0);
}

export function consumePointerEvent(e: React.SyntheticEvent): void {
  e.stopPropagation();
  if ("preventDefault" in e && typeof e.preventDefault === "function") {
    e.preventDefault();
  }
}

export function runMenuItemAction(
  e: React.SyntheticEvent,
  action: () => void,
  closeMenu: () => void,
): void {
  consumePointerEvent(e);
  closeMenu();
  deferUserAction(action);
}

export function shouldIgnoreBackdropClose(openedAtMs: number): boolean {
  return Date.now() - openedAtMs < BACKDROP_CLICK_GUARD_MS;
}
