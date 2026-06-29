export interface ScrollVisibilityInsets {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

const DEFAULT_INSETS: Required<ScrollVisibilityInsets> = {
  top: 64,
  bottom: 16,
  left: 0,
  right: 0,
}

export function isElementFullyVisible(
  element: HTMLElement,
  insets: ScrollVisibilityInsets = DEFAULT_INSETS,
): boolean {
  const top = insets.top ?? DEFAULT_INSETS.top
  const bottom = insets.bottom ?? DEFAULT_INSETS.bottom
  const left = insets.left ?? DEFAULT_INSETS.left
  const right = insets.right ?? DEFAULT_INSETS.right

  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth

  return (
    rect.top >= top &&
    rect.left >= left &&
    rect.bottom <= viewportHeight - bottom &&
    rect.right <= viewportWidth - right
  )
}

export function scrollIntoViewIfNeeded(
  element: HTMLElement | null | undefined,
  options?: {
    insets?: ScrollVisibilityInsets
    behavior?: ScrollBehavior
    block?: ScrollLogicalPosition
  },
): void {
  if (!element) return

  const insets = { ...DEFAULT_INSETS, ...options?.insets }
  if (isElementFullyVisible(element, insets)) return

  element.scrollIntoView({
    behavior: options?.behavior ?? 'smooth',
    block: options?.block ?? 'end',
    inline: 'nearest',
  })
}
