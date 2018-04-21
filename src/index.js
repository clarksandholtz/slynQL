const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const resolvers = require('./resolvers')
const fs = require('fs')
const bodyParser = require('body-parser')
const { getUserIdFromAuthorization } = require('./utils')
const path = require('path')

const db = new Prisma({
  typeDefs: `src/generated/prisma.graphql`,
  endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
  secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
  debug: true // log all GraphQL queries & mutations
})

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db
  })
})

server.express.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
server.express.use(bodyParser.json({ type: 'application/json', limit: '50mb' }))
// server.express.use(function(req, res, next) {
//   next()
// })

// function nocache(req, res, next) {
//   console.log("HERE in No Cache")
//   res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//   res.header('Expires', '-1');
//   res.header('Pragma', 'no-cache');
//   next();
// }

// server.express.use(nocache)

server.express.post('/upload/image', (req, res, next) => {
  // Upload as type base64 and save to the Images directory under a sepcial name
  getUserIdFromAuthorization(req.get('Authorization'))
  if (!req.body.name || !req.body.content) {
    res.send('Name or Content Missing')
    return
  }
  res.sendStatus(200)
  // fs.writeFile(__dirname + "/../Images/"+ req.body.name, req.body.content, {encoding: 'base64'}, function(err) {
  //   if(err){
  //     console.log(err)
  //   } else{
  //     res.sendStatus(200)
  //     db.mutation.updateFile({data: {uploaded: true}, where: {content: req.body.name}})
  //   }
  // });
})

server.express.get('/download/image', (req, res, next) => {
  // This endpont will delete the images after downloading them off of the server
  getUserIdFromAuthorization(req.get('Authorization'))
  var file = path.join(__dirname, '/../Images/', req.query.name)
  res.download(file, (err) => {
    if (err) { // display error if there was an error deleting the file
      console.log(err)
    } else { // if there wasn't an error and the file downloaded then delete it
      fs.unlink(file, function (err) {
        if (err) {
          console.error(err.toString())
        } else {
          db.mutation.updateFile({data: {deleted: true}, where: {content: req.query.name}})
          console.warn(file + ' deleted')
        }
      })
    }
  })
})

server.start({cacheControl: false}, () => console.log('Server is running on http://localhost:4000'))

// Separate Websocket Port

const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const schema = require('prisma-json-schema/dist/schema.json')

const WS_PORT = 5000

// Create WebSocket listener server
const websocketServer = createServer((request, response) => {
  response.writeHead(404)
  response.end()
})
// Bind it to port and start listening
websocketServer.listen(WS_PORT, () => console.log(
  `Websocket Server is now running on http://localhost:${WS_PORT}`
))

// const subscriptionServer = SubscriptionServer.create(
SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe
  },
  {
    server: websocketServer,
    path: '/graphql'
  }
)
