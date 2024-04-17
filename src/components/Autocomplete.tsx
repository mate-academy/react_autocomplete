import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Autocomplete.scss';

import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

interface IProps {
  people: Person[];
  onSelected?: (person: Person) => void;
  onInputChange?: (inputValue: string) => void;
  delay?: number;
}

export const Autocomplete: React.FC<IProps> = React.memo(
  ({
    people,
    onSelected = () => {},
    onInputChange = () => {},
    delay = 300,
  }) => {
    const [inputText, setInputText] = useState('');
    const [appliedInputText, setAppliedInputText] = useState('');
    const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const applyInputText = useCallback(
      debounce(setAppliedInputText, delay),
      [],
    );

    const useOutsideClick = (callBack: () => void) => {
      const ref = useRef<HTMLInputElement>(null);

      const handleClick = useCallback(
        (event: MouseEvent) => {
          if (ref.current && !ref.current.contains(event.target as Node)) {
            callBack();
          }
        },
        [callBack],
      );

      useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
          document.removeEventListener('click', handleClick);
        };
      }, [handleClick]);

      return ref;
    };

    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    const ref = useOutsideClick(handleClickOutside);

    useEffect(() => {
      if (appliedInputText === '') {
        setFilteredPeople(people);
        setShowSuggestions(true);
      } else {
        const filtered = people.filter(person =>
          person.name.toLowerCase().includes(appliedInputText.toLowerCase()),
        );

        setFilteredPeople(filtered);
        setShowSuggestions(filtered.length >= 0);
      }
    }, [appliedInputText, people]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(event.target.value);
      applyInputText(event.target.value);

      onInputChange(event.target.value);
    };

    const handleItemClick = (person: Person) => {
      setInputText(person.name);
      onSelected(person);
      setShowSuggestions(false);
    };

    const handleInputFocus = () => {
      setShowSuggestions(true);
    };

    return (
      <>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <form>
              <input
                ref={ref}
                id="search-input"
                type="text"
                value={inputText}
                placeholder="Enter a part of the name"
                className="input"
                name="search-input"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                data-cy="search-input"
              />
              <label htmlFor="search-input" className={inputText && 'filled'}>
                Enter a part of the name
              </label>
            </form>
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {showSuggestions && (
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    key={person.name}
                    className="dropdown-item"
                    onClick={() => handleItemClick(person)}
                    data-cy="suggestion-item"
                  >
                    <p
                      className={
                        !inputText ||
                        person.name
                          .toLowerCase()
                          .includes(inputText.toLowerCase())
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {!filteredPeople.length && (
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
      </>
    );
  },
);
