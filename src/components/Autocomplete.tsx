import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../types/Person';
import { DropDownMenu } from './DropDownMenu';
import { peopleFromServer } from '../data/people';

type Props = {
  setSelectedPerson: (person: Person | null) => void;
  DEBOUNCE_TIME: number;
};

export const Autocomplete: React.FC<Props> = ({
  setSelectedPerson,
  DEBOUNCE_TIME,
}) => {
  const [query, setQuery] = useState('');
  const [isInputFocused, setInputFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const applyQuery = useCallback(
    debounce((newQuery: string) => {
      setAppliedQuery(newQuery);
    }, DEBOUNCE_TIME),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (event.target.value === '') {
      setInputFocused(false);
    }
  };

  const handlePersonSelect = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setInputFocused(false);
  }, []);

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase().trim()
      .includes(appliedQuery.toLowerCase()));
  }, [query, peopleFromServer]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={handleInputFocus}
        />
      </div>

      {isInputFocused && (
        <DropDownMenu
          people={filteredPersons}
          onSelect={handlePersonSelect}
        />
      )}
    </div>
  );
};
