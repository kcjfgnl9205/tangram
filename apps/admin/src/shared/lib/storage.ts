export const getResourceUrl = (path: string) => {
  if (!path) return ''
  return `https://cdn.puzmu.com/${path}`
}
