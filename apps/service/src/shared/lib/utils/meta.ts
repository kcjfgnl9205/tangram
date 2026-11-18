export function updateMetaTag(name: string, content: string) {
  if (!content) return

  let metaTag = document.querySelector(`meta[name='${name}']`)
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('name', name)
    document.head.appendChild(metaTag)
  }
  metaTag.setAttribute('content', content)
}

export function updateOgTag(property: string, content: string) {
  if (!content) return

  let metaTag = document.querySelector(`meta[property='${property}']`)
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('property', property)
    document.head.appendChild(metaTag)
  }
  metaTag.setAttribute('content', content)
}

export function updateCanonical(url: string) {
  if (!url) return

  let linkTag = document.querySelector("link[rel='canonical']")
  if (!linkTag) {
    linkTag = document.createElement('link')
    linkTag.setAttribute('rel', 'canonical')
    document.head.appendChild(linkTag)
  }
  linkTag.setAttribute('href', url)
}
