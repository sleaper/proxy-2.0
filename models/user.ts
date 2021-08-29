import { AvarageMarkTypes, Event, Mark } from './../util/api-types'
import { Arg, Field, InputType, Int, ObjectType } from 'type-graphql'
import { subjects } from '../subjects'
import {
  chooseColor,
  fetchIndividualMarks,
  getDate,
  getStartEndOfWeek,
  types
} from '../util/utilz'
import fetch from 'node-fetch'
import { AvarageMark, Marks, Report, ScheduleEvent, UserInfo } from './models'
import { prisma } from '../prisma'

@ObjectType()
export class UserBase {
  @Field(() => String)
  name: string

  @Field(() => String)
  key: string

  @Field(() => String)
  firebaseToken: string
}

@InputType()
export class Date {
  @Field(() => [String, String])
  date: [string, string]
}

@ObjectType({ description: 'Object representing user' })
export class UserQuery extends UserBase {
  @Field(() => UserInfo)
  async info() {
    let data = await fetch(
      'https://aplikace.skolaonline.cz/SOLWebApi/api/v1/UzivatelInfo',
      {
        body: JSON.stringify(this.name),
        headers: {
          Authorization: `Basic ${this.key}`,
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

  @Field(() => [Marks])
  async subjectMarks(@Arg('subject') subject: string) {
    const timeLine: any = await fetch(
      'https://aplikace.skolaonline.cz/SOLWebApi/api/v1/ObdobiRoku',
      {
        headers: {
          Authorization: `Basic ${this.key}`,
          Base64: '1'
        }
      }
    )
      .then((response) => response.json())
      .catch((err) => console.error())

    let date = []
    // choose what half year is
    if (getDate() > timeLine.Data[0].DATUM_DO) {
      //@ts-expect-error
      date.push(timeLine.Data[1].DATUM_OD)
      //@ts-expect-error
      date.push(timeLine.Data[1].DATUM_DO)
    } else {
      //@ts-expect-error
      date.push(timeLine.Data[0].DATUM_OD)
      //@ts-expect-error
      date.push(timeLine.Data[0].DATUM_DO)
    }

    const data = await fetch(
      `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/VypisHodnoceniStudent?datumOd=${date[0]}&datumDo=${date[1]}`,
      {
        headers: {
          Authorization: `Basic ${this.key}`,
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

  @Field(() => [Report])
  async report() {
    const Marks = await fetch(
      ` https://aplikace.skolaonline.cz/SOLWebApi/api/v1/Vysvedceni?studentID=${
        (
          await this.info()
        ).personId
      }`,
      {
        headers: {
          Authorization: `Basic ${this.key}`,
          Base64: '1'
        }
      }
    )
      .then((response) => response.json())
      .catch((err) => console.error())

    const AvarageMarks = Marks.Data.HODNOCENI.map((item) => {
      return {
        subject: item.NAZEV,
        id: item.HODNOCENI_ID,
        marks: item.HODNOTY[0].NAZEV
      }
    })

    return AvarageMarks
  }

  @Field(() => [Marks])
  async marks(@Arg('date') date: Date) {
    const data = await fetch(
      `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/VypisHodnoceniStudent?datumOd=${date[0]}&datumDo=${date[1]}`,
      {
        headers: {
          Authorization: `Basic ${this.key}`,
          Base64: '1'
        }
      }
    )
      .then((response) => response.json())
      .catch((err) => console.error())

    const marks = data.Data.Hodnoceni.map((item) => {
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
    return marks
  }

  @Field(() => [ScheduleEvent])
  async daySchedule(@Arg('date') date: string) {
    const day = await fetch(
      `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/RozvrhoveUdalosti/${date}`,
      {
        headers: {
          Authorization: `Basic ${this.key}`,
          Base64: '1'
        }
      }
    )
      .then((res) => res.json())
      .catch((err) => console.error())

    const events: [Event] | [] = []

    // filter events and lessons
    const lessons = day.Data.UDALOSTI.filter((item: Event) => {
      if (item.TYP_UDALOSTI.TYP_UDALOSTI_ID !== 'ROZVRH') {
        //@ts-expect-error
        events.push(item)
        return false
      }
      return true
    })

    let editedEvents = events.map((t1: Event) => {
      return {
        event: t1.NAZEV,
        order: t1.OBDOBI_DNE_OD_ID,
        secondOrder: t1.OBDOBI_DNE_DO_ID,
        color: t1.BARVA
      }
    })

    const editedLessons = lessons.map((t1) => {
      if (t1.TYP_UDALOSTI.TYP_UDALOSTI_ID === 'ROZVRH') {
        return {
          name: t1.NAZEV,
          timeFrom: t1.CAS_OD,
          timeTo: t1.CAS_DO,
          room: t1.MISTNOSTI_UDALOSTI[0].NAZEV,
          teacher:
            t1.UCITELE_UDALOSTI[0].JMENO +
            ' ' +
            t1.UCITELE_UDALOSTI[0].PRIJMENI,
          subjectNum: t1.UDALOST_ID,
          subjectId: t1.UDALOST_ID + t1.OBDOBI_DNE_OD_ID,
          order: t1.OBDOBI_DNE_OD_ID,
          color: chooseColor(t1.NAZEV)
        }
      }
    })
    // This combines Events and normal lessons
    let final = editedLessons.map((item) => {
      return {
        ...item,
        Events: editedEvents.find((t2) => {
          if (t2.order === item.order || t2.secondOrder === item.order) {
            // Max 2 hours long event
            return true
          }
        })
      }
    })

    return final
  }

  //Need types here
  @Field(() => String)
  async homeworks() {
    let homeworks = await prisma.homeworks.findFirst({
      where: {
        userFireToken: this.firebaseToken
      }
    })

    if (!homeworks) {
      const homeworks = await fetch(
        'https://aplikace.skolaonline.cz/SOLWebApi/api/v1/DomaciUkoly',
        {
          headers: {
            Authorization: `Basic ${this.key}`,
            Base64: '1'
          }
        }
      )
        .then((res) => res.json())
        .catch((err) => console.error(err))

      const editedHomeworks = homeworks.Data.map((t1) => {
        return {
          name: t1.NAZEV_UKOLU,
          nnfo: t1.PODROBNE_ZADANI,
          timeTo: t1.TERMIN_ODEVZDANI,
          id: t1.UKOL_ID,
          color: chooseColor(t1.PREDMET_NAZEV),
          active: true
        }
      })

      let filteredByTime = editedHomeworks.filter((item) => {
        //@ts-expect-error
        if (Date.now() < Date.parse(item.timeTo)) {
          return true
        }
        return false
      })

      return filteredByTime
    }

    return homeworks
  }

  @Field(() => [AvarageMark])
  async avarageMarks() {
    const Marks = await fetch(
      `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/HodnoceniStudentSuma?studentID=${
        (
          await this.info()
        ).personId
      }`,
      {
        headers: {
          Authorization: `Basic ${this.key}`,
          Base64: '1'
        }
      }
    )
      .then((response) => response.json())
      .catch((err) => console.error(err))

    const AvarageMarks = Marks.Data.HODNOCENI.map((item: AvarageMarkTypes) => {
      return {
        subject: item.PREDMET_NAZEV,
        teacher: item.UCITEL_NAZEV,
        marks: item.HODNOCENI_PRUMER_TEXT,
        id: item.PREDMET_ID
      }
    })

    return AvarageMarks
  }
}

@ObjectType()
export class UserMutation extends UserBase {
  @Field(() => String)
  async saveHomeworks(
    @Arg('payload') payload: string,
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