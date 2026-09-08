'use strict';

const { createStrapi } = require('@strapi/strapi');

let ready;
module.exports = async (request, response) => {
  if (!ready) {
    ready = createStrapi().load().then((strapi) => {
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
