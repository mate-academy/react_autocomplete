import { SEX } from '../enums';

export interface Person {
  name: string,
  sex: SEX,
  born: number,
  died: number,
  fatherName: string | null,
  motherName: string | null,
  slug: string,
}
