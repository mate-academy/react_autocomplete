export interface Person {
  name: string,
  sex: 'm' | 'f',
  born: number,
  died: number,
  fatherName: string | null,
  motherName: string | null,
  slug: string,
}

export enum PersonSexEnum {
  man = 'm',
  female = 'f',
}
