// index.ts
import 'reflect-metadata'
import fastify from 'fastify'
import mercurius from 'mercurius'
import { schema } from './schemas/schema'
import { captureException, init as sentryInit } from '@sentry/node'
import pkg from './package.json'
import { GraphqlError } from './api/GraphqlError'
import chalk from 'chalk'
import { prisma } from './prisma'
import {
  fetchHomeworks,
  fetchIndividualMarks,
  getStartEndOfWeek
} from './util/utilz'

sentryInit({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: `proxy@${pkg.version}`
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

const Notification = async () => {
  let users = await prisma.user.findMany({})

  let test = users.map((user) => {
    let newHomeworks = await fetchHomeworks(user.key).catch(async (e) => {
            if (e) {
               
                console.log(e, user.name)
            }
        })

    let newMarks = await fetchIndividualMarks(
            getStartEndOfWeek(),
            user.key
        ).catch(async (e) => {
            if (e) {
                console.log(e, user.name)
            }
        })



        if(newHomeworks.length > 0 || newMarks.length > 0) {
          
          let homeworks = await prisma.homeworks.findUnique({
      where: {
        userId: user.id
      }
    })

    let marks = await prisma.marks.findUnique({
      where: {
        userId: user.id
      }
    })

        
        }
   
  }

}

setInterval(Notification, 2000)
