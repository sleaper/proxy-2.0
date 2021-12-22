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
  Diffs,
  fetchHomeworks,
  fetchIndividualMarks,
  startOfTheSchoolYear
} from './util/utilz'
const logger = require('pino')()
import admin from 'firebase-admin'
import { data, newData } from './arr'

sentryInit({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: `proxy@${pkg.version}`
})

admin.initializeApp({
  credential: admin.credential.cert(
    './school-app-260e3-firebase-adminsdk-zmp06-a3c564e067.json'
  ),
  databaseURL: 'https://school-app-260e3.firebaseio.com'
})

const Notification = async () => {
  logger.info('Notification check')
  let users = await prisma.user.findMany({})

  users.forEach(async (user) => {
    //FETCH FOR NEW DATA
    // let newHomeworks = await fetchHomeworks(user.key).catch(async (e) => {
    //   if (e) {
    //     console.log(e, user.name)
    //   }
    // })

    let newMarks = await fetchIndividualMarks(
      startOfTheSchoolYear(user.key),
      user.key
    ).catch(async (e) => {
      if (e) {
        console.log(e, user.name)
      }
    })

    //Get data from DB
    // let homeworks = await prisma.homeworks.findUnique({
    //   where: {
    //     userId: user.id
    //   }
    // })

    let marks = await prisma.marks.findUnique({
      where: {
        userId: user.id
      }
    })

    //Check if there is data in DB
    if (marks?.data) {
      //Compare and save
      let diffs = Diffs(newMarks, marks.data)
      let name = diffs[0].name
      let mark = diffs[0].mark

      try {
        await admin.messaging().send({
          token: user.firebaseToken,
          notification: {
            title: `Známka z ${name}`,
            body: `Známka: ${mark}`
          }
        })

        const child = logger.child({ diff: diffs[0] })
        child.info('Notification sended')
      } catch (error) {
        const child = logger.child({ name: user.name })
        child.info('Invalid firebase token')

        // if error remove the token
        await prisma.user.deleteMany({
          where: { firebaseToken: user.firebaseToken }
        })
      }
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
