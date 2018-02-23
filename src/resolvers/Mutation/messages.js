const { getUserId } = require('../../utils')

const messages = {
  async createMessage(parent, args, ctx, info) {
    // Authorize the user and query it to add the message to
    const user = await ctx.db.query.user({ where: { id: getUserId(ctx) } })
    // See if the user already has a conversation
    let conversation = await ctx.db.query.conversations( {where: {threadId: args.threadId, user: {id: user.id}}})
    console.log(conversation)
    // if not create a new conversation for the user
    if(conversation.length == 0) { 
      conversation = await ctx.db.mutation.createConversation( {
        data: {
          threadId: args.threadId, 
          user: {
            connect: {
              id: user.id
            }
          } 
        }
      }) 
    }
    else conversation = conversation[0]
    const message = await ctx.db.mutation.createMessage( {
      data: {
        address: args.address,
        body: args.body,
        read: args.read,
        error: args.error,
        date: args.date,
        threadId: args.threadId,
        conversation: {
          connect: {
            id: conversation.id
          }
        }
      }
    })
    return message
  },

  async updateMessage(parent, args, ctx, info) {
    throw new Error(`Function not implemented yet`)
  },

  async deleteMessage(parent, args, ctx, info) {
    throw new Error(`Function not implemented yet`)
  },
}

module.exports = { messages }
