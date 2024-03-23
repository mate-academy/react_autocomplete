import { useMemo, useState } from 'react';
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
  const [isInputShown, setIsInputShown] = useState(false);

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const normalizedQuery = query.toLowerCase().trim();

      return person.name.toLowerCase().includes(normalizedQuery);
    });
  }, [people, query]);

  const applyName = useMemo(
    () => debounce(() => setIsInputShown(true), delay),
    [delay],
  );

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyName();

    setQuery(event.target.value);
    setIsInputShown(false);
    onSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isInputShown,
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
            onFocus={() => setIsInputShown(true)}
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
