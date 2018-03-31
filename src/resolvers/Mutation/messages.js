const { getUserId } = require('../../utils')
const { pubsub } = require('../Subscription')


const messages = {
  async createMessage(parent, args, ctx, info) {
    // Authorize the user and query it to add the message to
    const userId = getUserId(ctx)
    // See if the user already has a conversation
    let conversation = await ctx.db.query.conversations( {where: {threadId: args.threadId, user: {id: userId}}})
    // if not create a new conversation for the user
    if(conversation.length == 0) { 
      let phoneNums = args.address.trim().split(" ")
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
        androidMsgId: args.androidMsgId,
        userSent: args.userSent,
        sender: args.sender,
        body: args.body,
        read: args.read,
        error: args.error,
        date: args.date,
        threadId: args.threadId,
        files: {
          create: args.files
        },
        conversation: {
          connect: {
            id: conversation.id
          }
        }
      }
    })
    //Check to see if there is a pending message and delete it if there is
    const pendingMessages = await ctx.db.query.pendingMessages({
      where:{
        address: message.address,
        body: message.body,
        user: {id: userId}
      }
    })
    if(pendingMessages && pendingMessages.length > 0){ // If there are duplicate messages with same body and address this will delete one as a time as they are sent
      await ctx.db.mutation.deletePendingMessage({ where:{ id: pendingMessages[0].id } })
    }
    return message
  },

  async createMessages(parent, args, ctx, info){
    const userId = getUserId(ctx)
    for(let x = 0; x < args.messages.length; x++){
      await messages.createMessage(parent, args.messages[x], ctx, info)
    }
    console.log("LENGTH: " + args.messages.length)
    return {
      success: true,
      status: `${args.messages.length} messages uploaded`
    }
  },
  
  async sendMessage(parent, args, ctx, info){
    const userId = getUserId(ctx)
    let pendingMsg =  await ctx.db.mutation.createPendingMessage({
      data: {
        address: args.address,
        body: args.body,
        file: {
          create: args.file
        },
        user: {
          connect: {id: userId}
        }
      }
    })
   
    if(args.file){
      const file = await ctx.db.query.file({where: {content: args.file.content}})
      pendingMsg = {
        ...pendingMsg,
        file: file
      }
    }
    pubsub.publish(userId+"toSend", {pendingMessages: pendingMsg})
    console.log("Pending Message sent to " + userId + " " +  JSON.stringify(pendingMsg))
    return pendingMsg
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

module.exports = { messages} 