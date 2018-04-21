const { Query } = require('./Query')
const { auth } = require('./Mutation/auth')
const { messages } = require('./Mutation/messages')
const { conversations } = require('./Mutation/conversations')
const { AuthPayload } = require('./AuthPayload')
const { Subscription } = require('./Subscription')
const { notifications } = require('./Mutation/notifications')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...messages,
    ...conversations,
    ...notifications
  },
  Subscription,
  AuthPayload
}
