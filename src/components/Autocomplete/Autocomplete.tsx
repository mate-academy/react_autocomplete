import { useState } from 'react';
import { Person } from '../../types/Person';
import classNames from 'classnames';

type Props = {
  persons: Person[];
  query: string;
  onSelected?: (person: Person) => void;
  onQueryChange?: (query: string) => void;
};

export const Autocomplete: React.FC<Props> = ({
  persons,
  query,
  onSelected,
  onQueryChange,
}: Props) => {
  const [focus, setFocus] = useState(false);

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': focus,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => {
              onQueryChange?.(event.target.value);
            }}
            onClick={() => setFocus(true)}
            onFocus={() => setFocus(true)}
          />
        </div>
        <div
          className="dropdown-menu"
          id="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
        >
          <div className="dropdown-content">
            {persons.map(person => (
              <div
                className="dropdown-item"
                key={person.name}
                onClick={() => {
                  onSelected?.(person);
                  setFocus(false);
                }}
              >
                <p className="has-text-link" data-cy="suggestion-item">
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
