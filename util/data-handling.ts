import { subjects } from '../subjects'
import { Mark } from './api-types'
import { types } from './utilz'

//Create functions here for the data rewriting

export const marks = (data) => {
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

  return marks
}
