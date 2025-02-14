import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.jpeg', '**/*.png'],
  server: {
    watch: {
      usePolling: true,
    },
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://dohlimnogrihixapnrxn.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvaGxpbW5vZ3JpaGl4YXBucnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NTQ5NzUsImV4cCI6MjA1NTEzMDk3NX0.FC3J_-gC-onYqtpvXTA42E_6KDV5TxhCsnlzfm6hCq4')
  },
  base: '/valentine-s-day/'
})
