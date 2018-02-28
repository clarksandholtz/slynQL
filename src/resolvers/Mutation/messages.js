const { getUserId } = require('../../utils')

const messages = {
  async createMessage(parent, args, ctx, info) {
    // Authorize the user and query it to add the message to
    const userId = getUserId(ctx)
    // See if the user already has a conversation
    let conversation = await ctx.db.query.conversations( {where: {threadId: args.threadId, user: {id: userId}}})
    // if not create a new conversation for the user
    if(conversation.length == 0) { 
      let phoneNums = args.address.split(" ")
      phoneNums.push(args.creator)
      let participants = phoneNums.map((num)=>{ return { phone: num } })
      conversation = await ctx.db.mutation.createConversation( {
        data: {
          threadId: args.threadId, 
          user: {
            connect: {
              id: userId
            }
          },
          participants: {
            create: participants
          }
        }
      }) 
    }
    else conversation = conversation[0]
    const message = await ctx.db.mutation.createMessage( {
      data: {
        address: args.address,
        creator: args.creator,
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

  async createMessages(parent, args, ctx, info){
    const userId = getUserId(ctx)
    const promises = args.messages.map((message) => {
      console.log(JSON.stringify(message))
      return messages.createMessage(parent, message, ctx, info)
    })
    return await Promise.all(promises).then(() => {
      return {
        success: true,
        status: `${args.messages.length} messages uploaded`
      }
    })
    .catch((err)=>{
      return {
        success: true,
        status: `Error: ${err}. Talk to your server guru.`
      }
    })
  },

  async updateMessage(parent, args, ctx, info) {
    getUserId(ctx) // authorize
    return await ctx.db.mutation.updateMessage({
      data:{
        read: args.read,
        error: args.error
      },
      where:{
        id: args.id
      }
    })
  },

  async deleteMessage(parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const message = await ctx.db.query.message({ where:{ id: args.id } })
    // Check to see if conversation is empty, if it is then delete it
    let conversation = await ctx.db.query.conversations( {where: {threadId: message.threadId, user: {id: userId}}})
    conversation = conversation[0]
    if( !('messages' in conversation) ){ // conversation is empty
      ctx.db.mutation.deleteConversation({ where: { id: conversation.id } })
    }
    return message
  },

  async deleteAllMessages(parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const conversations = await ctx.db.query.conversations({where: {user: {id: userId}}})
    for(let x = 0; x < conversations.length; x++){
      await ctx.db.mutation.deleteManyContacts({where: {conversation: {id: conversations[x].id}}})
      await ctx.db.mutation.deleteManyMessages({where: {conversation: {id: conversations[x].id}}})
    }
    return await ctx.db.mutation.deleteManyConversations({where: {user: {id: userId } } })
  }, 

}

module.exports = { messages }
