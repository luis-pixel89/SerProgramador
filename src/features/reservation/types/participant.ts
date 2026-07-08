export interface Participant {
  fullName: string
  email: string
  phone: string
  age: number
  hasAdvisor: boolean
  advisorName: string | null
}

export const EMPTY_PARTICIPANT: Participant = {
  fullName: '',
  email: '',
  phone: '',
  age: 0,
  hasAdvisor: false,
  advisorName: null,
}
