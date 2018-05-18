const { getUserId } = require('../utils')

const sortConversations = (a, b) => {
  if (a.messages[0].date > b.messages[0].date) return -1
  else if (a.messages[0].date < b.messages[0].date) return 1
  else return 0
}

const sortMessages = (a, b) => {
  if (a.date > b.date) return 1
  else if (a.date < b.date) return -1
  else return 0
}

const sortAll = (conversations) => {
  conversations.sort(sortConversations)
  conversations.forEach((conversation) => {
    conversation.messages.sort(sortMessages)
  })
  return conversations
}

const Query = {

  async allConversations (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    let conversations = await ctx.db.query.conversations({ where: { user: {id: userId} }, orderBy: 'updatedAt_ASC' }, info)
    conversations = sortAll(conversations)
    return conversations
  },

  async allPendingMessages (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const pendingMessages = await ctx.db.query.pendingMessages({where: {user: {id: userId}}}, info)
    return pendingMessages
  },

  async allMessagesSince (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const messages = await ctx.db.query.messages({where: {date_gt: args.timestamp, user: {id: userId}}}, info)
    return messages
  },

  async allContacts (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const contacts = await ctx.db.query.contacts({where: {conversation: {user: {id: userId}}}}, info)
    return contacts
  },

  async allNotifications (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const notifications = await ctx.db.query.notifications({where: {user: {id: userId}}}, info)
    return notifications
  },

  async me (parent, args, ctx, info) {
    const id = getUserId(ctx)
    let user = ctx.db.query.user({ where: { id } }, info)
    user.conversations = sortAll(user.conversations)
    return user
  }

}

module.exports = { Query }
