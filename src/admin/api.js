// Thin fetch wrappers for the /api/admin/* endpoints.
// Cookies (including the session cookie) are sent automatically because
// requests are same-origin.

async function request(path, opts = {}) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
    ...opts,
  })
  if (res.status === 204) return null

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  if (!isJson) {
    const err = new Error(
      `Expected JSON from ${path} (got ${contentType || 'no content-type'}, status ${res.status}). ` +
        'If you are running `vite dev`, the /api/* serverless functions are not active — use `vercel dev`.'
    )
    err.status = res.status
    throw err
  }

  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

export const adminApi = {
  login: (email, password) =>
    request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request('/api/admin/logout', { method: 'POST' }),
  me: () => request('/api/admin/me'),

  listNews: () => request('/api/admin/news'),
  getNewsPost: id => request(`/api/admin/news/${id}`),
  createNewsPost: payload =>
    request('/api/admin/news', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateNewsPost: (id, payload) =>
    request(`/api/admin/news/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteNewsPost: id =>
    request(`/api/admin/news/${id}`, { method: 'DELETE' }),
}

// Read a File as a data URL (base64) for upload payloads.
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
