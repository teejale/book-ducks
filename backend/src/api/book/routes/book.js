'use strict';

/**
 * book router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::book.book');
  // module.exports = createCoreRouter('api::book.book', {
  //       config: {
  //           delete: {
  //               // register policy to check if user is admin
  //               policies: ["is-admin"]
  //           },
  //       }
  //   });
