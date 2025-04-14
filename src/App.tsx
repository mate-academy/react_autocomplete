import React, { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

type Props = {
  debounceDelay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({
  debounceDelay = 300,
  onSelected = () => {},
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleFilter = useMemo(
    () =>
      debounce((text: string) => {
        const trimmedText = text.trim();

        if (trimmedText === '') {
          setSuggestions(peopleFromServer);

          return;
        }

        const filtered = peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(trimmedText.toLowerCase()),
        );

        setSuggestions(filtered);
        setIsInputFocused(true);
      }, debounceDelay),
    [debounceDelay],
  );

  useEffect(() => {
    if (isInputFocused && inputValue.trim() === '') {
      setSuggestions(peopleFromServer);
    }
  }, [isInputFocused, inputValue]);

  useEffect(() => {
    if (inputValue.trim()) {
      handleFilter(inputValue);
    } else {
      setSuggestions(peopleFromServer);
    }

    return () => {
      handleFilter.cancel();
    };
  }, [inputValue, handleFilter]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setInputValue(newValue);
    setSelectedPerson(null);

    if (newValue.trim() === '') {
      setSuggestions(peopleFromServer);

      return;
    }
  };

  const handleFocus = () => {
    setIsInputFocused(true);

    if (inputValue.trim() === '') {
      setSuggestions(peopleFromServer);
    } else {
      handleFilter.cancel();
      handleFilter(inputValue);
    }
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setInputValue(person.name);
    setIsInputFocused(false);
    setSuggestions([]);
    handleFilter.cancel();
    onSelected(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {!selectedPerson ? (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        )}

        <div
          className={classNames('dropdown', {
            'is-active': isInputFocused,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </div>

          {(isInputFocused || suggestions.length > 0) && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestions.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    style={{ cursor: 'pointer' }}
                    onMouseDown={() => handleSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {suggestions.length === 0 && inputValue.trim() !== '' && (
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
