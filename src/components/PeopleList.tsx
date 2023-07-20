import React, { useCallback } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelected: (person: Person) => void,
  query: string,
  setQuery: (value: string) => void,
  setAppliedQuery: (value: string) => void,
  delay: number,
};

const onSelect = (
  event: React.MouseEvent<HTMLAnchorElement>,
  person: Person,
  onSelected: (person: Person) => void,
) => {
  event.preventDefault();
  onSelected(person);
};

export const PeopleList: React.FC<Props> = ({
  people,
  onSelected,
  query,
  setQuery,
  setAppliedQuery,
  delay,
}) => {
  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay), [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(event) => {
            handleQueryChange(event);
            setAppliedQuery('');
          }}
        />
      </div>
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {people.length !== 0
            ? people.map(person => (
              <a
                href="/#"
                className="dropdown-item"
                onClick={event => onSelect(event, person, onSelected)}
              >
                <p
                  className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </a>
            ))
            : (
              <div className="dropdown-item">
                <p className="has-text-danger">No match suggestions</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
