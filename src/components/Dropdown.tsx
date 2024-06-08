import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
  selectedPerson: Person | null;
};

export const Dropdown: React.FC<Props> = ({
  onSelected,
  delay,
  selectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [listOfPeople, setListOfPeople] = useState(peopleFromServer);
  const [listVisibility, setListVisibility] = useState(false);

  const filteredPeopleList = useMemo(() => {
    if (!appliedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter((person: Person) =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, listOfPeople]);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setQuery(inputValue);
    setListVisibility(true);

    if (selectedPerson && inputValue !== selectedPerson.name) {
      onSelected(null);
    }

    applyQuery(inputValue);
    setListOfPeople(filteredPeopleList);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (listVisibility) {
        setListVisibility(false);
      }
    }, 300);
  };

  const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPerson && event.target.value === selectedPerson.name) {
      setListVisibility(false);
    } else {
      setListVisibility(true);
    }
  };

  return (
    <React.Fragment>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={event => {
              handleFocus(event);
            }}
            onBlur={() => {
              handleBlur();
            }}
          />
        </div>

        {listVisibility && filteredPeopleList.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeopleList.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    onSelected(person);
                    setQuery(person.name);
                    setAppliedQuery(person.name);
                    setListVisibility(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!filteredPeopleList.length && (
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
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </React.Fragment>
  );
};
