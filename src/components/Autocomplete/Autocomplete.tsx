import { useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import classNames from 'classnames';
import { debounce } from '../../function/debounce';

type Props = {
  persons: Person[];
  query: string;
  onSelected?: (person: Person) => void;
  onQueryChange?: (query: string) => void;
  debounceDelay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  persons,
  query,
  onSelected,
  onQueryChange,
  debounceDelay = 300,
}: Props) => {
  const [focus, setFocus] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const debouncedOnQueryChange = useMemo(
    () =>
      debounce((value: string) => {
        setAppliedQuery(value);
        onQueryChange?.(value);
      }, debounceDelay),
    [onQueryChange, debounceDelay, setAppliedQuery],
  );

  const filteredPersons = useMemo(() => {
    if (appliedQuery.trim().length === 0) {
      return persons;
    }

    return persons.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, persons]);

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
              debouncedOnQueryChange?.(event.target.value);
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
            {filteredPersons.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
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
