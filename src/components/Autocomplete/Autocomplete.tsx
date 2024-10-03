import { useState } from 'react';
import { peopleFromServer } from '../../data/people';

// type AutocompleteProps = {
// };

export const Autocomplete = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearchInputFocus, setIsSearchInputFocus] = useState(false);

  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(searchInput.toLowerCase()),
  );

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={searchInput}
            onChange={event => {
              setSearchInput(event?.target.value);
            }}
            onFocus={() => {
              setIsSearchInputFocus(true);
            }}
            onBlur={() => setIsSearchInputFocus(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {isSearchInputFocus && (
            <div className="dropdown-content">
              {filteredPeople.map(person => {
                return (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                  >
                    <p
                      className={`${person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}
                    >
                      {person.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
    </>
  );
};
