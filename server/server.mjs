import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import mongoose from 'mongoose';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { getAuth } from 'firebase-admin/auth'
import 'dotenv/config'

import { resolvers } from './resolvers/index.js';
import { typeDefs } from './schemas/index.js';

import './firebaseConfig.js'

const app = express()
const httpServer = http.createServer(app)

// Connect to Database
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.g3zcsve.mongodb.net/?retryWrites=true&w=majority`

const PORT = process.env.PORT || 4000

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/',
  });
  
  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
    // typeDefs,
    // resolvers,
    schema,
    Plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }), 
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ]
})

// const { url } = await startStandaloneServer(server, {
//     listen: { port: 4000 },
// });

await server.start()

const authorizationJWT = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization

    if(authorizationHeader) {
        const accessToken = authorizationHeader.split(' ')[1]

        getAuth()
            .verifyIdToken(accessToken)
            .then((decodedToken) => {
                res.locals.uid = decodedToken.uid
                next()
            })
            .catch(err => {
                console.log({err});
                return res.status(403).json({ message: 'Forbidden', error: err})
            })
    } else {
        next()
        // return res.status(401).json({ message: 'Unauthorized'})
    }
}

app.use(cors(), authorizationJWT, bodyParser.json(), expressMiddleware(server, {
    context: async ({req, res}) => {
        return { uid: res.locals.uid }
    }
}))


mongoose.set('strictQuery', false)

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to Mongoose');
    await new Promise((resolve) => httpServer.listen({port: PORT}, resolve))
    console.log('server ready at http://localhost:4000')
})


