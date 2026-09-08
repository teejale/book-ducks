'use strict';

const { createStrapi } = require('@strapi/strapi');
const path = require('node:path');
const appDir = path.resolve(__dirname, '..');
process.chdir(appDir);

let ready;
module.exports = async (request, response) => {
  if (!ready) {
    ready = createStrapi({ appDir, distDir: appDir }).load().then((strapi) => {
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
