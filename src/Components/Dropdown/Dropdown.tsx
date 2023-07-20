import './Dropdown.scss';
import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import classNames from 'classnames';

import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

type Props = {
  delay: number,
  setSelectedPerson: (person: Person | null) => void,
};

export const Dropdown: React.FC<Props> = ({ delay, setSelectedPerson }) => {
  const [query, setQuery] = useState('');
  const [completeQuery, setCompleteQuery] = useState('');

  const normalizeQuery = useCallback((someQuery: string) => {
    return someQuery.toLowerCase().trim();
  }, []);

  const filterPeople = useCallback(
    (peopleArray: Person[], { completeQuery }: { completeQuery: string }) => {
      return peopleArray.filter(person => {
        return normalizeQuery(person.name)
          .includes(normalizeQuery(completeQuery));
      });
    }, [query]);

  const filteredPeople: Person[] = filterPeople(peopleFromServer, { completeQuery });

  const handleCompleteQuery = useCallback(
    (newQuery: string) => {
      setCompleteQuery(newQuery);
    },
    []
  );

  const debouncedHandleCompleteQuery = useCallback(debounce(handleCompleteQuery, delay), []);

  const handleQuery = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      debouncedHandleCompleteQuery(newQuery);
    },
    [debouncedHandleCompleteQuery]
  );

  const handleResetBtn = () => {
    setQuery('');
    setCompleteQuery('');
    setSelectedPerson(null);
  };

  const handlePersonClick = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setCompleteQuery('');
  }, []);

  return (
    <div className={classNames('dropdown', {
      'is-active': completeQuery
    })}>
      <div className="dropdown-trigger">
        <div className="control has-icons-right ">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            onChange={(event) => handleQuery(event.target.value)}
          />
          {query && (
            <span className="icon is-right">
              <button
                type="button"
                className="delete"
                aria-label="close"
                onClick={handleResetBtn}
              />
            </span>
          )}
        </div>
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              <div
                role="contentinfo"
                className="dropdown-item button is-light"
                key={person.slug}
                onClick={() => handlePersonClick(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          ) : (
            <div className="dropdown-item">
              <p className="has-text-link">No match found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
