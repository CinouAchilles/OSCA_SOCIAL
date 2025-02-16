import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true,
    port: 5173,
    proxy: {
			"/api": {
				// target: "https://osca-social.onrender.com",
        target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
  },  
})
