import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { debounce } from '../service/debounce';
import cn from 'classnames';

type Props = {
  people: Person[];
  onPersonSelect?: (person: Person | null) => void;
  delay?: number;
};

const onDefault = () => {};

export const Autocomplete: React.FC<Props> = ({
  people,
  onPersonSelect = onDefault,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [focusDropdown, setFocusDropdown] = useState(false);

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      return person.name.toLowerCase().includes(query.trim().toLowerCase());
    });
  }, [people, query]);

  const delayName = useMemo(
    () => debounce(() => setFocusDropdown(true), delay),
    [delay],
  );

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    delayName();
    setQuery(event.target.value);
    setFocusDropdown(false);
    onPersonSelect(null);
  };

  const handleSelect = (person: Person) => {
    onPersonSelect(person);
    setQuery(person.name);
    setFocusDropdown(false);
  };

  useEffect(() => {
    const handleOutClick = (event: MouseEvent) => {
      const dropdownElem = document.querySelector('.dropdown');
      // eslint-disable-next-line operator-linebreak
      const isClickOut =
        dropdownElem && !dropdownElem.contains(event.target as Node);

      if (isClickOut) {
        setFocusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutClick);

    return () => {
      document.removeEventListener('mousedown', handleOutClick);
    };
  }, []);

  return (
    <div
      className={cn('dropdown', {
        'is-active': focusDropdown,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={() => setFocusDropdown(cur => !cur)}
          onChange={handleOnChange}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
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
          {filteredPeople.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
              onClick={() => handleSelect(person)}
            >
              {person.sex === 'f' ? (
                <p className="has-text-link">{person.name}</p>
              ) : (
                <p className="has-text-danger">{person.name}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
