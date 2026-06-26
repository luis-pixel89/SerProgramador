export interface Participant {
  fullName: string
  email: string
  phone: string
  age: number
}

export const EMPTY_PARTICIPANT: Participant = {
  fullName: '',
  email: '',
  phone: '',
  age: 0,
}
