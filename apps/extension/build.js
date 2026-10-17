const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, 'dist');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function build() {
  console.log('[TubePilot AI Extension] Building extension bundle...');

  // 1. Build TypeScript content script, background worker, popup
  await esbuild.build({
    entryPoints: [
      path.resolve(__dirname, 'src/content.ts'),
      path.resolve(__dirname, 'src/background.ts'),
      path.resolve(__dirname, 'src/popup.ts'),
    ],
    bundle: true,
    outdir: outDir,
    format: 'iife',
    target: ['chrome100'],
    minify: process.argv.includes('--minify'),
    sourcemap: !process.argv.includes('--minify'),
  });

  // 2. Copy static files (manifest.json, styles.css, popup.html)
  fs.copyFileSync(
    path.resolve(__dirname, 'manifest.json'),
    path.resolve(outDir, 'manifest.json')
  );
  fs.copyFileSync(
    path.resolve(__dirname, 'src/styles.css'),
    path.resolve(outDir, 'styles.css')
  );
  fs.copyFileSync(
    path.resolve(__dirname, 'src/popup.html'),
    path.resolve(outDir, 'popup.html')
  );

  console.log('✅ [TubePilot AI Extension] Build complete! Ready to load unpacked from apps/extension/dist');
}

build().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
