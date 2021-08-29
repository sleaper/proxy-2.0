import { Query, Resolver, Arg, Mutation } from 'type-graphql'
import fetch from 'node-fetch'
import { prisma } from './prisma'
import { UserBase, UserMutation, UserQuery } from './models/user'

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
  @Query(() => UserQuery)
  @Mutation(() => UserMutation)
  async user(@Arg('key') key: string) {
    let user = await prisma.user.findFirst({
      where: {
        key: key
      }
    })

    return user
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
  async removeUser(@Arg('firebaseToken') firebaseToken: string) {
    try {
      await prisma.user.delete({
        where: {
          firebaseToken: firebaseToken
        }
      })
      return true
    } catch (err) {
      return false
    }
  }

  // @Mutation(() => Boolean)
  // async saveHomeworks(
  //   @Arg('payload') payload: string,
  //   @Arg('firebaseToken') firebaseToken: string
  // ) {
  //   try {
  //     await prisma.homeworks.upsert({
  //       create: {
  //         data: payload,
  //         userFireToken: firebaseToken
  //       },
  //       where: {
  //         userFireToken: firebaseToken
  //       },
  //       update: {
  //         data: payload
  //       }
  //     })
  //   } catch (err) {
  //     console.log(err)
  //     return false
  //   }
  // }
}
