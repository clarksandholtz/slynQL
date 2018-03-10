const jwt = require('jsonwebtoken')

function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  return getUserIdFromAuthorization(Authorization)
}

function getUserIdFromAuthorization(Authorization){
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    return userId
  } 
  throw new AuthError()
}
class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}

module.exports = {
  getUserId,
  getUserIdFromAuthorization,
  AuthError
}