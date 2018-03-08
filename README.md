<h1 align="center"><strong>New to the project?</strong></h1>
<b>MAC</b><br/>

- [Install Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
- Install prisma with <code>npm i -g prisma</code>
- Run npm install
- Run prisma deploy and choose local (Make sure you have docker installed before this step!!)
- Run yarn dev (or npm start ) to deploy the server locally
- yarn dev will open an in browser graphql playground where if you prefer graphiql desktop version you can use that instead
- to open a mysql terminal to inspect the database run docker exec -it prisma-db mysql -u root --host 127.0.0.1 --port 3306 --password=graphcool

<b>UBUNTU</b><br/>

- [Install Docker for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- Ensure that node is at least version 9 by running <code>node --version</code> ([install node 9](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04))
- Install prisma with <code>sudo npm i -g prisma</code>
- May need to install ajv@6.0.0 with <code>npm install ajv@6.0.0</code>
- May need to install graphql@0.13.0 with <code>npm install graphql@0.13.0</code>
- Run npm install
- Run prisma deploy and choose local (Make sure you have docker installed before this step!!)
- Run <code>npm start</code> to deploy the server locally

<h1 align="center"><strong>Advanced GraphQL Node Server</strong></h1>

<br />

![](https://imgur.com/lIi4YrZ.png)


## Features

- **Scalable GraphQL server:** The server uses [`graphql-yoga`](https://github.com/prisma/graphql-yoga) which is based on Apollo Server & Express
- **GraphQL database:** Includes GraphQL database binding to [Prisma](https://www.prismagraphql.com) (running on MySQL)
- **Authentication**: Signup and login workflows are ready to use for your users
- **Tooling**: Out-of-the-box support for [GraphQL Playground](https://github.com/prisma/graphql-playground) & [query performance tracing](https://github.com/apollographql/apollo-tracing)
- **Extensible**: Simple and flexible [data model](./database/datamodel.graphql) – easy to adjust and extend
- **No configuration overhead**: Preconfigured [`graphql-config`](https://github.com/prisma/graphql-config) setup
- **Realtime updates**: Support for GraphQL subscriptions (_coming soon_)

For a fully-fledged **GraphQL & Node.js tutorial**, visit [How to GraphQL](https://www.howtographql.com/graphql-js/0-introduction/). You can more learn about the idea behind GraphQL boilerplates [here](https://blog.graph.cool/graphql-boilerplates-graphql-create-how-to-setup-a-graphql-project-6428be2f3a5).

![](https://imgur.com/hElq68i.png)

## Documentation

### Commands

* `yarn start` starts GraphQL server on `http://localhost:4000`
* `yarn dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground
* `yarn playground` opens the GraphQL Playground for the `projects` from [`.graphqlconfig.yml`](./.graphqlconfig.yml)
* `yarn prisma <subcommand>` gives access to local version of Prisma CLI (e.g. `yarn prisma deploy`)

> **Note**: We recommend that you're using `yarn dev` during development as it will give you access to the GraphQL API or your server (defined by the [application schema](./src/schema.graphql)) as well as to the Prisma API directly (defined by the [Prisma database schema](./generated/prisma.graphql)). If you're starting the server with `yarn start`, you'll only be able to access the API of the application schema.

### Project structure

![](https://imgur.com/95faUsa.png)

| File name 　　　　　　　　　　　　　　| Description 　　　　　　　　<br><br>|
| :--  | :--         |
| `├── .env` | Defines environment variables |
| `├── .graphqlconfig.yml` | Configuration file based on [`graphql-config`](https://github.com/prisma/graphql-config) (e.g. used by GraphQL Playground).|
| `└── database ` (_directory_) | _Contains all files that are related to the Prisma database service_ |\
| `　　├── prisma.yml` | The root configuration file for your Prisma database service ([docs](https://www.prismagraphql.com/docs/reference/prisma.yml/overview-and-example-foatho8aip)) |
| `　　└── datamodel.graphql` | Defines your data model (written in [GraphQL SDL](https://blog.graph.cool/graphql-sdl-schema-definition-language-6755bcb9ce51)) |
| `└── src ` (_directory_) | _Contains the source files for your GraphQL server_ |
| `　　├── index.js` | The entry point for your GraphQL server |
| `　　├── schema.graphql` | The **application schema** defining the API exposed to client applications  |
| `　　├── resolvers` (_directory_) | _Contains the implementation of the resolvers for the application schema_ |
| `　　└── generated` (_directory_) | _Contains generated files_ |
| `　　　　└── prisma.grapghql` | The **Prisma database schema** defining the Prisma GraphQL API  |

