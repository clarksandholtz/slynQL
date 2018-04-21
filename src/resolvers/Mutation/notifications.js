const { getUserId } = require('../../utils')
const { publish, Types } = require('../Subscription')

const notifications = {

  async createNotification (parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const notification = await ctx.db.mutation.createNotification({ data: { ...args, user: { connect: {id: userId} } } })
    publish(userId, Types.newNotification, notification)
    return notification
  }

}

module.exports = { notifications }
