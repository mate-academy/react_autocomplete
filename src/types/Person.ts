export interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
}

export interface DropdownContentProps {
  people: Person[];
  onSelectPerson: (person: Person) => void;
}

export interface DropdownItemProps {
  person: Person;
  onSelectPerson: (person: Person) => void;
}
