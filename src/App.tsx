import { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { normalizeInput } from './services/normalize-input';
import { filterPeople } from './services/filterPeople';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

export const App: React.FC<Person | {}> = () => {
  const [query, setQuery] = useState('');
  const [normalizedQuery, setNormalizedQuery] = useState('');

  const [selectedPeople, setSelectedPeople] = useState<Person | null>(null);
  const [showAllPeople, setShowAllPeople] = useState(false);

  const filteredPersons = useMemo(() => {
    return filterPeople(normalizedQuery);
  }, [normalizedQuery]);

  const applyQuery = useCallback(debounce(setNormalizedQuery, 1000), []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(normalizeInput(event.target.value));
    setSelectedPeople(null);
  };

  const handleOnClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPeople(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!selectedPeople
            ? 'No selected person'
            : `${selectedPeople.name} (${selectedPeople.born} - ${selectedPeople.died})`}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': showAllPeople || query,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleOnChange}
              onFocus={() => setShowAllPeople(true)}
              onBlur={() => setShowAllPeople(false)}
            />
          </div>

          {(query || showAllPeople) && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPersons.map(person => (
                  <div
                    className={classNames('dropdown-item', {
                      'is-active': person === selectedPeople,
                    })}
                    key={person.slug}
                    style={{ cursor: 'pointer' }}
                    data-cy="suggestion-item"
                    onClick={() => handleOnClick(person)}
                  >
                    <p
                      className={classNames({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredPersons.length === 0 && (
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
      </main>
    </div>
  );
};
