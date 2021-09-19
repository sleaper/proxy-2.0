// index.ts
import 'reflect-metadata'
import fastify from 'fastify'
import mercurius from 'mercurius'
import { schema } from './schemas/schema'
import { captureException, init as sentryInit } from '@sentry/node'
import pkg from './package.json'
import { GraphqlError } from './api/GraphqlError'
import chalk from 'chalk'

sentryInit({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: `<project-name>@${pkg.version}`
})

async function main() {
  const app = fastify({
    logger: true
  })

  app.register(mercurius, {
    schema,
    graphiql: true,
    context: (request, reply) => {
      return { request, reply }
    },
    errorFormatter: (res, ctx) => {
      if (res.errors) {
        console.log(chalk.bgRed('Graphql errors: '))
        res.errors.map((err) => {
          if (err instanceof GraphqlError === false) {
            captureException(err)
          }
          console.error(' ', err)
        })
      }
      const errResponse = mercurius.defaultErrorFormatter(res, null)
      errResponse.statusCode = 200 // mercurius returns 500 by default, but we want to use 200 as that aligns better with apollo-server
      return errResponse
    }
  })

  app.listen(3000, '0.0.0.0')
}

main().then(() => {
  console.log(`🚀 Server ready at http://localhost:3000/graphiql`)
})
