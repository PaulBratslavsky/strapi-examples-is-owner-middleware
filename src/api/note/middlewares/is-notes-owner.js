"use strict";

/**
 * `is-note-owner` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In is-note-owner middleware.");
    const user = ctx.state.user;
    const userId = user.id;

    // This query allows user to populate the fields and relations
    // if you need additional security you would update the query accordingly
    // and remove ...ctx.query
    
    ctx.query = {
      ...ctx.query,
      filters: {
        author: userId,
      },
    };

    const entryId = ctx.params.id ? ctx.params.id : undefined;

    let entry = null;

    if (entryId) {
      entry = await strapi.entityService.findOne("api::note.note", entryId, {
        populate: "*",
      });
    }

    if (entry && entry.author.id !== userId) {
      return ctx.unauthorized(`You can't access this entry`);
    }

    await next();
  };
};
