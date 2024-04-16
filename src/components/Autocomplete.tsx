import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';

interface IProps {
  people: Person[];
  onSelected?: (person: Person) => void;
  onInputChange?: (inputValue: string) => void;
}

export const Autocomplete: React.FC<IProps> = React.memo(
  ({ people, onSelected = () => {}, onInputChange = () => {} }) => {
    const [inputText, setInputText] = useState('');
    const [appliedInputText, setAppliedInputText] = useState('');
    const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const timerId = useRef(0);

    const useOutsideClick = (callBack: () => void) => {
      const ref = React.useRef<HTMLInputElement>(null);

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
      window.clearTimeout(timerId.current);

      timerId.current = window.setTimeout(() => {
        setAppliedInputText(event.target.value);
      }, 1000);

      onInputChange(event.target.value);
    };

    const handleItemClick = (person: Person) => {
      setInputText(person.name);
      onSelected(person);
      setShowSuggestions(false);
    };

    const handleInputFocus = () => {
      if (inputText === '') {
        setShowSuggestions(true);
      }
    };

    return (
      <>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <form>
              <label htmlFor="search-input">
                Search name:
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
                        !inputText ? 'has-text-link' : 'has-text-danger'
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
        {filteredPeople.length === 0 && (
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
