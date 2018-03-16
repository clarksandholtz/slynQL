const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const resolvers = require('./resolvers')
const fs = require('fs')
const bodyParser = require('body-parser');
const { getUserIdFromAuthorization } = require('./utils')

const db = new Prisma({
  typeDefs: `src/generated/prisma.graphql`,
  endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
  secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
  debug: true, // log all GraphQL queries & mutations
});

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db
  }),
})

server.express.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
server.express.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));

server.express.post('/upload/image',  (req, res, next)=>{
  // Upload as type base64 and save to the Images directory under a sepcial name
  getUserIdFromAuthorization(req.get("Authorization"))
  if(!req.body.name || !req.body.content){
    res.send("Name or Content Missing")
    res.sendStatus(400)
    return
  }
  fs.writeFile(__dirname + "/../Images/"+ req.body.name, req.body.content, {encoding: 'base64'}, function(err) {
    if(err){
      console.log(err)
    } else{
      res.sendStatus(200)
      db.mutation.updateFile({data: {uploaded: true}, where: {content: req.body.name}})
    }
  });
  
})

server.express.get('/download/image', (req, res, next)=>{
  // This endpont will delete the images after downloading them off of the server
  getUserIdFromAuthorization(req.get("Authorization"))
  var file = __dirname + '/../Images/' + req.query.name
  res.download(file, (err)=>{ 
    if(err){ // display error if there was an error deleting the file
      console.log(err)
    } else { // if there wasn't an error and the file downloaded then delete it
      fs.unlink(file, function (err) {
        if (err) {
            console.error(err.toString())
        } else {
            console.warn(file + ' deleted')
        }
      });
    }
  })
  res.sendStatus(200)
})

server.start(() => console.log('Server is running on http://localhost:4000'))

