/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prettier/prettier */
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
    const filtered =
      appliedQuery.trim().length === 0
        ? persons
        : persons.filter(person =>
            person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
          );

    return filtered.map((person, index) => ({
      ...person,
      id: index + 1,
    }));
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
                key={person.id}
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
      {filteredPersons.length === 0 && appliedQuery.trim().length > 0 && (
        <div className="notification is-danger is-light mt-3" role="alert">
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
