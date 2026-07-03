import classNames from 'classnames';
import React, { useState } from 'react';
import { Person } from '../../types/Person';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { AutocompleteInput } from './AutocompleteInput';
import { AutocompleteItem } from './AutocompleteItem';

interface Props {
  persons: Person[];
  personName: string;
  onNameChange: (value: string) => void;
  onSelected: (person: Person) => void;
}

export const Autocomplete: React.FC<Props> = ({
  persons,
  personName,
  onNameChange,
  onSelected,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSelect = (person: Person) => {
    onSelected(person);
    setIsFocused(false);
  };

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isFocused,
      })}
    >
      <div className="dropdown-trigger">
        <AutocompleteInput
          onFocusChange={setIsFocused}
          name={personName}
          onNameChange={onNameChange}
        />
      </div>

      <ul className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {persons.length !== 0 ? (
            persons.map(person => {
              return (
                <AutocompleteItem
                  key={person.slug}
                  person={person}
                  name={personName}
                  onSelected={handleSelect}
                />
              );
            })
          ) : (
            <ErrorMessage />
          )}
        </div>
      </ul>
    </div>
  );
};
