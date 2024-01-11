export interface Person {
  name: string,
  sex: 'm' | 'f',
  born: number,
  died: number,
  fatherName: string | null,
  motherName: string | null,
  slug: string,
}

export interface PersonWithId {
  name: string,
  sex: 'm' | 'f',
  born: number,
  died: number,
  fatherName: string | null,
  motherName: string | null,
  slug: string,
  id: number
}
