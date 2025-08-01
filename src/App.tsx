import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [delayQuery, setDelayQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filterWithDelay = useCallback(debounce(setDelayQuery, 300), []);

  const filteredPeople = useMemo(() => {
    if (delayQuery.trim() === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter((person: Person) =>
      person.name.toLowerCase().includes(delayQuery.toLowerCase()),
    );
  }, [delayQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    filterWithDelay(event.target.value);

    if (selectedPerson && event.target.value !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  };

  const onSelect = (person: Person) => {
    setSelectedPerson(person);
    setIsFocused(false);
  };

  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
      setIsFocused(true);
    }
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              ref={field}
              type="text"
              placeholder="Enter a part of the name"
              value={query}
              onChange={handleQueryChange}
              onClick={() => setIsFocused(true)}
              className="input"
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {isFocused &&
              (filteredPeople.length > 0 ? (
                <div className="dropdown-content">
                  {filteredPeople.map((person: Person) => {
                    return (
                      <a
                        key={person.slug}
                        href="#"
                        className={classNames('dropdown-item', {
                          'is-active': selectedPerson?.slug === person.slug,
                        })}
                        data-cy="suggestion-item"
                        onClick={event => {
                          event.preventDefault();
                          onSelect(person);
                        }}
                      >
                        <p className="has-text-link">{person.name}</p>
                      </a>
                    );
                  })}
                </div>
              ) : (
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
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};
