import { Nullable } from './Nullable';

export interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  fatherName: Nullable<string>;
  motherName: Nullable<string>;
  slug: string;
}
