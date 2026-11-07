import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import type { Plugin } from 'vite'

const run = promisify(execFile)
const script = fileURLToPath(new URL('../scripts/generate-cv.mjs', import.meta.url))

// portfolio.json is a Vite config dependency through build/seo.ts. Saving it
// restarts the config and runs this hook before serving the updated page.
// The standalone script stays out of the browser bundle.
export function cvPlugin(): Plugin {
  return {
    name: 'portfolio-cv',
    apply: 'serve',
    async configureServer(server) {
      const { stdout } = await run(process.execPath, [script])
      server.config.logger.info(stdout.trim())
    },
  }
}
