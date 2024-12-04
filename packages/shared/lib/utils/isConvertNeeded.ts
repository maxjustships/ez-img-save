export function isConvertNeeded(url: string): boolean {
  const notSupportedFormatsPattern = /\.(gif|png|apng|svg)$/i

  if (notSupportedFormatsPattern.test(url)) {
    return false
  }

  return true
}
