import { isConvertNeeded } from '@extension/shared'
import delay from 'lodash/delay'
import { useState } from 'react'
import { downloadFile } from './downloadFile'
import { getElementCoordinates } from './getElementCoordinates'
import useLastHoveredImage from './useLastHoveredImage'

const sendConvertDownload = (src: string) => {
  chrome.runtime.sendMessage({ type: 'fetch-image', url: src }, response => {
    if (response.success) {
      downloadFile(response.dataUrl)
    }
  })
}

function getDownloadButtonText(src?: string) {
  return src && isConvertNeeded(src) ? 'Save as PNG' : 'Save image'
}

export default function App() {
  const { isHovered: isImageHovered, currentImage } = useLastHoveredImage()
  const coords = currentImage ? getElementCoordinates(currentImage) : null

  const [isButtonHovered, setIsButtonHovered] = useState(false)

  if (!coords || !(isButtonHovered || isImageHovered)) return null

  const { top, left, width, height } = coords

  return (
    <div
      className="border-accent pointer-events-none absolute z-[1000] border-2"
      style={{ top, left, width, height }}
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => delay(() => setIsButtonHovered(false), 200)}>
      {
        <button
          className={`btn btn-sm btn-accent border-radius-none pointer-events-auto m-2`}
          onClick={
            currentImage
              ? () => sendConvertDownload(currentImage.src)
              : undefined
          }>
          {getDownloadButtonText(currentImage?.src)}
        </button>
      }
    </div>
  )
}
