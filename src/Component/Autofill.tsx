import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

interface AutocompleteProps {
  people: Person[];
  onSelected?: (pesron: Person | null) => void;
  delay: number;
}

export const Autocomplete = ({
  people,
  onSelected = () => {},
  delay,
}: AutocompleteProps) => {
  const [query, setQuery] = useState('');

  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const debouncedFilter = useMemo(
      () =>
        debounce((searchText: string) => {
          setFilteredPeople(
            people.filter((person) =>
              person.name.toLowerCase().includes(searchText.toLowerCase())
            )
          );
        }, delay),
      [people, delay]
    );
  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;

    setQuery(text);
    debouncedFilter(text);
    onSelected(null);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleInputChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(user => {
              return (
                <div
                  style={{ cursor: 'pointer' }}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    onSelected(user);
                    setQuery(user.name);
                  }}
                  key={user.name}
                >
                  <p
                    className={classNames(
                      `has-text-${user.sex === 'm' ? 'link' : 'danger'}`,
                    )}
                  >
                    {user.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {filteredPeople.length === 0 && query !== '' && (
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
