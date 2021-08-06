import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType({ description: 'Object representing cooking recipe' })
export class Recipe {
  @Field()
  title: string

  @Field(() => String, {
    nullable: true,
    deprecationReason: 'Use `description` field instead'
  })
  @Field({
    nullable: true,
    description: 'The recipe description with preparation info'
  })
  description?: string

  @Field(() => [Int])
  ratings: number[]

  @Field()
  creationDate: Date
}

@ObjectType()
export class UserInfo {
  @Field(() => String)
  name: string

  @Field(() => String)
  className: string

  @Field(() => String)
  personId: string
}

@ObjectType()
export class Value {
  @Field(() => String)
  DRUH_HODNOCENI_ID: string

  @Field(() => String)
  NAZEV: string

  @Field(() => String)
  POPIS: string

  @Field(() => String)
  VAHA: string

  @Field(() => String)
  PORADI_ZOBRAZENI: string
}

@ObjectType()
export class Subject {
  @Field(() => String)
  SKOLNI_ROK_ID: string

  @Field(() => String)
  PREDMET_ID: string

  @Field(() => String)
  ZKRATKA: string

  @Field(() => String)
  NAZEV: string

  @Field(() => String)
  PRIZNAK_DRUH_PREDMETU: string

  @Field(() => String)
  VAHA: string

  @Field(() => String)
  PORADI_ZOBRAZENI: string
}

@ObjectType()
export class SubjectMarks {
  @Field(() => String)
  name: string

  @Field(() => String)
  mark: string

  @Field(() => String)
  date: string

  @Field(() => String)
  id: string

  @Field(() => Value)
  value: Value

  @Field(() => Subject)
  subject: Subject
}
