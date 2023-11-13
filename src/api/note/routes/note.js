"use strict";

/**
 * note router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::note.note", {
  config: {
    find: {
      middlewares: ["api::note.is-notes-owner"],
    },
    findOne: {
      middlewares: ["api::note.is-notes-owner"],
    },
    update: {
      middlewares: ["api::note.is-notes-owner"],
    },
    delete: {
      middlewares: ["api::note.is-notes-owner"],
    },
  },
});
