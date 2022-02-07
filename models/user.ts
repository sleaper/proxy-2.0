import { AvarageMarkTypes, Event, Mark, NoteTypes } from './../util/api-types'
import { Arg, Field, InputType, ObjectType } from 'type-graphql'
import { subjects } from '../subjects'
import { chooseColor, findName, getDate, types } from '../util/utilz'
import fetch from 'node-fetch'
import {
  AvarageMark,
  Marks,
  Report,
  ScheduleEvent,
  UserInfo,
  CalendarDay
} from './models'
import { prisma } from '../prisma'

@ObjectType()
export class UserBase {
  @Field(() => String)
  name: string

  @Field(() => String)
  key: string

  @Field(() => String)
  firebaseToken: string

  @Field(() => String)
  id: string
}

@InputType()
export class DateInput {
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
      personId: data.Data.OSOBA_ID,
      id: this.id
    }
  }

  @Field(() => [Marks])
  async subjectMarks(@Arg('subject') subject: string) {
    let date: string[] = []
    // choose what half year/term is
    //TODO: make time dynamic
    if (new Date(getDate()) > new Date('2022-01-31T00:00:00')) {
      date.push('2022-01-31T00:00:00')
      date.push('2022-06-30T00:00:00')
    } else {
      date.push('2021-09-01T00:00:00')
      date.push('2022-01-31T00:00:00')
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
        date: item.DATUM,
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
  async marks(
    @Arg('dateFrom') dateFrom: string,
    @Arg('dateTo') dateTo: string
  ) {
    const data = await fetch(
      `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/VypisHodnoceniStudent?datumOd=${dateFrom}&datumDo=${dateTo}`,
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
        date: item.DATUM,
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
  async daySchedule() {
    const day = await fetch(
      `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/RozvrhoveUdalosti/${getDate()}`,
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
    const lessons: [Event] = day.Data.UDALOSTI.filter((item: Event) => {
      if (
        item.TYP_UDALOSTI.TYP_UDALOSTI_ID !== 'ROZVRH' &&
        item.TYP_UDALOSTI.TYP_UDALOSTI_ID !== 'SUPLOVANI'
      ) {
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
      return {
        name: t1.NAZEV,
        timeFrom: t1.CAS_OD,
        timeTo: t1.CAS_DO,
        room: t1.MISTNOSTI_UDALOSTI[0].NAZEV,
        teacher:
          t1.UCITELE_UDALOSTI[0].JMENO + ' ' + t1.UCITELE_UDALOSTI[0].PRIJMENI,
        subjectNum: t1.UDALOST_ID,
        id: t1.UDALOST_ID + t1.OBDOBI_DNE_OD_ID,
        order: t1.OBDOBI_DNE_OD_ID,
        color: '#262626', // <==== Color is Hard Coded
        backUp: t1.TYP_UDALOSTI.TYP_UDALOSTI_ID === 'SUPLOVANI' ? true : false
      }
    })
    // This combines Events and normal lessons
    let final = editedLessons.map((item: any) => {
      return {
        ...item,
        events: editedEvents.find((t2) => {
          if (t2.order === item.order || t2.secondOrder === item.order) {
            // Max 2 hours long event
            return true
          }
        })
      }
    })

    return final
  }

  @Field(() => [CalendarDay])
  async calendarDay(@Arg('date') date: string) {
    console.log(date)
    const data = await fetch(
      `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/RozvrhoveUdalosti/${date}`,
      {
        headers: {
          Authorization: `Basic ${this.key}`,
          Base64: '1'
        }
      }
    ).then((response) => response.json())

    const notes = await fetch(
      `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/PoznamkyKHodine?datumOd=${date}&datumDo=${date}`,
      {
        headers: {
          Authorization: `Basic ${this.key}`,
          Base64: '1'
        }
      }
    )
      .then((res) => res.json())
      .catch((err) => console.error())

    const editedNotes = notes.Data.map((t1: NoteTypes) => {
      return {
        note: t1.POZNAMKA,
        order: t1.OBDOBI_DNE_ID
      }
    })

    //@ts-expect-error
    let events: [Event] = []

    const lessons: [Event] = data.Data.UDALOSTI.filter((item: Event) => {
      if (
        item.TYP_UDALOSTI.TYP_UDALOSTI_ID !== 'ROZVRH' &&
        item.TYP_UDALOSTI.TYP_UDALOSTI_ID !== 'SUPLOVANI'
        // item.TYP_UDALOSTI.TYP_UDALOSTI_ID !== 'OBECNA_UDALOST'
      ) {
        events.push(item)
        return false
      }
      return true
    })

    let editedLessons = lessons.map((item) => {
      return {
        name: findName(item.NAZEV),
        //@ts-expect-error
        timeFrom: item.CAS_OD.substring(11, 16), // get just starting time
        //@ts-expect-error
        timeTo: item.CAS_DO.substring(11, 16),
        class: item.MISTNOSTI_UDALOSTI[0].NAZEV,
        teacher:
          item.TYP_UDALOSTI.TYP_UDALOSTI_ID === 'ROZVRH'
            ? item.UCITELE_UDALOSTI[0].JMENO +
              ' ' +
              item.UCITELE_UDALOSTI[0].PRIJMENI
            : '',
        id: item.UDALOST_ID + item.PORADI,
        order: item.OBDOBI_DNE_OD_ID,
        backUp:
          item.TYP_UDALOSTI.TYP_UDALOSTI_ID === 'SUPLOVANI' ? true : false,
        type: 'lesson',
        notes: editedNotes.find(
          (t2: { order: string; note: string }) =>
            t2.order === item.OBDOBI_DNE_OD_ID
        )
      }
    })

    let editedEvents = events.map((t1) => {
      return {
        name: t1?.NAZEV,
        order: t1?.OBDOBI_DNE_OD_ID,
        color: t1?.BARVA,
        orderTo: t1?.OBDOBI_DNE_DO_ID,
        id: t1.UDALOST_ID,
        //@ts-expect-error
        timeFrom: t1.CAS_OD.substring(11, 16),
        //@ts-expect-error
        timeTo: t1.CAS_DO.substring(11, 16),
        type: 'event'
      }
    })

    // let final = editedLessons.map((item) => {
    //   return {
    //     ...item,
    //     events: editedEvents.find((t2) => t2.order === item.order),
    //     notes: editedNotes.find(
    //       (t2: { order: string; note: string }) => t2.order === item.order
    //     )
    //   }
    // })

    //@ts-expect-error
    return editedLessons.concat(editedEvents).sort((a, b) => a.order - b.order)
  }

  //Need types here
  @Field(() => [String])
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
        subjectName: item.PREDMET_NAZEV,
        subjectNameShort: item.PREDMET_ZKRATKA,
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
    return await prisma.homeworks.upsert({
      create: {
        data: payload,
        userFireToken: firebaseToken,
        userId: this.id
      },
      where: {
        userFireToken: firebaseToken
      },
      update: {
        data: payload
      }
    })
  }
}
