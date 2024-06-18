import { Person } from "./Person";

export type DropDownProps = {
  data: Person[],
  onSelected: (person: Person) => void;
}
