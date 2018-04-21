const jwt = require('jsonwebtoken')

function getUserId (ctx) {
  const Authorization = ctx.request.get('Authorization')
  return getUserIdFromAuthorization(Authorization)
}

function getUserIdFromAuthorization (Authorization) {
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = verifyToken(token)
    return userId
  }
  throw new AuthError()
}

function verifyToken (token) {
  return jwt.verify(token, process.env.APP_SECRET)
}
class AuthError extends Error {
  constructor () {
    super('Not authorized')
  }
}

module.exports = {
  getUserId,
  getUserIdFromAuthorization,
  verifyToken,
  AuthError
}
