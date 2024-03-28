import { useMemo, useState, useEffect } from 'react';
import { Person } from '../types/Person';
import { debounce } from './debounce';
import classNames from 'classnames';

interface DropdownType {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Dropdown: React.FC<DropdownType> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      return person.name.toLowerCase().includes(query.toLowerCase().trim());
    });
  }, [people, query]);

  const applyName = useMemo(
    () => debounce(() => setIsListVisible(true), delay),
    [delay],
  );

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyName();

    setQuery(event.target.value);
    setIsListVisible(false);
    onSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setIsListVisible(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const dropdownElement = document.querySelector('.dropdown');
      const isClickedOutside =
        dropdownElement && !dropdownElement.contains(event.target as Node);

      if (isClickedOutside) {
        setIsListVisible(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isListVisible,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleOnChange}
            onFocus={() => setIsListVisible(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {filteredPeople.length > 0 && (
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <button
                  key={person.slug}
                  className="dropdown-item button is-white"
                  type="button"
                  data-cy="suggestion-item"
                  onClick={() => handleSelectPerson(person)}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
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
};
