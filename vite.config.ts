import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			// Alias ini sengaja disamakan dengan konvensi `$lib` di project SvelteKit lama,
			// supaya migrasi import path antar file lebih mudah (tinggal cari-ganti).
			$lib: path.resolve(__dirname, './src/lib'),
			$data: path.resolve(__dirname, './src/data'),
			$types: path.resolve(__dirname, './src/types')
		}
	}
});
