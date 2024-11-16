import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';
import Notification from './Notification';

import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  onSelect: (person: Person | null) => void;
};

const Dropdown: React.FC<Props> = ({ people, onSelect }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focused, setFocused] = React.useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const nameField = useRef<HTMLInputElement>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    if (query !== '') {
      onSelect(null);
    }
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleSelectPerson = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
    setFocused(false);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': focused && filteredPeople.length > 0,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            ref={nameField}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => handleSelectPerson(person)}
              >
                <p className="dropdown-text has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {filteredPeople.length === 0 && <Notification />}
    </>
  );
};

export default Dropdown;
