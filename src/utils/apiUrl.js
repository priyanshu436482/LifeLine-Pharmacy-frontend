const DEFAULT_LOCAL_API = 'http://localhost:5000/api'

function isPrivateLanHost(hostname) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
  )
}

function isHostedProductionHost(hostname) {
  return hostname.includes('vercel.app') || hostname.includes('github.io')
}

/**
 * Local PC: localhost:5000
 * Phone on same Wi‑Fi: http://192.168.x.x:5000/api
 * Vercel / GitHub Pages: VITE_API_URL (your backend Vercel URL)
 */
export function getApiUrl() {
  const fromEnv = import.meta.env.VITE_API_URL?.trim()

  if (typeof window === 'undefined') {
    return fromEnv || DEFAULT_LOCAL_API
  }

  const { hostname } = window.location

  if (isHostedProductionHost(hostname)) {
    if (!fromEnv) {
      console.warn('VITE_API_URL is not set — admin and products may not work on Vercel.')
    }
    return fromEnv || DEFAULT_LOCAL_API
  }

  if (
    import.meta.env.DEV &&
    isPrivateLanHost(hostname) &&
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1'
  ) {
    return `http://${hostname}:5000/api`
  }

  return fromEnv || DEFAULT_LOCAL_API
}
