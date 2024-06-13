import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  const [visibleQuery, setVisibleQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const [isActive, setIsActive] = useState(false);

  const debounceQuery = useCallback(debounce(setFilterQuery, 1000), []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setVisibleQuery(event.target.value);
      setPerson(null);

      debounceQuery(event.target.value);
    },
    [],
  );

  const handleSuggestionClick = useCallback((suggestion: Person) => {
    setVisibleQuery(suggestion.name);
    setFilterQuery(suggestion.name);
    setPerson(suggestion);

    setIsActive(false);
  }, []);

  const filteredSuggestions = useMemo(
    () =>
      peopleFromServer.filter(suggestion =>
        suggestion.name.toLowerCase().includes(filterQuery.toLowerCase()),
      ),
    [filterQuery],
  );

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdownElement = container.current;

      if (dropdownElement && !dropdownElement.contains(target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          <p>
            {person
              ? `${person.name} (${person.born} - ${person.died})`
              : 'No selected person'}
          </p>
        </h1>

        <div
          className={cn('dropdown', {
            'is-active': isActive && filteredSuggestions.length > 0,
          })}
          ref={container}
        >
          <div className="dropdown-trigger">
            <input
              autoFocus
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={visibleQuery}
              onChange={handleInputChange}
              onFocus={() => {
                setIsActive(true);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredSuggestions.map(suggestion => (
                <a
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={suggestion.slug}
                  onClick={() => {
                    handleSuggestionClick(suggestion);
                  }}
                >
                  <p
                    className={cn({
                      'has-text-link': suggestion.sex === 'm',
                      'has-text-danger': suggestion.sex === 'f',
                    })}
                  >
                    {suggestion.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {!filteredSuggestions.length && (
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
