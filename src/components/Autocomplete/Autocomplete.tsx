import React, { useState, useCallback } from 'react';
import cn from 'classnames';

import { Person } from '../../types/Person';
import { debounce } from '../../helpers';
import { PeopleList } from '../PeopleList/PeopleList';

type Props = {
  peopleFromServer: Person[];
  onSelected: React.Dispatch<React.SetStateAction<string>>;
};

export const Autocomplete: React.FC<Props> = ({
  peopleFromServer,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const formattedQuery = appliedQuery.toLowerCase();

  const getVisiblePeople = () => {
    return peopleFromServer.filter(person => {
      const personName = person.name.toLowerCase();

      return personName.includes(formattedQuery);
    });
  };

  const visiblePeople = getVisiblePeople();

  return (
    <div className={cn('dropdown', { 'is-active': isMenuVisible })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            applyQuery(event.target.value);
            setIsMenuVisible(true);
          }}
        />
      </div>

      {visiblePeople.length > 0
        ? (
          <PeopleList
            people={visiblePeople}
            onSelected={onSelected}
            isVisible={setIsMenuVisible}
          />
        )
        : (
          <div
            className="message is-warning"
          >
            No matching suggestions
          </div>
        )}
    </div>
  );
};
