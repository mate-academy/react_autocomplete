import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { debounce } from '../service/debounce';
import { Person, Sex } from '../types/Person';

interface Props {
  peoples: Person[];
  onSelected: React.Dispatch<SetStateAction<Person | null>>;
  delay?: number;
}

export const Dropdown: React.FC<Props> = ({
  peoples,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [focusDropdown, setFocusDropdown] = useState(false);

  const filteredPeople = useMemo(() => {
    return peoples.filter(person => {
      return person.name.toLowerCase().includes(query.trim().toLowerCase());
    });
  }, [peoples, query]);

  const delayName = useMemo(
    () => debounce(() => setFocusDropdown(true), delay),
    [delay],
  );

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    delayName();
    setQuery(event.target.value);
    setFocusDropdown(false);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    onSelected(person);
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
    <section>
      <div
        className={classNames('dropdown', {
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
          {filteredPeople.length && (
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <button
                  key={person.slug}
                  className="dropdown-item button is-white"
                  type="button"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === Sex.Male,
                      'has-text-danger': person.sex === Sex.Female,
                    })}
                  >
                    {person.name}
                  </p>
                </button>
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
    </section>
  );
};
