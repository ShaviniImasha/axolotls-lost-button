// Rebuild every SVG:  node scripts/build-all.mjs
// Order matters: the UI scenes embed the finished character files.
await import('./build-characters.mjs');
await import('./build-underwater.mjs');
await import('./build-ui.mjs');
await import('./build-index.mjs');
await import('./build-gallery.mjs');
