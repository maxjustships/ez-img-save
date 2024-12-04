export function downloadFile(url: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = 'image'
  link.click()
}
