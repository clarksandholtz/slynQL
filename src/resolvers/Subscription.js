const { verifyToken } = require('../utils')
const { PubSub }  = require('graphql-subscriptions')

const pubsub = new PubSub()
const PENDING_MESSAGE = "pending_message"
const NEW_MESSAGE = "new_message"
const SYNC_COMPLETE = "sync_complete"
const MARKED_AS_READ = "marked_as_read"

const Subscription = {
  pendingMessages: {
    subscribe: async (parent, args, ctx, info) => {
      console.log("Pending Messages Subscription Started")
      console.log("TOKEN: " + args.token)
      const { userId } = verifyToken(args.token)
      console.log("UserId: " + userId)
      return pubsub.asyncIterator(userId+PENDING_MESSAGE)
    }
  },

  syncComplete: {
    subscribe: async (parent, args, ctx, info) => {
      console.log("Sync Complete Subscription Started")
      console.log("TOKEN: " + args.token)
      const { userId } = verifyToken(args.token)
      console.log("UserId: " + userId)
      return pubsub.asyncIterator(userId+SYNC_COMPLETE)
    }
  },

  newMessage: {
    subscribe: async (parent, args, ctx, info) => {
      console.log("New Message Subscription Started")
      console.log("TOKEN: " + args.token)
      const { userId } = verifyToken(args.token)
      console.log("UserId: " + userId)
      return pubsub.asyncIterator(userId+NEW_MESSAGE)
    } 
  },

  markedAsRead: {
    subscribe: async (parent, args, ctx, info) => {
      console.log("Marked As Read Subscription Started")
      console.log("TOKEN: " + args.token)
      const { userId } = verifyToken(args.token)
      console.log("UserId: " + userId)
      return pubsub.asyncIterator(userId+MARKED_AS_READ)
    }
  }

}

module.exports = { Subscription, pubsub, PENDING_MESSAGE, NEW_MESSAGE, SYNC_COMPLETE, MARKED_AS_READ}
