import React, {
  useCallback, useEffect, useState, useRef,
} from 'react';
import debounce from 'lodash/debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './components/DropdownMenu';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [delayedQuery, setDelayedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isQueryCleared, setIsQueryCleared] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [activePersonSlug, setActivePersonSlug] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isQueryCleared) {
      setDelayedQuery('');
      setSearchResults([]);
      setIsQueryCleared(false);
      setIsDropdownActive(false);
    } else {
      setSearchResults(peopleFromServer.filter(
        (person) => person.name.toLowerCase()
          .includes(delayedQuery.toLowerCase()),
      ));
    }
  }, [peopleFromServer, delayedQuery, isQueryCleared]);

  const delayQuery = useCallback(debounce(setDelayedQuery, 500), []);

  function trimWhitespace(str: string) {
    const trimmedStart = str.replace(/^\s/, '');

    const trimmedAll = trimmedStart.replace(/\s{2,}/g, ' ');

    return trimmedAll;
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedQuery = trimWhitespace(event.target.value);

    setQuery(trimmedQuery);
    setIsQueryCleared(false);
    delayQuery(trimmedQuery);
  };

  const clearQuery = () => {
    setQuery('');
    setIsQueryCleared(true);
    setSearchResults([]);
    setSelectedPerson(null);
  };

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setActivePersonSlug(person.slug);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current
      .contains(event.target as Node)) {
      setIsDropdownActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">{`${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`}</h1>
      ) : (
        <h1 className="title">No person is selected</h1>
      )}

      <div
        className={classnames('dropdown', {
          'is-active': isDropdownActive,
        })}
        ref={dropdownRef}
      >
        <div className="dropdown-trigger">
          <div className="control has-icons-left has-icons-right">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleSearch}
              onClick={() => setIsDropdownActive(true)}
            />
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            {query && (
              <span className="icon is-right">
                <button
                  type="button"
                  className="delete"
                  aria-label="clear-input"
                  onClick={() => clearQuery()}
                />
              </span>
            )}
          </div>
        </div>

        <DropdownMenu
          searchResults={searchResults}
          onSelect={selectPerson}
          setIsDropdownActive={setIsDropdownActive}
          activePersonSlug={activePersonSlug}
        />
      </div>
    </main>
  );
};
