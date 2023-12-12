export interface Person {
  name: string,
  sex: 'm' | 'f',
  born: number,
  died: number,
  fatherName: string | null,
  motherName: string | null,
  slug: string,
}

export type SetAutoComplList = (p: Person[], query: string) => Person[];

export type OnSelected = (user: Person) => void;
