import React, { useState, useRef } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from './types/Person';

interface AutocompleteProps {
  onChange: (str: string) => void;
  people: Person[];
  debounceDelay: number;
  onSelected: (person: Person) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  onChange,
  people,
  debounceDelay,
  onSelected,
}) => {
  const [sortedArray, setSortedArray] = useState(people);
  const [isInputActive, setIsInputActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);


  const debouncedFilter = useRef(
    debounce((value: string) => {
      setSortedArray(
        people.filter(person =>
          person.name.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }, debounceDelay),
  );

  React.useEffect(() => {
    debouncedFilter.current = debounce((value: string) => {
      setSortedArray(
        people.filter(person =>
          person.name.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }, debounceDelay);

    return () => {
      debouncedFilter.current.cancel();
    };
  }, [people, debounceDelay]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onChange(event.target.value);
    debouncedFilter.current(event.target.value);
  };

  const handleSelect = (person: Person) => {
    onSelected(person);
    setInputValue(person.name);
    inputRef.current?.blur();
    setIsInputActive(false);
    setSortedArray(people);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          value={inputValue}
          onFocus={() => {
            if (blurTimeout.current) {
              clearTimeout(blurTimeout.current);
              blurTimeout.current = null;
            }

            setIsInputActive(true);
          }}
          ref={inputRef}
          onBlur={() => {setIsInputActive(false)}}
          onChange={handleInputChange}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {sortedArray.length !== 0 && isInputActive && (
          <div className="dropdown-content" style={{ background: 'white' }}>
            {sortedArray.map(person => (
              <div
                key={person.name}
                className={classNames(
                  'dropdown-item',
                  'has-text-weight-bold',
                  'has-text-link',
                  'is-clickable',
                  { 'is-hovered': hoveredName === person.name },
                )}
                style={{
                  background: hoveredName === person.name ? '#f0f4ff' : 'white',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={() => setHoveredName(person.name)}
                onMouseLeave={() => setHoveredName(null)}
                onMouseDown={e => {
                  e.preventDefault();
                }}
                onClick={() => handleSelect(person)}
                data-cy="suggestion"
              >
                {person.name}
              </div>
            ))}
          </div>
        )}
        {sortedArray.length === 0 && (
          <div
            className="
            dropdown-content
            notification 
            is-danger 
            is-light 
            is-rounded 
            mt-3 
            is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};
