import React, { FC, useState, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';
import { filterPeople } from '../../utils/filterPeople';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';

type Props = {
  selectedPerson: Person | null;
  onSelect: (person: Person | null) => void;
  delay?: number;
};

export const Dropdown: FC<Props> = ({
  selectedPerson,
  onSelect,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const filteredPeople = useMemo(
    () => filterPeople(peopleFromServer, { appliedQuery }),
    [appliedQuery],
  );

  const visiblePeople = useMemo(
    () => (selectedPerson ? peopleFromServer : filteredPeople),
    [selectedPerson, filteredPeople],
  );

  const onInputFocus = () => {
    setIsActive(true);
  };

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value.trimStart());
      applyQuery(event.target.value);
      onSelect(null);
    },
    [applyQuery, onSelect],
  );

  const handleSelectPerson = useCallback(
    (person: Person) => {
      onSelect(person);
      setQuery(person.name);
      setIsActive(false);
    },
    [onSelect],
  );

  return (
    <>
      <div
        className={cn('dropdown', {
          'is-active': isActive,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            data-cy="search-input"
            className="input"
            value={query}
            onFocus={onInputFocus}
            onChange={onInputChange}
          />
        </div>

        {!!filteredPeople.length && (
          <DropdownMenu
            people={visiblePeople}
            selectedPerson={selectedPerson}
            onSelectPerson={handleSelectPerson}
          />
        )}
      </div>

      {!filteredPeople.length && (
        <div
          className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start
            "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
