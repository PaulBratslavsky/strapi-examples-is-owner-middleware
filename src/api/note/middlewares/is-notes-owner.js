"use strict";

/**
 * `is-note-owner` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    strapi.log.info("In is-note-owner middleware.");
    
    // Extract entryId and user from context
    const entryId = ctx.params.id;
    const user = ctx.state.user;
    const userId = user?.id;

    // This query allows user to populate the fields and relations
    // if you need additional security you would update the query accordingly
    // and remove ...ctx.query

    // If no user is logged in, adjust the query for public notes
    if (!user) {
      strapi.log.info("No user, Public notes only.");
      ctx.query = {
        ...ctx.query,
        filters: { ...ctx.query.filters, isPublic: true },
      };

      // Check if the specific entry is public
      if (entryId) {
        const entry = await strapi.entityService.findOne("api::note.note", entryId, { populate: "*" });
        if (entry && !entry.isPublic) {
          return ctx.unauthorized(`You can't access this entry`);
        }
      }
    } else {
      // Update query filters for authenticated user
      ctx.query = {
        ...ctx.query,
        filters: { ...ctx.query.filters, author: userId },
      };

      // Check if the user owns the specific entry
      if (entryId) {
        const entry = await strapi.entityService.findOne("api::note.note", entryId, { populate: "*" });
        if (entry && entry.author.id !== userId) {
          return ctx.unauthorized(`You can't access this entry`);
        }
      }
    }

    // Proceed to the next middleware
    await next();
  };
};
