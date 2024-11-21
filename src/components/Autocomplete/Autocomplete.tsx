import { Person } from '../../types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

type Props = {
  delay?: number;
  people: Person[];
  query: string;
  setQuery: (query: string) => void;
  setAppliedQuery: (query: string) => void;
};

export const Autocomplete: React.FC<Props> = ({
  delay = 300,
  people,
  query,
  setQuery,
  setAppliedQuery,
}) => {
  const [inputFocus, setInputFocus] = useState(false);
  const debouncedAppliedQuery = useCallback(
    debounce((newQuery: string) => {
      setAppliedQuery(newQuery);
      setInputFocus(true);
    }, delay),
    [delay],
  );
  const filterPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setInputFocus(false);
    setQuery(newQuery);
    debouncedAppliedQuery(newQuery);
  };

  const handlePerson = (name: string) => {
    setQuery(name);
    setInputFocus(false);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          onChange={filterPeople}
          className="input"
          data-cy="search-input"
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
      </div>

      {inputFocus && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {people.map(({ name, sex }) => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={name}
                onMouseDown={(
                  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                ) => {
                  event.preventDefault();
                }}
                onClick={() => handlePerson(name)}
              >
                <p
                  className={classNames('is-clickable', {
                    'has-text-link': sex === 'm',
                    'has-text-danger': sex === 'f',
                  })}
                >
                  {name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
