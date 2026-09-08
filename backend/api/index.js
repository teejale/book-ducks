'use strict';

const path = require('node:path');
const appDir = path.resolve(__dirname, '..');
process.chdir(appDir);

let ready;
module.exports = async (request, response) => {
  if (!ready) {
    ready = Promise.resolve().then(() => {
      // Load Strapi within the request budget, rather than Vercel's short
      // module-initialization window.
      const { createStrapi } = require('@strapi/strapi');
      return createStrapi({ appDir, distDir: appDir }).load();
    }).then((strapi) => {
      strapi.server.mount();
      return strapi.server.app.callback();
    }).catch((error) => {
      ready = undefined;
      throw error;
    });
  }
  const handler = await ready;
  return handler(request, response);
};

module.exports.config = { api: { bodyParser: false } };
