const { verifyToken } = require('../utils')
const { PubSub }  = require('graphql-subscriptions')

const pubsub = new PubSub()

const Subscription = {
  pendingMessages: {
    //subscribe: () => pubsub.asyncIterator("TEST")
    subscribe: async (parent, args, ctx, info) => {
      console.log("Subscription Started")
      console.log("TOKEN: " + args.token)
      const { userId } = verifyToken(args.token)
      console.log("UserId: " + userId)
      return pubsub.asyncIterator(userId+"toSend")
    }
  },

  newMessage: {
    subscribe: async(parent, args, ctx, info) => {
      const userId = getUserIdFromAuthorization(ctx.connection.context.Authorization)
      return ctx.db.subscription.message({
        where:{
          mutation_in: ["CREATED"],
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

module.exports = { Subscription, pubsub }
