const { getUserId } = require('../../utils')

const conversations = {
  async deleteConversation(parent, args, ctx, info) {
    getUserId(ctx)
    await ctx.db.mutation.deleteManyMessages( { where: { conversation: {id: args.id} } })
    return await ctx.db.mutation.deleteConversation( {where: {id: args.id} } )
  },

  async markThreadAsRead(parent, args, ctx, info){
    const userId = getUserId(ctx)
    return await ctx.db.mutation.updateManyMessages({
      data: {
        read: true
      },
      where:{
        conversation: {
          user: {id: userId},
          threadId: args.threadID
        }
      }
    })
  },
}

module.exports = { conversations }
