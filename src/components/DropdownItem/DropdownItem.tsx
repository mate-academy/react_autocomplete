import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelectedPerson: (person: Person) => void;
  onQuery: (value: string) => void;
};

export const DropdownItem: React.FC<Props> = (
  {
    person,
    onSelectedPerson,
    onQuery,
  },
) => {
  const handleSelectedPersone = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event?.preventDefault();
    onSelectedPerson(person);
    onQuery(person.name);
  };

  return (
    <a
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
