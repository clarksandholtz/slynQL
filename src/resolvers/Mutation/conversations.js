const { getUserId } = require('../../utils')

const conversations = {
  async deleteConversation(parent, args, ctx, info) {
    getUserId(ctx)
    await ctx.db.mutation.deleteManyMessages( { where: { conversation: {id: args.id} } })
    return await ctx.db.mutation.deleteConversation( {where: {id: args.id} } )
  },

  async markThreadAsRead(parent, args, ctx, info){
    const userId = getUserId(ctx)
    // for some reason calling updateManyMessages wasn't working for me here.. this is though..
    const messages = await ctx.db.query.messages({
      where:{
        conversation: {user: {id: userId}},
        threadId: args.threadId,
        read: false
      }
    })
    for(let x = 0; x < messages.length; x++){
      console.log("markThreadAsRead - threadId: " + args.threadId + " messageId: " + messages[x].id)
      await ctx.db.mutation.updateMessage({
        data:{
          read: true,
        },
        where: {
          id: messages[x].id
        }
      })
    }
    return {
      success: true,
      status: `${messages.length} messages marked as read`
    }
  },
}

module.exports = { conversations }
