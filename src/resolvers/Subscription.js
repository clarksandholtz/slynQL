const { verifyToken } = require('../utils')
const { PubSub }  = require('graphql-subscriptions')

const pubsub = new PubSub()
const PENDING_MESSAGE = "pending_message"
const NEW_MESSAGE = "new_message"

const Subscription = {
  pendingMessages: {
    //subscribe: () => pubsub.asyncIterator("TEST")
    subscribe: async (parent, args, ctx, info) => {
      console.log("Subscription Started")
      console.log("TOKEN: " + args.token)
      const { userId } = verifyToken(args.token)
      console.log("UserId: " + userId)
      return pubsub.asyncIterator(userId+PENDING_MESSAGE)
    }
  },

  newMessage: {
    subscribe: async (parent, args, ctx, info) => {
      console.log("Subscription Started")
      console.log("TOKEN: " + args.token)
      const { userId } = verifyToken(args.token)
      console.log("UserId: " + userId)
      return pubsub.asyncIterator(userId+NEW_MESSAGE)
    } 
  },

}

module.exports = { Subscription, pubsub, PENDING_MESSAGE, NEW_MESSAGE}
