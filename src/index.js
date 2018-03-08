const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const resolvers = require('./resolvers')
const fs = require('fs')
const bodyParser = require('body-parser');

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
  let base64String = req.body.content
  let base64Image = base64String.split(';base64,').pop();
  let name = req.body.name
  fs.writeFile(__dirname + "/../Images/"+ name, base64Image, {encoding: 'base64'}, function(err) {
    if(err){
      console.log(err)
    } else{
      res.sendStatus(200)
      db.mutation.updateFile({data: {uploaded: true}, where: {content: name}})
    }
  });
  
})

server.express.get('/download/image', (req, res, next)=>{
  // This endpont will delete the images after downloading them off of the server
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
})

server.start(() => console.log('Server is running on http://localhost:4000'))

