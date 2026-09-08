'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
// Serve the admin's JavaScript, styles, and entry page from Vercel's CDN.
fs.cpSync(path.join(root, 'build'), path.join(root, 'public/admin'), { recursive: true });
fs.copyFileSync(path.join(root, 'favicon.png'), path.join(root, 'public/favicon.png'));
