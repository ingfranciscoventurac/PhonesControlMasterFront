export interface LoginResponseFail {
  isSuccess: boolean
  token: string
  reason: string
}

export interface LoginResponseSuccess {
  id: number
  name: string
  email: string
  lastName: string
  isSuccess: boolean
  reason: string
  p1: number
  p2: number
  p3: number
  p4: number
  p5: number
  p6: number
  p7: number
  p8: number
  p9: number
  p10: number
}
