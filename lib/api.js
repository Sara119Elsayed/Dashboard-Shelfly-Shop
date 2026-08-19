export const API_BASE = 'https://dummyjson.com'

export async function apiFetch(path, opts = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, opts)
  if (!res.ok) {
    const text = await res.text()
    const err = new Error(`API error ${res.status}: ${text}`)
    err.status = res.status
    throw err
  }
  return res.json()
}
