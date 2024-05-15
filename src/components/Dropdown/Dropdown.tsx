import { useCallback, useState } from 'react';
import { Person } from '../../types/Person';
import React from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../../data/people';

type Props = {
  onSelected: (person: Person) => void;
  delay: number;
  inputIsFocused: boolean;
  filteredList: Person[];
  appliedQuery: string;
  setAppliedQuery: (arg: string) => void;
  setSelectedPerson: (person?: Person) => void;
};

export const Dropdown: React.FC<Props> = React.memo(
  ({
    onSelected,
    delay,
    filteredList,
    setAppliedQuery,
    appliedQuery,
    setSelectedPerson,
  }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedPerson();

      setQuery(event.target.value);
      applyQuery(event.target.value);

      peopleFromServer.filter(person =>
        person.name
          .toLocaleLowerCase()
          .includes(appliedQuery.toLocaleLowerCase()),
      );
    };

    const handleSuggestionClick = (x: Person) => {
      setQuery(x.name);
      setAppliedQuery(x.name);
      onSelected(x);
      setShowSuggestions(false);
    };

    return (
      <div className="dropdown is-active is-hoverable">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowSuggestions(true)}
          />
        </div>

        {showSuggestions && filteredList.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content max-height-dropdown">
              {filteredList.map((person: Person) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handleSuggestionClick(person)}
                >
                  <p
                    className={classNames(
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger',
                    )}
                  >
                    {person.name}
                  </p>
                  <hr className="dropdown-divider" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);
