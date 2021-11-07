import { Query, Resolver, Arg, Mutation } from 'type-graphql'
import fetch from 'node-fetch'
import { prisma } from './prisma'
import { UserMutation, UserQuery } from './models/user'

// export interface IContext {
//   request: RawRequestDefaultExpression
//   reply: FastifyReply
//   payload?: { userId: string }
// }

@Resolver()
export class RootResolver {
  @Query(() => UserQuery)
  @Mutation(() => UserMutation)
  async user(@Arg('key') key: string) {
    //We need upsert here
    // We call this on login, even when user is not in the DB
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
      await prisma.user.upsert({
        create: {
          name: name,
          key: key,
          firebaseToken: firebaseToken
        },
        update: {
          firebaseToken: firebaseToken
        },
        where: {
          key: key
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
}
