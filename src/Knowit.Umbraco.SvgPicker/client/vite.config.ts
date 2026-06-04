import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/svg-picker.element.ts',
      formats: ['es'],
      fileName: 'svg-picker',
    },
    outDir: '../App_Plugins/SvgPicker',
    emptyOutDir: false,
    rollupOptions: {
      external: [/^@umbraco-cms\//],
    },
  },
});
