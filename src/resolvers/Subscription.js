const { verifyToken } = require('../utils')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const Types = {
  pendingMessages: 'pendingMessages',
  newMessage: 'newMessage',
  syncComplete: 'syncComplete',
  markedAsRead: 'markedAsRead',
  newNotification: 'newNotification',
  clearNotification: 'clearNotification'
}

const startSubscription = (type) => {
  return async (parent, args, ctx, info) => {
    console.log(`Started ${type} subscription`)
    const { userId } = verifyToken(args.token)
    console.log('UserId: ' + userId)
    return pubsub.asyncIterator(userId + type)
  }
}

const publish = (userId, type, object) => {
  const send = {
    [type]: object
  }
  pubsub.publish(userId + type, send)
  console.log(`Subscription of type ${type} fired to ${userId} with payload ${JSON.stringify(send)}`)
}

const createSubscriptions = () => {
  let subscription = {}
  for (let key in Types) {
    subscription[key] = {
      subscribe: startSubscription(Types[key])
    }
  }
  return subscription
}

const Subscription = createSubscriptions()

module.exports = { Subscription, publish, Types }
