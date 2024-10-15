import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
  selectedPerson: Person | null;
};

const useDebouncedEffect = (
  callback: (value: string) => void,
  delay: number,
) => {
  const debouncedCallback = useMemo(
    () => debounce(callback, delay),
    [callback, delay],
  );

  useEffect(() => {
    return () => debouncedCallback.cancel();
  }, [debouncedCallback]);

  return debouncedCallback;
};

export const Dropdown: React.FC<Props> = ({
  onSelected,
  delay,
  selectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [listVisibility, setListVisibility] = useState(false);

  const filteredPeople = useMemo(() => {
    if (!appliedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const applyQuery = useDebouncedEffect(setAppliedQuery, delay);

  const handleBlur = () => {
    setTimeout(() => setListVisibility(false), 300);
  };

  const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPerson && event.target.value === selectedPerson.name) {
      setListVisibility(false);
    } else {
      setListVisibility(true);
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setQuery(inputValue);
    setListVisibility(true);

    if (selectedPerson && inputValue !== selectedPerson.name) {
      onSelected(null);
    }

    applyQuery(inputValue);
  };

  const handlePerson = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setListVisibility(false);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {listVisibility && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  style={{ cursor: 'pointer' }}
                  key={person.slug}
                  onClick={() => handlePerson(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="
                  notification
                  is-danger
                  is-light
                  mt-3
                  is-align-self-flex-start
                "
                role="alert"
                data-cy="no-suggestions-message"
                style={{ cursor: 'default' }}
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
