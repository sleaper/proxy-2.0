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
  getStartEndOfWeek,
  startOfTheSchoolYear
} from './util/utilz'

sentryInit({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: `proxy@${pkg.version}`
})

const Notification = async () => {
  let users = await prisma.user.findMany({})

  users.forEach(async (user) => {
    //FETCH FOR NEW DATA
    let newHomeworks = await fetchHomeworks(user.key).catch(async (e) => {
      if (e) {
        console.log(e, user.name)
      }
    })

    let newMarks = await fetchIndividualMarks(
      startOfTheSchoolYear(user.key),
      user.key
    ).catch(async (e) => {
      if (e) {
        console.log(e, user.name)
      }
    })

    //Get data from DB
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

    //Check if there is data in DB
    if (marks?.data) {
      //Compare and save
    } else {
      await prisma.marks.create({
        data: {
          userFireToken: user.firebaseToken,
          data: newMarks,
          userId: user.id
        }
      })
    }
  })
}

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

  setInterval(Notification, 5000)
}

main().then(() => {
  console.log(`🚀 Server ready at http://localhost:3000/graphiql`)
})
