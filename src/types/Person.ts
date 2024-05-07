export interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  fatherName: string | null;
  id?: number;
  motherName: string | null;
  slug: string;
}
