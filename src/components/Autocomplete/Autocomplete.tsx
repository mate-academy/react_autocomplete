import { useCallback, useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  delay?: number;
  onSelect?: (person: Person | null) => void;
};

export const Autocomplete = ({
  people,
  delay = 300,
  onSelect = () => {},
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  const [displayedQuery, setDisplayedQuery] = useState('');
  const [query, setQuery] = useState('');

  const setQueryDebounced = useCallback(debounce(setQuery, delay), []);

  const suggestions = useMemo(() => {
    const trimmedQuery = query.trim().replace(/ +/g, ' ');

    if (trimmedQuery === '') {
      return people;
    }

    return people.filter(({ name }) => name.includes(trimmedQuery));
  }, [people, query]);

  const hasNoSuggestions = suggestions.length === 0;

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setDisplayedQuery(newQuery);
    setQueryDebounced(newQuery);
    onSelect(null);
    setIsFocused(true);
  };

  const handlePersonSelect = (person: Person) => {
    setIsFocused(false);

    setDisplayedQuery(person.name);
    setQueryDebounced(person.name);

    onSelect(person);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={displayedQuery}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {hasNoSuggestions ? (
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
          ) : (
            <>
              {suggestions.map(person => (
                <div
                  key={person.slug}
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => handlePersonSelect(person)}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <p
                    className={classNames('', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
