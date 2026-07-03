import classNames from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  name: string;
  setName: (newValue: string) => void;
}

export const AutocompleteItem: React.FC<Props> = ({
  person,
  name,
  setName,
}) => {
  return (
    <div
      className={classNames('dropdown-item', {
        back: person.name === name,
      })}
      data-cy="suggestion-item"
      onMouseDown={() => setName(person.name)}
    >
      <p className={classNames('has-text-link')}>{person.name}</p>
    </div>
  );
};
