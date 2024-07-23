interface Person {
  name: string;
  born: number;
  died: number;
}

export const DisplayedPerson: React.FC<{ selected: Person | null }> = ({
  selected,
}) => {
  return selected
    ? `${selected.name} (${selected.born} - ${selected.died})`
    : 'No selected person';
};
