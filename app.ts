// index.ts
import 'reflect-metadata'
import fastify from 'fastify'
import mercurius from 'mercurius'
import { schema } from './schemas/schema'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import pkg from './package.json'
import { GraphqlError } from './api/GraphqlError'
import chalk from 'chalk'
import { captureException } from '@sentry/node'

Sentry.init({
  dsn: 'https://2e2de43cd4c14d2bb73661e3341290a8@o997900.ingest.sentry.io/5966709',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

const transaction = Sentry.startTransaction({
  op: 'test',
  name: 'My First Test Transaction'
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
