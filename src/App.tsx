import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import './App.scss';
import classNames from 'classnames';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface Props {
  onSelected: (person:Person | null) => void,
  delay: number,
}

export const App: React.FC<Props> = ({ delay, onSelected }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const filteredPeople = useMemo(() => {
    if (query === '' && isInputFocused) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(query.toLowerCase()));
  }, [query, isInputFocused]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleBlur = useCallback(
    () => {
      setTimeout(() => {
        setIsDropdownVisible(false);
        setIsInputFocused(false);
      }, 500);
    }, [],
  );

  const handleFocus = useCallback(
    () => {
      setIsInputFocused(true);
      setIsDropdownVisible(true);
    }, [],
  );

  const handleSelect = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      person: Person,
    ) => {
      event.preventDefault();
      setSelectedPerson(person);
      setQuery(person.name);
      setIsDropdownVisible(false);
      onSelected(person);
    }, [onSelected],
  );

  const handleReset = () => {
    setQuery('');
    setSelectedPerson(null);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsDropdownVisible(query !== '' || isInputFocused);
    }, delay);

    return () => clearTimeout(timerId);
  }, [query, isInputFocused, delay, handleFocus, handleBlur]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleInput}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
          {query && (
            <span className="icon is right">
              <button
                className="delete is small"
                type="button"
                onClick={handleReset}
              >
                x
              </button>
            </span>
          )}
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
              >
                <a
                  href="#/"
                  className="has-text-link"
                  onClick={(event) => handleSelect(event, person)}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
