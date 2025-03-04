import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

interface ListProps {
  isListEmpty: (isEmpty: boolean) => void;
  choosePerson: (pers: Person | null) => void;
}

const PeopleList: React.FC<ListProps> = React.memo(
  ({ isListEmpty, choosePerson }) => {
    const [query, setQuery] = useState('');
    const [filterQuery, setFilterQuery] = useState('');
    const [isListVisible, setIsListVisible] = useState(false);

    const list = useMemo(() => {
      const filtredList = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(filterQuery.toLowerCase()),
      );

      return filtredList;
    }, [filterQuery]);

    useEffect(() => {
      const isMatched = list.length !== 0;

      isListEmpty(!isMatched);
    }, [list, isListEmpty]);

    const applyFilter = useCallback(debounce(setFilterQuery, 300), []);

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setQuery(e.target.value.trim());
      choosePerson(null);
      applyFilter(e.target.value);
    };

    const handlePersonClick = (e: React.MouseEvent) => {
      const eventTarget = e.target as HTMLElement;
      const personName = eventTarget.innerText;

      const person = peopleFromServer.find(pers => pers.name === personName);

      if (person) {
        choosePerson(person);
        setIsListVisible(false);
      }
    };

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            onChange={handleInputChange}
            onFocus={() => setIsListVisible(true)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
          />
        </div>

        {isListVisible && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {list.map(person => {
                return (
                  <div
                    key={person.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                  >
                    <p
                      onClick={handlePersonClick}
                      data-name={person.name}
                      className="has-text-link"
                    >
                      {person.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);

PeopleList.displayName = 'PeopleList';

export default PeopleList;
