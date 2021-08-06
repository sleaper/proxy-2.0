import { Query, Resolver, Arg, Mutation } from 'type-graphql'
import { SubjectMarks, UserInfo } from './models/models'
import fetch from 'node-fetch'
import { getDate, types } from './util/utilz'
import { subjects } from './subjects'
import { Mark } from './util/api-types'
import { prisma } from './prisma'
import { Prisma } from '.prisma/client'

// export interface IContext {
//   request: RawRequestDefaultExpression
//   reply: FastifyReply
//   payload?: { userId: string }
// }

// export interface Payload {
//   userId: string
//   iat: number
//   exp: number
// }

@Resolver()
export class RootResolver {
  @Query(() => UserInfo)
  async UserInfo(
    @Arg('name') name: string,
    @Arg('key') key: string
  ): Promise<UserInfo> {
    let data = await fetch(
      'https://aplikace.skolaonline.cz/SOLWebApi/api/v1/UzivatelInfo',
      {
        body: JSON.stringify(name),
        headers: {
          Authorization: `Basic ${key}`,
          Base64: '1',
          'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST'
      }
    )
      .then((res) => res.json())
      .catch((err) => console.error())

    return {
      name: data.Data.JMENO,
      className: data.Data.TRIDA_NAZEV,
      personId: data.Data.OSOBA_ID
    }
  }

  @Query(() => Boolean)
  async UserAuth(@Arg('key') key: string): Promise<Boolean> {
    let data: any = await fetch(
      'https://aplikace.skolaonline.cz/SOLWebApi/api/v1/AuthorizationStatus',
      {
        headers: {
          Authorization: `Basic ${key}`,
          Base64: '1'
        }
      }
    )
      .then((res) => res.json())
      .catch((err) => console.error())

    return data.Data
  }

  @Query(() => [SubjectMarks])
  async SubjectMarks(
    @Arg('subject') subject: string,
    @Arg('key') key: string
  ): Promise<[SubjectMarks]> {
    const timeLine: any = await fetch(
      'https://aplikace.skolaonline.cz/SOLWebApi/api/v1/ObdobiRoku',
      {
        headers: {
          Authorization: `Basic ${key}`,
          Base64: '1'
        }
      }
    )
      .then((response) => response.json())
      .catch((err) => console.error())

    let date = []
    // choose what half year is
    if (getDate() > timeLine.Data[0].DATUM_DO) {
      date.push(timeLine.Data[1].DATUM_OD)
      date.push(timeLine.Data[1].DATUM_DO)
    } else {
      date.push(timeLine.Data[0].DATUM_OD)
      date.push(timeLine.Data[0].DATUM_DO)
    }

    const data = await fetch(
      `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/VypisHodnoceniStudent?datumOd=${date[0]}&datumDo=${date[1]}`,
      {
        headers: {
          Authorization: `Basic ${key}`,
          Base64: '1'
        }
      }
    )
      .then((response) => response.json())
      .catch((err) => console.error())

    const marks = data.Data.Hodnoceni.map((item: Mark) => {
      return {
        name: item.NAZEV,
        mark: item.VYSLEDEK,
        date: item.DATUM.substring(0, 10),
        id: item.UDALOST_ID,
        value: types.find(
          (t2) => t2.DRUH_HODNOCENI_ID === item.DRUH_HODNOCENI_ID
        ),
        subject: subjects.find((t2) => t2.PREDMET_ID === item.PREDMET_ID)
      }
    })
      //@ts-expect-error
      .sort((a, b) => new Date(b.Date) - new Date(a.Date))
      .filter((mark) => subject === mark.subject.NAZEV)

    return marks
  }

  @Mutation(() => Boolean)
  async addUser(
    @Arg('name') name: string,
    @Arg('key') key: string,
    @Arg('firebaseToken') firebaseToken: string
  ) {
    try {
      await prisma.user.create({
        data: {
          name: name,
          key: key,
          firebaseToken: firebaseToken
        }
      })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  @Mutation(() => Boolean)
  async saveHomeworks(
    @Arg('payload') payload: any,
    @Arg('key') key: string,
    @Arg('firebaseToken') firebaseToken: string
  ) {
    try {
      await prisma.homeworks.upsert({
        create: {
          data: payload,
          userFireToken: firebaseToken
        },
        where: {
          userFireToken: firebaseToken
        },
        update: {
          data: payload
        }
      })
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
