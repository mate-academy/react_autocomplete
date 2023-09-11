import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

const PERSON_SEX_MAN = 'm';
const PERSON_SEX_WOMAN = 'f';

type Props = {
  person: Person
  onSelectPerson: (person: Person) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onSelectPerson }) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    className="dropdown-item"
    style={{ cursor: 'pointer' }}
    onClick={() => onSelectPerson(person)}
  >
    <p
      className={cn('has-text-link', {
        'has-text-danger': person.sex === PERSON_SEX_WOMAN,
        'has-text-link': person.sex === PERSON_SEX_MAN,
      })}
    >
      {person.name}
    </p>
  </div>
);
