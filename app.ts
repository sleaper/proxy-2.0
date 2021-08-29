// index.ts
import 'reflect-metadata'
import fastify from 'fastify'
import mercurius from 'mercurius'
import { schema } from './schemas/schema'

async function main() {
  const app = fastify({
    logger: true
  })

  app.register(mercurius, {
    schema,
    graphiql: true,
    context: (request, reply) => {
      return { request, reply }
    }
  })

  app.listen(3000, '0.0.0.0')
}

main().then(() => {
  console.log(`🚀 Server ready at http://localhost:3000/graphiql`)
})
