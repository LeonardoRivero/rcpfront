export interface StateDTO {
  codeState: string
  state: string
}
export interface TownDTO {
  id: number
  codeState: string
  codeTown: string
  town: string
}

export interface DIVIPOLADTO {
  town: TownDTO[],
  state: StateDTO[]
}

export interface OpeningHoursDTO {
  id: number
  nameDay: string,
  start: string,
  end: string
}
