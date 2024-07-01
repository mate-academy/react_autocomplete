import React, { FC, useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { List } from './List';

type Props = {
  allPeople: Person[];
  isSelectedPerson: boolean;
  onSelected: (person: Person | null) => void;
  onChange: () => void;
};

export const Search: FC<Props> = ({
  allPeople,
  isSelectedPerson,
  onSelected,
  onChange,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange();
    if (isSelectedPerson) {
      onSelected(null);
    }

    const value = e.target.value;

    setQuery(value);
    applyQuery(value);
  };

  const OnClick = useCallback((person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsFocus(false);
  }, []);

  const filteredPeople = useMemo(
    () =>
      [...allPeople].filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      ),
    [appliedQuery, allPeople],
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleOnChange}
          onFocus={() => setIsFocus(true)}
        />
      </div>
      {isFocus && filteredPeople.length > 0 && (
        <List people={filteredPeople} onClick={OnClick} />
      )}
    </div>
  );
};
