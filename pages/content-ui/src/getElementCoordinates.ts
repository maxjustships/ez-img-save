export function getElementCoordinates(element: HTMLElement) {
  const { top, left, width, height } = element.getBoundingClientRect()
  return {
    top: top + window.scrollY,
    left: left + window.scrollX,
    width,
    height,
  }
}
