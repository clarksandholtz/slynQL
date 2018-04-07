const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const auth = {
  async signup(parent, args, ctx, info) {
    console.log("UDIDIDIDID: " + args.uid)
    const uid = await bcrypt.hash(args.uid, 10)
    const user = await ctx.db.mutation.createUser({
      data: { name: args.name, email: args.email, uid: uid, phone: args.phone },
    })

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },

  async login(parent, {email, uid}, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: email } })
    if (!user) {
      throw new Error(`No such user found for email: ${email}`)
    }

    const valid = await bcrypt.compare(uid, user.uid)
    if (!valid) {
      throw new Error('Invalid password')
    }

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },
}

module.exports = { auth }
