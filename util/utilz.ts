import fetch from 'node-fetch'

export let types = [
  {
    DRUH_HODNOCENI_ID: 'C6179',
    NAZEV: 'PPR 2',
    POPIS: 'Písemná práce 2',
    VAHA: 0.4,
    PORADI_ZOBRAZENI: 2
  },
  {
    DRUH_HODNOCENI_ID: 'C6178',
    NAZEV: 'PPR 1',
    POPIS: 'Písemná práce 1',
    VAHA: 0.2,
    PORADI_ZOBRAZENI: 2
  },
  {
    DRUH_HODNOCENI_ID: 'C6180',
    NAZEV: 'PPR 3',
    POPIS: 'Písemná práce 3',
    VAHA: 0.6,
    PORADI_ZOBRAZENI: 3
  },
  {
    DRUH_HODNOCENI_ID: 'C6181',
    NAZEV: 'PPR 4',
    POPIS: 'Písemná práce 4',
    VAHA: 0.8,
    PORADI_ZOBRAZENI: 4
  },
  {
    DRUH_HODNOCENI_ID: 'C6182',
    NAZEV: 'PPR 5',
    POPIS: 'Písemná práce 5',
    VAHA: 1.0,
    PORADI_ZOBRAZENI: 5
  },
  {
    DRUH_HODNOCENI_ID: 'C6183',
    NAZEV: 'ÚZK 1',
    POPIS: 'Ústní zkouška 1',
    VAHA: 0.2,
    PORADI_ZOBRAZENI: 6
  },
  {
    DRUH_HODNOCENI_ID: 'C6184',
    NAZEV: 'ÚZK 2',
    POPIS: 'Ústní zkouška 2',
    VAHA: 0.4,
    PORADI_ZOBRAZENI: 7
  },
  {
    DRUH_HODNOCENI_ID: 'C6185',
    NAZEV: 'ÚZK 3',
    POPIS: 'Ústní zkouška 3',
    VAHA: 0.6,
    PORADI_ZOBRAZENI: 8
  },
  {
    DRUH_HODNOCENI_ID: 'C6186',
    NAZEV: 'ÚZK 4',
    POPIS: 'Ústní zkouška 4',
    VAHA: 0.8,
    PORADI_ZOBRAZENI: 9
  },
  {
    DRUH_HODNOCENI_ID: 'C6187',
    NAZEV: 'ÚZK 5',
    POPIS: 'Ústní zkouška 5',
    VAHA: 1.0,
    PORADI_ZOBRAZENI: 10
  },
  {
    DRUH_HODNOCENI_ID: 'C6188',
    NAZEV: 'PRČ 1',
    POPIS: 'Praktická činnost 1',
    VAHA: 0.2,
    PORADI_ZOBRAZENI: 11
  },
  {
    DRUH_HODNOCENI_ID: 'C6189',
    NAZEV: 'PRČ 2',
    POPIS: 'Praktická činnost 2',
    VAHA: 0.4,
    PORADI_ZOBRAZENI: 12
  },
  {
    DRUH_HODNOCENI_ID: 'C6190',
    NAZEV: 'PRČ 3',
    POPIS: 'Praktická činnost 3',
    VAHA: 0.6,
    PORADI_ZOBRAZENI: 13
  },
  {
    DRUH_HODNOCENI_ID: 'C6191',
    NAZEV: 'PRČ 4',
    POPIS: 'Praktická činnost 4',
    VAHA: 0.8,
    PORADI_ZOBRAZENI: 14
  },
  {
    DRUH_HODNOCENI_ID: 'C6192',
    NAZEV: 'PRČ 5',
    POPIS: 'Praktická činnost 5',
    VAHA: 1.0,
    PORADI_ZOBRAZENI: 15
  },
  {
    DRUH_HODNOCENI_ID: 'C6193',
    NAZEV: 'DOP 1',
    POPIS: 'Domácí příprava 1',
    VAHA: 0.2,
    PORADI_ZOBRAZENI: 16
  },
  {
    DRUH_HODNOCENI_ID: 'C6194',
    NAZEV: 'DOP 2',
    POPIS: 'Domácí příprava 2',
    VAHA: 0.4,
    PORADI_ZOBRAZENI: 17
  },
  {
    DRUH_HODNOCENI_ID: 'C6195',
    NAZEV: 'AKT 1',
    POPIS: 'Aktivita v hodině 1',
    VAHA: 0.2,
    PORADI_ZOBRAZENI: 21
  },
  {
    DRUH_HODNOCENI_ID: 'C6196',
    NAZEV: 'AKT 2',
    POPIS: 'Aktivita v hodině 2',
    VAHA: 0.4,
    PORADI_ZOBRAZENI: 22
  },
  {
    DRUH_HODNOCENI_ID: 'C6197',
    NAZEV: 'MET 1',
    POPIS: 'Metodické portfolio1',
    VAHA: 0.2,
    PORADI_ZOBRAZENI: 31
  },
  {
    DRUH_HODNOCENI_ID: 'C6198',
    NAZEV: 'MET 2',
    POPIS: 'Metodické portfolio 2',
    VAHA: 0.4,
    PORADI_ZOBRAZENI: 32
  },
  {
    DRUH_HODNOCENI_ID: 'C6199',
    NAZEV: 'MET 3',
    POPIS: 'Metodické portfolio 3',
    VAHA: 0.6,
    PORADI_ZOBRAZENI: 33
  },
  {
    DRUH_HODNOCENI_ID: 'C6200',
    NAZEV: 'MET 4',
    POPIS: 'Metodické portfolio 4',
    VAHA: 0.8,
    PORADI_ZOBRAZENI: 34
  },
  {
    DRUH_HODNOCENI_ID: 'C6201',
    NAZEV: 'MET 5',
    POPIS: 'Metodické portfolio 5',
    VAHA: 1.0,
    PORADI_ZOBRAZENI: 35
  }
]

export async function fetchIndividualMarks(date, key) {
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
    .catch((err) => {
      if (err) {
        console.error(err)
        return err
      }
    })

  const marks = data.Data.Hodnoceni.map((item) => {
    return {
      Name: item.NAZEV,
      Mark: item.VYSLEDEK,
      Date: item.DATUM.substring(0, 10),
      Id: item.UDALOST_ID,
      Value: types.find((t2) => t2.DRUH_HODNOCENI_ID === item.DRUH_HODNOCENI_ID)
    }
  })
    //@ts-expect-error
    .sort((a: any, b: any) => new Date(b.Date) - new Date(a.Date))
  return marks
}

export async function fetchHomeworks(key) {
  const homeworks = await fetch(
    'https://aplikace.skolaonline.cz/SOLWebApi/api/v1/DomaciUkoly',
    {
      headers: {
        Authorization: `Basic ${key}`,
        Base64: '1'
      }
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      if (err) {
        console.error(err)
        return err
      }
    })

  const editedHomeworks = homeworks.Data.map((t1) => {
    return {
      Name: t1.NAZEV_UKOLU,
      Info: t1.PODROBNE_ZADANI,
      TimeTo: t1.TERMIN_ODEVZDANI,
      id: t1.UKOL_ID,
      Color: chooseColor(t1.PREDMET_NAZEV),
      Active: true
    }
  })

  let filteredByTime = editedHomeworks.filter((item) => {
    if (Date.now() < Date.parse(item.TimeTo)) {
      return true
    }
    return false
  })

  return filteredByTime
}
/*export function getStartEndOfWeek() {
    let curr = new Date() // get current date
    let month = curr.getDate()
    let day = curr.getDay()

    let first = month - day + 1 // First day is the day of the month - the day of the week
    let last = first + 11 // last day is the first day + 11 (For the next week)

    let firstday = new Date(curr.setDate(first))
    let lastday = new Date(curr.setDate(last))

    return [
        JSON.stringify(firstday).substring(1, 11),
        JSON.stringify(lastday).substring(1, 11),
    ]
}*/

export function getMonday(d) {
  d = new Date(d)
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1) // adjust when day is sunday
  return new Date(d.setDate(diff))
}

export function getStartEndOfWeek() {
  let curr = new Date() // get current date
  let curr2 = new Date()

  let lastWeek = new Date(curr2.setDate(curr.getDate() - 7))
  let nextWeek = new Date(curr.setDate(curr.getDate() + 11))

  return [
    JSON.stringify(getMonday(lastWeek)).substring(1, 11),
    JSON.stringify(nextWeek).substring(1, 11)
  ]
}

export function getDate() {
  let today = new Date()
  let dd = String(today.getDate())
  let mm = String(today.getMonth() + 1) //January is 0!
  let yyyy = today.getFullYear()

  return yyyy + '-' + mm + '-' + dd
}

export const getInterval = () => {
  let date = new Date()
  let day = date.getDay()
  let isWeekend = day === 6 || day === 0 // 6 = Saturday, 0 = Sunday
  if (isWeekend) {
    return 7200000
  } else {
    return 300000
  }
}

function isObject(object) {
  return object != null && typeof object === 'object'
}

export function deepEqual(newObject, dbObject) {
  const keys1 = Object.keys(newObject)
  const keys2 = Object.keys(dbObject)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    const val1 = newObject[key]
    const val2 = dbObject[key]
    const areObjects = isObject(val1) && isObject(val2)
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false
    }
  }

  return true
}

function comparer(otherArray) {
  return function (current) {
    return (
      otherArray.filter(function (other) {
        return (
          other.Id === current.Id &&
          other.Name === current.Name &&
          other.Mark === current.Mark
        )
      }).length == 0
    )
  }
}

export function findName(string: string): string {
  if (string.length > 30) {
    return string.substring(0, 3)
  } else {
    //@ts-expect-error
    return /\(([^)]+)\)/.exec(string)[1]
  }
}

// for comparing
export function Diffs(newData, oldData) {
  return newData.filter(comparer(oldData))
}

export function chooseColor(subject) {
  if (
    subject === 'Základy společenských věd (ZSV)' ||
    subject === 'ZSV (Základy společenských věd)' ||
    subject === 'OV (Občanská výchova)' ||
    subject === 'Občanská výchova (OV)'
  ) {
    return '#fca103'
  } else if (
    subject === 'Tělesná výchova (TV)' ||
    subject === 'TV (Tělesná výchova)'
  ) {
    return '#fc4103'
  } else if (subject === 'Biologie (BI)' || subject === 'BI (Biologie)') {
    return '#34eb49'
  } else if (
    subject === 'Německý jazyk (NJ)' ||
    subject === 'NJ (Německý jazyk)'
  ) {
    return '#ae259d'
  } else if (subject === 'Chemie (CH)' || subject === 'CH (Chemie)') {
    return '#a43bc2'
  } else if (subject === 'Fyzika (FY)' || subject === 'FY (Fyzika)') {
    return '#63cbf4'
  } else if (subject === 'Zeměpis (ZE)' || subject === 'ZE (Zeměpis)') {
    return '#b9bb3c'
  } else if (subject === 'Dějepis (DE)' || subject === 'DE (Dějepis)') {
    return '#9b7419'
  } else if (subject === 'Matematika (MA)' || subject === 'MA (Matematika)') {
    return '#3952da'
  } else if (
    subject === 'Estetická výchova – výtvarný obor (EVV)' ||
    subject === 'EVV (Estetická výchova – výtvarný obor)' ||
    subject === 'HV (hudební výchova)' ||
    subject === 'hudební výchova (HV)'
  ) {
    return '#f4c092'
  } else if (
    subject === 'Informatika a výpočetní technika (IVT)' ||
    subject === 'IVT (Informatika a výpočetní technika)'
  ) {
    return '#34e5eb'
  } else if (
    subject === 'Anglický jazyk (AJ)' ||
    subject === 'AJ (Anglický jazyk)'
  ) {
    return '#f33c01'
  } else if (
    subject === 'Český jazyk a literatura (CJL)' ||
    subject === 'CJL (Český jazyk a literatura)'
  ) {
    return '#e0b819'
  } else if (
    subject === 'Výtvarná výchova (VV)' ||
    subject === 'VV (Výtvarná výchova)'
  )
    return '#df03fc'
}

// THIS CAN BE USED FOR MORE THEN A WEEK
/*const fetchDayCalendar = async (id, key, week) => {
    const data = await fetch(
        `https://aplikace.skolaonline.cz/SOLWebApi/api/v1/RozvrhoveUdalosti/${week[0]}/${week[1]}/${id}`,
        {
            headers: {
                Authorization: `Basic ${key}`,
                Base64: '1',
            },
        }
    ).then((response) => response.json());

    const events = [];

    const lessons = data.Data.UDALOSTI.filter((item) => {
        if (item.TYP_UDALOSTI.TYP_UDALOSTI_ID !== 'ROZVRH') {
            events.push(item);
            return false;
        }
        return true;
    });

    let timeTable = {};
    lessons.forEach((item) => {
        let time = item.DATUM.substring(0, 10);
        if (timeTable.hasOwnProperty(time)) {
            timeTable[time].push({
                Name: item.NAZEV,
                From: item.CAS_OD,
                To: item.CAS_DO,
                Class: item.MISTNOSTI_UDALOSTI[0].NAZEV,
                Teacher:
                    item.UCITELE_UDALOSTI[0].JMENO +
                    ' ' +
                    item.UCITELE_UDALOSTI[0].PRIJMENI,
                Id: item.UDALOST_ID,
                Order: item.OBDOBI_DNE_OD_ID,
            });
        } else {
            timeTable[time] = [
                {
                    Name: item.NAZEV,
                    From: item.CAS_OD,
                    To: item.CAS_DO,
                    Class: item.MISTNOSTI_UDALOSTI[0].NAZEV,
                    Teacher:
                        item.UCITELE_UDALOSTI[0].JMENO +
                        ' ' +
                        item.UCITELE_UDALOSTI[0].PRIJMENI,
                    Id: item.UDALOST_ID,
                    Order: item.OBDOBI_DNE_OD_ID,
                },
            ];
        }
    });

    const EventsByDate = {};
    events.forEach((t1) => {
        let time = t1.DATUM.substring(0, 10);
        if (EventsByDate.hasOwnProperty(time)) {
            EventsByDate[time].push({
                Event: t1.NAZEV,
                Order: t1.OBDOBI_DNE_OD_ID,
                Color: t1.BARVA,
            });
        } else {
            EventsByDate[time] = [
                {
                    Event: t1.NAZEV,
                    Order: t1.OBDOBI_DNE_OD_ID,
                    Color: t1.BARVA,
                },
            ];
        }
    });

    let connected = {};
    Object.keys(timeTable).forEach((date) => {
        for (let i in timeTable[date]) {
            if (connected.hasOwnProperty(date)) {
                connected[date].push({
                    ...timeTable[date][i],
                    Events: EventsByDate[date].find(
                        (t2) => t2.Order === timeTable[date][i].Order
                    ),
                });
            } else {
                connected[date] = [
                    {
                        ...timeTable[date][i],
                        Events: EventsByDate[date].find(
                            (t2) => t2.Order === timeTable[date][i].Order
                        ),
                    },
                ];
            }
        }
    });

    return connected;
};*/

// THIS IS DATA STRUCTURE FOR CALENDAR MARKED DATES (Can be used for more days)
/*
let timeTable = {};
lessons.forEach((item) => {
    let time = item.DATUM.substring(0, 10);
    if (timeTable.hasOwnProperty(time)) {
        timeTable[time].push({
            Name: item.NAZEV,
            From: item.CAS_OD,
            To: item.CAS_DO,
            Class: item.MISTNOSTI_UDALOSTI[0].NAZEV,
            Teacher:
                item.UCITELE_UDALOSTI[0].JMENO +
                ' ' +
                item.UCITELE_UDALOSTI[0].PRIJMENI,
            Id: item.UDALOST_ID,
            Order: item.OBDOBI_DNE_OD_ID,
        });
    } else {
        timeTable[time] = [
            {
                Name: item.NAZEV,
                From: item.CAS_OD,
                To: item.CAS_DO,
                Class: item.MISTNOSTI_UDALOSTI[0].NAZEV,
                Teacher:
                    item.UCITELE_UDALOSTI[0].JMENO +
                    ' ' +
                    item.UCITELE_UDALOSTI[0].PRIJMENI,
                Id: item.UDALOST_ID,
                Order: item.OBDOBI_DNE_OD_ID,
            },
        ];
    }
});

const EventsByDate = {};
events.forEach((t1) => {
    let time = t1.DATUM.substring(0, 10);
    if (EventsByDate.hasOwnProperty(time)) {
        EventsByDate[time].push({
            Event: t1.NAZEV,
            Order: t1.OBDOBI_DNE_OD_ID,
            Color: t1.BARVA,
        });
    } else {
        EventsByDate[time] = [
            {
                Event: t1.NAZEV,
                Order: t1.OBDOBI_DNE_OD_ID,
                Color: t1.BARVA,
            },
        ];
    }
});

let connected = {};
Object.keys(timeTable).forEach((date) => {
    for (let i in timeTable[date]) {
        if (connected.hasOwnProperty(date)) {
            connected[date].push({
                ...timeTable[date][i],
                Events: EventsByDate[date].find(
                    (t2) => t2.Order === timeTable[date][i].Order
                ),
            });
        } else {
            connected[date] = [
                {
                    ...timeTable[date][i],
                    Events: EventsByDate[date].find(
                        (t2) => t2.Order === timeTable[date][i].Order
                    ),
                },
            ];
        }
    }
});

*/
