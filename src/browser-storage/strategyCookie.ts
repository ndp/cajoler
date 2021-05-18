// Proxy for document, so that we can (dependency) inject during tests.
let doc: Partial<HTMLDocument> | null = null

const theDocument = (): Partial<HTMLDocument> => doc || document

export const injectDocument = (
  d: Partial<HTMLDocument>
): Partial<HTMLDocument> => (doc = d)

export const strategyCookie: StorageProxy = {
  read(key: string): string {
    const nameEQ = key + '='
    const cookies: string | undefined = theDocument().cookie
    if (typeof cookies === 'undefined') return ''
    const ca = cookies.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return ''
  },
  write(key: string, value: string): string {
    theDocument().cookie = key + '=' + value + '; path=/'
    return value
  }
}
