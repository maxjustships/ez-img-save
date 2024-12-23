import { clsx } from 'clsx'
import delay from 'lodash/delay'
import { useCallback, useState } from 'react'
import { downloadFile } from './downloadFile'
import { getElementCoordinates } from './getElementCoordinates'
import Download from './icons/Download'
import Loading from './icons/Loading'
import useLastHoveredImage from './useLastHoveredImage'

// Send message to the background script
function useSendConvertDownload() {
  const [loading, setLoading] = useState(false)

  const sendConvertDownload = useCallback((src: string) => {
    setLoading(true)
    chrome.runtime.sendMessage({ type: 'fetch-image', url: src }, response => {
      if (response.success) {
        downloadFile(response.dataUrl)
      }
      setLoading(false)
    })
  }, [])

  return { loading, sendConvertDownload }
}

export default function App() {
  const { isHovered: isImageHovered, currentImage } = useLastHoveredImage()
  const coords = currentImage ? getElementCoordinates(currentImage) : null

  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const { loading, sendConvertDownload } = useSendConvertDownload()

  if (!coords || !(isButtonHovered || isImageHovered)) return null

  const { top, left, width, height } = coords

  return (
    <div
      className={clsx(`pointer-events-none absolute z-[10000] border-2`, {
        'border-neutral': loading,
        'border-accent': !loading,
      })}
      style={{ top, left, width, height }}
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => delay(() => setIsButtonHovered(false), 200)}>
      {
        <button
          className={clsx(
            `btn btn-sm border-radius-none pointer-events-auto m-2 opacity-50 hover:opacity-100`,
            {
              'btn-accent': !loading,
              'btn-neutral': loading,
            },
          )}
          onClick={
            currentImage && !loading
              ? () => sendConvertDownload(currentImage.src)
              : undefined
          }>
          {loading ? <Loading /> : <Download />}
        </button>
      }
    </div>
  )
}
