'use strict';

const { createStrapi } = require('@strapi/strapi');

// Vercel detects this HTTP server entrypoint. Strapi's CLI remains available
// through `npm run develop` for local development.
createStrapi().start();
