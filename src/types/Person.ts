export interface PeoplesNames {
  name: string,
  slug: string,
  sex: 'm' | 'f',
}

export interface Person extends PeoplesNames {
  born: number,
  died: number,
  fatherName: string | null,
  motherName: string | null,
}
