const { Query } = require('./Query')
const { auth } = require('./Mutation/auth')
const { messages } = require('./Mutation/messages')
const { AuthPayload } = require('./AuthPayload')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...messages,
  },
  AuthPayload,
}
