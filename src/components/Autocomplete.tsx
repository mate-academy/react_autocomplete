import React, { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person | null) => void;
  delay: number;
};

export const AutoComplete: React.FC<Props> = ({
  people,
  delay,
  onSelect = () => { },
}) => {
  const [visibleList, setVisibleList] = useState(false);
  const [query, setQuery] = useState('');
  const [applieQuery, setAppliedQuery] = useState('');

  if (query === '') {
    onSelect(null);
  }

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [setAppliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setVisibleList(true);
  };

  const filteredPeople = useMemo(() => {
    return people
      .filter(p => p.name.toLowerCase().includes(applieQuery.toLowerCase()));
  }, [applieQuery, people]);

  const handleSelect = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setVisibleList(false);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': visibleList })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setVisibleList(true)}
          onBlur={() => setVisibleList(false)}
        />
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <a
              key={person.slug}
              href="/"
              className="dropdown-item"
              onMouseDown={() => handleSelect(person)}
            >
              {person.name}
            </a>
          ))}
        </div>
        {!filteredPeople.length
          && (
            <article className="message is-danger">
              <div className="message-body">
                No matching suggestions
              </div>
            </article>
          )}
      </div>
    </div>
  );
};
