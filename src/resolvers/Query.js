const { getUserId } = require('../utils')

const Query = {

  async allConversations(parent, args, ctx, info) {
    const userId = getUserId(ctx)
    let conversation = await ctx.db.query.conversations( {where: { user: {id: userId} } })
    return conversation
  },

  async me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },
}

module.exports = { Query }
