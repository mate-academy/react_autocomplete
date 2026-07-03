import classNames from 'classnames';
import React, { useState } from 'react';
import { Person } from '../../types/Person';
import { AutocompleteInput } from './AutocompleteInput';
import { AutocompleteItem } from './AutocompleteItem';

interface Props {
  persons: Person[];
  personName: string;
  setPersonName: (value: string) => void;
}

export const Autocomplete: React.FC<Props> = ({
  persons,
  personName,
  setPersonName = () => {},
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocusInput = (isOpen: boolean) => {
    setIsFocused(isOpen);
  };

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isFocused && persons.length > 0,
      })}
    >
      <div className="dropdown-trigger">
        <AutocompleteInput
          onFocus={onFocusInput}
          name={personName}
          setName={setPersonName}
        />
      </div>

      <ul className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {persons.map(person => {
            return (
              <AutocompleteItem
                key={person.name}
                person={person}
                name={personName}
                setName={setPersonName}
              />
            );
          })}
        </div>
      </ul>
    </div>
  );
};
