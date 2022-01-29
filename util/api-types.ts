export interface Mark {
  UDALOST_ID: string
  STUDENT_ID: string
  SKOLNI_ROK_ID: string
  SKOLNI_ROK_NAZEV: string
  POLOLETI_ID: string
  POLOLETI_NAZEV: string
  DATUM: string
  OBDOBI_DNE_ID: string
  OBDOBI_DNE_NAZEV: string
  DRUH_HODNOCENI_ID: string
  NAZEV: string
  POPIS: null
  PREDMET_ID: string
  UCITEL_ID: string
  DRUH_VYSLEDKU: string
  VYSLEDEK: string
  VYSLEDEK_TEXT: null
  HODNOCENI_MAX_BODU: null
  PROCENTA: null
  ZNAMKA: number
}

export interface AvarageMarkTypes {
  PREDMET_ID: string
  PREDMET_NAZEV: string
  PREDMET_ZKRATKA: string
  PRIZNAK_DRUH_PREDMETU: string
  UCITEL_ID: string
  UCITEL_NAZEV: string
  PORADI_ZOBRAZENI: number
  HODNOCENI_PRUMER: number
  HODNOCENI_PRUMER_TEXT: string
}

export interface Event {
  UDALOST_ID: string
  DATUM: Date
  PORADI: number
  OBDOBI_DNE_OD_ID: string
  OBDOBI_DNE_DO_ID: string
  OBDOBI_DNE_OD_NAZEV: string
  OBDOBI_DNE_DO_NAZEV: string
  CAS_OD: Date
  CAS_DO: Date
  DELKA_POCET_HODIN: number
  NAZEV: string
  POPIS: null
  TYP_UDALOSTI: TypUdalosti
  DRUH_UDALOSTI: null
  CYKLUS: string
  PREDMET: Predmet
  BARVA: string
  BARVA_PISMA: string
  POVOLEN_ZAPIS_DOCHAZKY: boolean
  POVOLEN_ZAPIS_HODNOCENI: boolean
  SKUPINY_UDALOSTI: SkupinyUdalosti[]
  TRIDY_UDALOSTI: null
  MISTNOSTI_UDALOSTI: MistnostiUdalosti[]
  UCITELE_UDALOSTI: UciteleUdalosti[]
  POZNAMKA: null
  PROBRANE_UCIVO: null
  NAHRAZUJE_HODINY: boolean
  JE_SUPLOVANA_HODINAMI: boolean
  NAHRAZUJE_HODINY_TEXT: null
  JE_SUPLOVANA_HODINAMI_TEXT: null
  POCET_ODUCENYCH_HODIN: null
}

export interface MistnostiUdalosti {
  MISTNOST_ID: string
  NAZEV: string
  POPIS: string
  PRIZNAK_ABSENCE: boolean
}

export interface Predmet {
  SKOLNI_ROK_ID: null
  PREDMET_ID: string
  ZKRATKA: string
  NAZEV: string
  PRIZNAK_DRUH_PREDMETU: string
  PORADI_ZOBRAZENI: null
}

export interface SkupinyUdalosti {
  SKUPINA_ID: string
  SKUPINA_NAZEV: string
  PRIZNAK_DRUH_SKUPINY: string
  TRIDA_ID: string
  TRIDA_NAZEV: string
  PRIZNAK_ABSENCE: boolean
}

export interface TypUdalosti {
  TYP_UDALOSTI_ID: string
  POPIS: string
}

export interface UciteleUdalosti {
  UCITEL_ID: string
  PRIJMENI: string
  JMENO: string
  ZKRATKA: string
  PRIZNAK_ABSENCE: boolean
}

export interface CalendarDayTypes {
  Name: string
  From: string
  To: Date
  Class: string
  Teacher: string
  Id: string
  Order: string
  Notes?: Notes
  Events?: Events
}

export interface Events {
  Event: string
  Order: string
  Color: string
}

export interface Notes {
  Note: string
  Order: string
}

export interface NoteTypes {
  POZNAMKA_ID: string
  DATUM: Date
  OBDOBI_DNE_ID: string
  OBDOBI_DNE_NAZEV: string
  OBDOBI_DNE_PORADI_ZOBRAZENI: number
  OBDOBI_DNE_CAS_OD: Date
  OBDOBI_DNE_CAS_DO: Date
  PREDMET_ID: string
  PREDMET_NAZEV: string
  PREDMET_ZKRATKA: string
  UCITEL_ID: string
  UCITEL_NAZEV: string
  POZNAMKA: string
}

export interface MarkInDB {
  Id: string
  Date: string
  Mark: string
  Name: string
  Value: {
    VAHA: number
    NAZEV: string
    POPIS: string
    PORADI_ZOBRAZENI: number
    DRUH_HODNOCENI_ID: string
  }
}
