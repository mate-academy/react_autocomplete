import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelectedPerson: (person: Person) => void;
  onQuerry: (value: string) => void;
};

export const DropdownItem: React.FC<Props> = (
  {
    person,
    onSelectedPerson,
    onQuerry,
  },
) => {
  const handleSelectedPersone = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event?.preventDefault();
    onSelectedPerson(person);
    onQuerry(person.name);
  };

  return (
    <a
      key={person.slug}
      className={cn(
        'dropdown-item',
        {
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        },
      )}
      href="/"
      onClick={handleSelectedPersone}
    >
      {person.name}
    </a>
  );
};
