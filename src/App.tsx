import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { DropdownItem } from './components/DropdownItem';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [visiblePeople] = useState(peopleFromServer);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const [isListHided, setIsListHided] = useState(true);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    if (appliedQuery.length && !appliedQuery.trim()) {
      return visiblePeople;
    }

    return visiblePeople.filter(person => person.name.includes(appliedQuery));
  }, [appliedQuery]);

  const handleSelect = (userSlug :string) => {
    const currentSelectedPerson = visiblePeople
      .find(person => person.slug === userSlug)
      || null;

    setSelectedPerson(currentSelectedPerson);
    setQuery(pervState => currentSelectedPerson?.name || pervState);
    setAppliedQuery(pervState => currentSelectedPerson?.name || pervState);
    setIsListHided(true);
  };

  const selectedPersonInfo = useMemo(() => {
    return `${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`;
  }, [selectedPerson]);

  return (
    <main className="section">
      <h1 className="title">
        {!selectedPerson ? (
          'No selected person'
        ) : (
          selectedPersonInfo
        )}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsListHided(false)}
          />

        </div>

        <button
          type="button"
          className="button"
          onClick={() => setIsListHided(prevState => !prevState)}
        >
          {isListHided ? '🔽' : '🔼'}
        </button>

        {!isListHided && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {!filteredPeople.length ? (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              ) : filteredPeople.map(person => (
                <DropdownItem
                  person={person}
                  onSelect={handleSelect}
                  key={person.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
