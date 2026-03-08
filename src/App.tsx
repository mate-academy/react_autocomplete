import { useMemo, useState, useRef, useEffect } from 'react';
import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

interface AutocompleteProps {
  delay?: number;
  onSelected?: (person: Person) => void;
}

export const App: React.FC<AutocompleteProps> = ({
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showField, setShowField] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const timeoutQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    timeoutQuery(e.target.value);
    setSelectedPerson(null);
  };

  const peopleToShow = useMemo(
    () =>
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
      ),
    [appliedQuery],
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowField(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setShowField(false);
    setQuery(person.name);

    if (onSelected) {
      onSelected(person);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          ref={containerRef}
          className={classNames('dropdown', {
            'is-active': showField && peopleToShow.length > 0,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onFocus={() => setShowField(true)}
              onChange={handleInput}
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {peopleToShow.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handleSelectPerson(person)}
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
        </div>

        {peopleToShow.length === 0 && appliedQuery && (
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
