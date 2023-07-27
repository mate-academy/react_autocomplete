/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */

import './Dropdown.scss';
import React, { useCallback, useMemo, useState } from 'react';
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
  const [focuse, setFocuse] = useState(false);
  const [placeholder, setPlaceholder] = useState('Enter a part of the name');

  const normalizeQuery = useMemo(() => {
    return (someQuery: string) => someQuery.toLowerCase().trim();
  }, []);

  const filterPeople = useCallback(
    (peopleArray: Person[], complQuery: string) => {
      return peopleArray.filter(person => {
        return normalizeQuery(person.name)
          .includes(normalizeQuery(complQuery));
      });
    }, [query],
  );
  // eslint-disable-next-line
  const filteredPeople: Person[] = useMemo(()=>{
    return filterPeople(peopleFromServer, completeQuery);
  }, [completeQuery]);

  const handleCompleteQuery = useCallback(
    (newQuery: string) => {
      setCompleteQuery(newQuery);
    },
    [],
  );
  // eslint-disable-next-line
  const debouncedHandleCompleteQuery = useCallback(debounce(handleCompleteQuery, delay), [delay]);

  const handleQuery = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      debouncedHandleCompleteQuery(newQuery);
    },
    [debouncedHandleCompleteQuery],
  );

  const handleInputFocus = () => {
    setFocuse(true);
    setPlaceholder('');
  };

  const handleBlur = () => {
    setFocuse(false);
    setPlaceholder('Enter a part of the name');
  };

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
      'is-active':
        (completeQuery && (completeQuery === query))
        || (focuse && !query),
    })}
    >
      <div className="dropdown-trigger">
        <div className="control has-icons-right ">
          <input
            onFocus={handleInputFocus}
            onBlur={handleBlur}
            type="text"
            value={query}
            placeholder={placeholder}
            className="input"
            onChange={(event) => handleQuery(event.target.value)}
          />
          {(query || focuse) && (
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
          {(focuse && !query) && (
            peopleFromServer.map(person => (
              <div
                role="contentinfo"
                className="dropdown-item button is-light"
                key={person.slug}
                onClick={() => handlePersonClick(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          )}
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
