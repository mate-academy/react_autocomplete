import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './Autocomplete.scss';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  delay: number;
  people: Person[];
  onSelected: (person: Person | null) => void;
};

function Autocomplete({ delay = 300, people, onSelected }: Props) {
  const [filteredPeople, setFilteredPeople] = useState(people);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }

    timeOutRef.current = setTimeout(() => {
      setQuery(value.trim());
    }, delay);
    setInputValue(value);
    onSelected(null);
  };

  useEffect(() => {
    if (query.length > 0) {
      const filteredArray = people.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );

      setFilteredPeople(filteredArray);
    } else {
      setFilteredPeople(people);
    }
  }, [query, people]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isFocused,
      })}
    >
      <div className="dropdown-trigger">
        <input
          value={inputValue}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={handleQueryChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => {
                  setInputValue(person.name);
                  onSelected(person);
                  setIsFocused(false);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Autocomplete;
