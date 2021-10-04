import { Field, ID, InputType, Int, ObjectType } from 'type-graphql'

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

  @Field(() => String)
  id: string
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
  PORADI_ZOBRAZENI: string
}

@ObjectType()
export class Marks {
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

@ObjectType()
export class Report {
  @Field(() => String)
  id: string

  @Field(() => String)
  subject: string

  @Field(() => String)
  marks: string
}

@ObjectType()
export class ScheduleEvent {
  @Field(() => String)
  name: string

  @Field(() => String)
  timeFrom: string

  @Field(() => String)
  timeTo: string

  @Field(() => String)
  room: string

  @Field(() => String)
  teacher: string

  @Field(() => String)
  subjectNum: string

  @Field(() => String)
  id: string

  @Field(() => String)
  order: string

  @Field(() => String)
  color: string
}

@ObjectType()
export class AvarageMark {
  @Field(() => String)
  subject: string

  @Field(() => String)
  teacher: string

  @Field(() => String)
  marks: string

  @Field(() => String)
  id: string
}
@ObjectType()
export class Notes {
  @Field(() => String, { nullable: true })
  note: string

  @Field(() => String, { nullable: true })
  order: string
}

@ObjectType()
export class Events {
  @Field(() => String, { nullable: true })
  event: string

  @Field(() => String, { nullable: true })
  order: string

  @Field(() => String, { nullable: true })
  color: string
}
@ObjectType()
export class CalendarDay {
  @Field(() => String)
  name: string

  @Field(() => String)
  from: string

  @Field(() => String)
  to: string

  @Field(() => String)
  class: string

  @Field(() => String)
  teacher: string

  @Field(() => ID)
  id: string

  @Field(() => String)
  order: string

  @Field(() => Notes, { nullable: true })
  notes: Notes

  @Field(() => Events, { nullable: true })
  events: Events
}
