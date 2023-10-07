import React, { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  selectedPerson?: Person | null;
  onSelect?: (person: Person) => void;
};

export const AutoComplete: React.FC<Props> = ({
  people,
  selectedPerson,
  onSelect = () => { },
}) => {
  const [visibleList, setVisibleList] = useState(false);
  const [query, setQuery] = useState(selectedPerson?.name || '');
  const [applieQuery, setApplieQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setApplieQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people
      .filter(p => p.name.toLowerCase().includes(applieQuery.toLowerCase()));
  }, [applieQuery, people]);

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
              className={classNames('dropdown-item',
                { 'is-active': person.slug === selectedPerson?.slug })}
              onMouseDown={() => onSelect(person)}
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
