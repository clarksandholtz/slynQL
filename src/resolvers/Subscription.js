const { getUserIdFromAuthorization } = require('../utils')

const Subscription = {
  pendingMessages: {
    subscribe: async (args, parent, ctx, info) => {
      const userId = getUserIdFromAuthorization(ctx.connection.context.Authorization)
      return ctx.db.subscription.pendingMessage({
        where:{
          node: {
            user: {id: userId},
          },
        }
      }, info)
    }
  },

  newMessage: {
    subscribe: async(args, parent, ctx, info) => {
      const userId = getUserIdFromAuthorization(ctx.connection.context.Authorization)
      return ctx.db.subscription.message({
        where:{
          node:{
            conversation: {
              user: {
                id: userId
              }
            }
          }
        }
      }, info)
    }
  },

}

module.exports = { Subscription }
