import cn from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';

type Person = {
  name: string,
  sex: string,
  born: number,
  died: number,
  fatherName: string | null,
  motherName: string | null,
  slug: string,
};

type Props = {
  delay: number,
};

export const App: React.FC<Props> = ({ delay }) => {
  const [query, setQuery] = useState('');

  const [appliedQuery, setAppliedQuery] = useState('');

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(personFromServer => personFromServer
        .name.toLowerCase().includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">
          {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}
      <div className={cn('dropdown', {
        'is-active': query !== selectedPerson?.name && isFocused,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
          />
        </div>
        { query && !appliedQuery ? (
          <div />
        ) : (
          <div className="dropdown-menu" role="menu">
            <div
              className="dropdown-content"
            >
              {filteredPeople.length !== 0 ? (
                filteredPeople.map((person) => (
                  <div
                    className="dropdown-item"
                    key={person.name}
                  >
                    <button
                      type="button"
                      className="has-text-link"
                      onClick={() => {
                        setSelectedPerson(person);
                        setQuery(person.name);
                      }}
                    >
                      {person.name}
                    </button>
                  </div>
                )))
                : (
                  <div className="dropdown-item">
                    <p className="has-text-link">No matching suggestions</p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
