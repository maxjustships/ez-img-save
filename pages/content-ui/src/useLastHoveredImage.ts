import debounce from 'lodash/debounce'
import { useEffect, useState } from 'react'

function isHTMLImageElement(
  element: EventTarget | null,
): element is HTMLImageElement {
  return (
    Boolean(element) &&
    element instanceof HTMLImageElement &&
    element.tagName === 'IMG'
  )
}

const MOUSEOVER_DEBOUNCE = 200

function useLastHoveredImage() {
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(
    null,
  )
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      if (isHTMLImageElement(event.target)) {
        setCurrentImage(event.target)
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    const handleMouseEnterDebounce = debounce(
      handleMouseOver,
      MOUSEOVER_DEBOUNCE,
    )

    document.addEventListener('mouseover', handleMouseEnterDebounce)

    return () => {
      document.removeEventListener('mouseover', handleMouseEnterDebounce)
    }
  }, [])

  return { currentImage, isHovered }
}

export default useLastHoveredImage
