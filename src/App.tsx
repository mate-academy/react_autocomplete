import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 500),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (appliedQuery.length === 0) {
      setSelectedPerson(null);
    }

    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())
    ));
  }, [appliedQuery]);

  return (
    <main className="section">
      {selectedPerson
        ? (
          <h1 className="title">
            {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
          </h1>
        )
        : (
          <h1 className="title">No selected person</h1>
        )}

      <br />

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            value={query}
            onChange={handleQueryChange}
            className="input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        {isFocused && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length ? (
                filteredPeople.map(person => {
                  const isWoman = person.sex === 'f';

                  return (
                    <div
                      className="dropdown-item"
                      key={person.slug}
                    >
                      <a
                        href={`#${person.slug}`}
                        className={cn('has-text-link',
                          {
                            'has-text-danger': isWoman,
                          })}
                        onMouseDown={() => handlePersonClick(person)}
                      >
                        {person.name}
                      </a>
                    </div>
                  );
                })
              ) : (
                <div className="dropdown-item">
                  <p>
                    No matching suggestions
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
