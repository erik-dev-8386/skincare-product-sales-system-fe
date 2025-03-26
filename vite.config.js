// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     open: true // Mở trình duyệt tự động
//   }
// })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Thêm cấu hình mới
  define: {
    global: 'window', // Fix lỗi "global is not defined"
  },
  
  server: {
    proxy: {
      // Proxy cho API HTTP
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      
      // Proxy cho WebSocket
      '/haven-skin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true, // Bật proxy WebSocket
      },
    },
  },
  
  optimizeDeps: {
    include: ['sockjs-client', '@stomp/stompjs'], // Tối ưu hoá các thư viện WebSocket
  },
  
  resolve: {
    alias: {
      // Fix lỗi polyfill
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
});