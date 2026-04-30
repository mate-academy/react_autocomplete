import { useCallback, useRef, useState } from 'react';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
  delay?: number;
  query: string;
  onQueryChange: (value: string) => void;
};
export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay,
  query,
  onQueryChange,
}) => {
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const lastAppliedQuery = useRef('');

  const isAppliedQuery = (value: string) => {
    if (lastAppliedQuery.current === value) {
      return;
    }

    lastAppliedQuery.current = value;
    setAppliedQuery(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(isAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
    applyQuery(event.target.value);
  };

  const normalizedQuery = appliedQuery.trim().toLowerCase();

  const filteredPeople = appliedQuery
    ? people.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery))
    : people;

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isOpen,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={e => {
            handleQueryChange(e);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => {
                onSelected(person);
                setIsOpen(false);
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>

      {isOpen && appliedQuery && filteredPeople.length === 0 && (
        <div
          className="
        notification
        is-danger
        is-light
        mt-3
        is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
