import 'webextension-polyfill'

import { isConvertNeeded } from '@extension/shared'

type FetchImageMessage = {
  type: 'fetch-image'
  url: string
}

const isFetchImageMessage = (message: object): message is FetchImageMessage => {
  return 'type' in message && message.type === 'fetch-image'
}

chrome.runtime.onMessage.addListener(
  (message: object, _sender, sendResponse) => {
    if (isFetchImageMessage(message)) {
      const imageUrl = message.url

      fetchImage(imageUrl)
        .then(imageBlob =>
          isConvertNeeded(imageUrl)
            ? processImageInOffscreen(imageBlob)
            : imageBlob,
        )
        .then(blobToDataURL)
        .then(dataUrl => {
          sendResponse({ success: true, dataUrl: dataUrl })
        })
        .catch(error => {
          sendResponse({ success: false, error })
        })

      return true // Keep the message channel open for asynchronous response
    }
  },
)

// Fetch image as Blob
async function fetchImage(url: string): Promise<Blob> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  }
  return response.blob()
}

async function processImageInOffscreen(blob: Blob): Promise<Blob> {
  const imageBitmap = await createImageBitmap(blob)
  const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get OffscreenCanvas context')
  }

  ctx.drawImage(imageBitmap, 0, 0)

  return canvas.convertToBlob({ type: 'image/png' })
}

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
