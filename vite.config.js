import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `base` : le chemin sous lequel le site est servi.
//   - "/" en local, ou avec un nom de domaine à vous ;
//   - "/nom-du-depot/" sur GitHub Pages sans nom de domaine.
// Le workflow GitHub Actions le calcule tout seul et le passe dans BASE_PATH.
const base = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
