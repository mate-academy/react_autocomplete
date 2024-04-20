import { Person } from "./Person"

export type DropdownItemProps = {
  item: Person
  onSelected: (item: Person) => void,
}
