import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  onSelected: (person: Person | null) => void
  delay?: number
};

export const SearchField: React.FC<Props> = ({
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const handleSelect = (selectPerson: Person) => {
    onSelected(selectPerson);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLocaleLowerCase().includes(appliedQuery)
    ));
  }, [appliedQuery]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          value={query}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleQueryChange}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
      </div>
      {isFocus && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map((person) => (
              <div className="dropdown-item">
                <a
                  key={peopleFromServer.indexOf(person)}
                  href="/"
                  className="has-text-link"
                  onMouseDown={() => handleSelect(person)}
                >
                  {person.name}
                </a>
              </div>
            ))}
            {filteredPeople.length === 0 && (
              <p className="dropdown-item">No matching suggestions</p>
            )}
          </div>
        </div>

      )}
    </div>
  );
};
