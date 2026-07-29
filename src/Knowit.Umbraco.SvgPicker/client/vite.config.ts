import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Keep this readable: it's a small backoffice-only bundle checked into git,
    // and minification just churns variable names across unrelated diffs.
    minify: false,
    lib: {
      entry: {
        'svg-picker': 'src/svg-picker.element.ts',
        'svg-sprite-path-picker': 'src/svg-sprite-path-picker.element.ts',
      },
      formats: ['es'],
    },
    outDir: '../App_Plugins/SvgPicker',
    emptyOutDir: false,
    rollupOptions: {
      external: [/^@umbraco-cms\//],
    },
  },
});
