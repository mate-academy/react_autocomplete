import classNames from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  name: string;
  onSelected: (person: Person) => void;
}

export const AutocompleteItem: React.FC<Props> = ({
  person,
  name,
  onSelected,
}) => {
  return (
    <div
      className={classNames('dropdown-item', {
        back: person.name === name,
      })}
      data-cy="suggestion-item"
      onMouseDown={e => {
        e.preventDefault();
        onSelected(person);
      }}
    >
      <p className={classNames('has-text-link')}>{person.name}</p>
    </div>
  );
};
