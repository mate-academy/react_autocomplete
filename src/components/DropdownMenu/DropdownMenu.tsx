import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

const MALE = 'm';
const FEMALE = 'f';

type Props = {
  onUserSelection: (person: Person) => void,
  delay: number,
};

export const DropdownMenu: React.FC<Props> = ({
  onUserSelection, delay,
}) => {
  const [isListVisible, setIsListVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const applyQuery = debounce(setAppliedQuery, delay);

  const handleUserSelection = useCallback((person: Person) => {
    onUserSelection(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsListVisible(false);
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
    }, [],
  );

  return (

    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsListVisible(true)}
          onBlur={() => setIsListVisible(false)}
        />
      </div>
      {isListVisible && (
        <div
          className="dropdown-menu"
          role="menu"
          id="dropdown-menu"
        >
          <div className="dropdown-content">
            {!filteredPeople.length
              ? (
                <div className="dropdown-item" style={{ cursor: 'pointer' }}>
                  <p>
                    No matching suggestions
                  </p>
                </div>
              ) : (
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    key={person.slug}
                    onMouseDown={() => handleUserSelection(person)}
                    style={{ cursor: 'pointer' }}
                    aria-hidden="true"
                  >
                    <p
                      className={classNames({
                        'has-text-link': person.sex === MALE,
                        'has-text-danger': person.sex === FEMALE,
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))
              )}
          </div>
        </div>
      )}
    </div>
  );
};
