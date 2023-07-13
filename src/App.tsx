import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  debounceDelay: number;
  noMatchesMessage: string;
}

export const App: React.FC<AppProps> = ({
  debounceDelay,
  noMatchesMessage,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropDownActive, setIsDropDownActive] = useState(false);

  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), debounceDelay),
    [debounceDelay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    applyQuery(value);
  };

  const handleClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsDropDownActive(false);
  };

  const filteredPeople = useMemo(() => {
    if (!appliedQuery) {
      setSelectedPerson(null);
      setIsDropDownActive(false);
    } else {
      setIsDropDownActive(true);
    }

    return peopleFromServer.filter(({
      name,
    }) => name.toLowerCase().includes(appliedQuery.toLowerCase()));
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': isDropDownActive,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                >
                  <button
                    type="button"
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => handleClick(person)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleClick(person);
                      }
                    }}
                    role="menuitem"
                  >
                    {person.name}
                  </button>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">{noMatchesMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
