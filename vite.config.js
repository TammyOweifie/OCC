import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// /api/* files are Vercel serverless functions. In `vite dev` (no `vercel dev`)
// they don't exist — send a proper 404/503 so the admin UI treats the endpoints
// as unavailable instead of Vite serving the .js source as an ES module.
const blockApiInDev = {
  name: 'block-api-in-dev',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/api/')) {
        res.statusCode = 503
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          error: 'API not available in `vite dev`. Use `vercel dev` for the full stack.',
        }))
        return
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), blockApiInDev],
  define: {
    // Flips preview-only launch-gate overrides (src/lib/launch.js) off
    // in Vercel production builds, so ?preview_launch_at / ?preview_force
    // are inert on the live site. Vite replaces this with a boolean
    // literal at build time; dead code is stripped.
    __LAUNCH_PREVIEW_MODE__: JSON.stringify(process.env.VERCEL_ENV !== 'production'),
  },
})
