const { getUserId } = require('../utils')

const Query = {

  async allConversations (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    let conversation = await ctx.db.query.conversations({ where: { user: {id: userId} } })
    return conversation
  },

  async allPendingMessages (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const pendingMessages = await ctx.db.query.pendingMessages({where: {user: {id: userId}}})
    return pendingMessages
  },

  async allMessagesSince (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const messages = await ctx.db.query.messages({where: {date_gt: args.timestamp, user: {id: userId}}})
    return messages
  },

  async allContacts (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const contacts = await ctx.db.query.contacts({where: {conversation: {user: {id: userId}}}})
    return contacts
  },

  async me (parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  }

}

module.exports = { Query }
