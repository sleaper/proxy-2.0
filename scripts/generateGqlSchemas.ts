import 'dotenv/config'
import { printSchema } from 'graphql'
import fs from 'mz/fs'

import { schema } from '../schemas/schema'
;(async () => {
  await Promise.all([
    fs.writeFile('./gqlSchemas/schoolApp.graphql', printSchema(schema))
  ])
})()
