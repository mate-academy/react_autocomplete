import React, { useCallback, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const filterPeopleByName = (
  items: Person[],
  query: string,
): Person[] => {
  const formatedQuery = query.toLowerCase().trim();

  return items.filter((item) =>
    item.name
      .toLocaleLowerCase()
      .includes(formatedQuery));
}

export const App: React.FC = () => {
  // #region state
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visibleDropdownMenu, setVisibleDropdownMenu]
  = useState<boolean>(false);
  // #endregion

  const filteredPeople = useMemo(() => {
    return filterPeopleByName([...peopleFromServer], appliedQuery);
  }, [appliedQuery],);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 500), [],);

  const onSelected = useCallback(
    (person: Person | null) => {
      setSelectedPerson(person);
      setVisibleDropdownMenu(false);
      setQuery(person?.name || '');
      applyQuery('');
    }, [],);

  // #region handle
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleInputOnFocus = useCallback(() => {
    setVisibleDropdownMenu(true);
  }, [],);

  const handleInputOnBlur = useCallback(() => {
    setVisibleDropdownMenu(false);
  }, [],);
  // #endregion

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleQueryChange}
            onFocus={handleInputOnFocus}
            onBlur={handleInputOnBlur}
          />
        </div>

        {
          visibleDropdownMenu
          && (<div role="menu" className="dropdown-menu">
            <div className="dropdown-content">
              {
                filteredPeople.length
                  ? (
                    filteredPeople.map(person => (
                      <div
                        role="button"
                        key={person.slug}
                        className="dropdown-item"
                        onMouseDown={() => { onSelected(person) }}
                      >
                        <p className="has-text-link">{person.name}</p>
                      </div>
                    ))
                  )
                  : (
                    <div
                      role="button"
                      className="dropdown-item"
                      onMouseDown={() => { onSelected(null) }}
                    >
                      <p className="has-text-danger">No matching suggestions</p>
                    </div>
                  )
              }
            </div>
          </div>)
        }
      </div>
    </main>
  );
};
