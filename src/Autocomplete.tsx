import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { debounce } from 'lodash';
import { Person } from './types/Person';
import { DropdownItem } from './DropdownItem';
import { peopleFromServer } from './data/people';
import { search } from './utils/functions';

type Props = {
  selectedPerson: Person | null,
  setSelectedPerson: (arg: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  setSelectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isListShown, setIsListShown] = useState(false);

  const applyDebounceQuery = useCallback(
    debounce(setDebouncedQuery, 1000),
    [],
  );

  const filteredPeople = useMemo(() => {
    return search(peopleFromServer, query);
  }, [debouncedQuery]);

  const onSelect = (person: Person) => {
    setSelectedPerson(person);
    setIsListShown(false);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    applyDebounceQuery(newQuery);
  };

  const handleResetQuery = () => {
    setQuery('');
    setDebouncedQuery('');
    setSelectedPerson(null);
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setDebouncedQuery('');
  };

  return (
    <div className={cn('dropdown', { 'is-active': isListShown })}>
      <div className="dropdown-trigger">
        <div className="control has-icons-right">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            onFocus={() => setIsListShown(true)}
          />

          {query && (
            <span className="icon is-right">
              <button
                type="button"
                className="delete"
                aria-label="close"
                onClick={handleResetQuery}
              />
            </span>
          )}
        </div>
      </div>

      {isListShown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length ? (
              filteredPeople.map(person => (
                <DropdownItem
                  person={person}
                  selectedPerson={selectedPerson}
                  key={person.slug}
                  onSelect={onSelect}
                  handlePersonClick={handlePersonClick}
                />
              ))
            ) : (
              <p className="dropdown-item">No matching suggestions</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
