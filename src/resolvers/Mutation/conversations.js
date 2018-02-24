const { getUserId } = require('../../utils')

const conversations = {
  async deleteConversation(parent, args, ctx, info) {
    getUserId(ctx)
    await ctx.db.mutation.deleteManyMessages( { where: { conversation: {id: args.id} } })
    return await ctx.db.mutation.deleteConversation( {where: {id: args.id} } )
  }
}

module.exports = { conversations }
