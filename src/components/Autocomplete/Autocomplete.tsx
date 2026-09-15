import { useCallback, useState } from 'react';
import { Person } from '../../types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
  queryChangeHandler?: (query: string) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
  queryChangeHandler = () => {},
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const handlePersonClick = (person: Person | null) => {
    onSelected(person);
    setQuery(person ? person.name : '');
    setIsFocused(false);
  };

  const debouncedQueryChangeHandler = useCallback(
    debounce((value: string) => {
      if (value.trim() !== '') {
        queryChangeHandler(value);
      } else {
        queryChangeHandler(''); // Call with empty string to reset the list when input is cleared
      }
    }, delay),
    [delay, queryChangeHandler],
  );

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            onSelected(null); // Clear the selected person when the query changes
            debouncedQueryChangeHandler(e.target.value);
          }}
          data-cy="search-input"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 0);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              className="dropdown-item"
              key={person.slug}
              data-cy="suggestion-item"
              onMouseDown={() => handlePersonClick(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
