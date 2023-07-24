import { FC, MouseEvent } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  selectedSlug: string;
  onSelectPerson: (
    event: MouseEvent,
    person: Person
  ) => void;
}

export const DropDownItem: FC<Props> = ({
  person,
  selectedSlug,
  onSelectPerson,
}) => {
  const { slug, sex, name } = person;

  return (
    <div
      className={cn('dropdown-item', {
        'is-active': slug === selectedSlug,
      })}
    >
      <a
        href="/"
        className={cn({
          'has-text-link': sex === 'm',
          'has-text-danger': sex === 'f',
        })}
        onClick={(event) => onSelectPerson(event, person)}
      >
        {name}
      </a>
    </div>
  );
};
