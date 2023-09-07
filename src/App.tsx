import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownItem } from './components/DropdownItem';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [visiblePeople] = useState(peopleFromServer);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const [isHideList, setIsHideList] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    setIsLoading(false);

    if (appliedQuery.length && !appliedQuery.trim()) {
      return visiblePeople;
    }

    return visiblePeople.filter(person => person.name.includes(appliedQuery));
  }, [appliedQuery, visiblePeople]);

  const handleSelect = (userSlug :string) => {
    const currentSelectedPerson = visiblePeople
      .find(person => person.slug === userSlug)
      || null;

    setSelectedPerson(currentSelectedPerson);
    setQuery(pervState => currentSelectedPerson?.name || pervState);
    setAppliedQuery(pervState => currentSelectedPerson?.name || pervState);
    setIsHideList(true);
  };

  return (
    <main className="section">
      <h1 className="title">
        {!selectedPerson ? (
          'No selected person'
        ) : (
          `${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`
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
            onFocus={() => setIsHideList(false)}
          />

        </div>

        <button
          type="button"
          className="button"
          onClick={() => setIsHideList(prevState => !prevState)}
        >
          {isHideList ? '🔽' : '🔼'}
        </button>

        {!isHideList && (
          <div className="dropdown-menu" role="menu">
            {isLoading ? (
              <div className="dropdown-content">
                <div className="dropdown-item">
                  <p>Loading...</p>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </main>
  );
};
