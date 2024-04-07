import React from 'react';
import { Person } from '../types/Person';

type Props = {
  searchPeople: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUsePeople: () => void;
  usePeople: boolean;
  peopleFilter: Person[];
  handleClickUser: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = ({
  searchPeople,
  handleSearchChange,
  handleUsePeople,
  usePeople,
  peopleFilter,
  handleClickUser,
}) => {
  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={searchPeople}
          onChange={handleSearchChange}
          onFocus={handleUsePeople}
        />
      </div>

      {usePeople && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {peopleFilter.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => {
                  handleClickUser(person);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
            {peopleFilter.length === 0 && (
              <div className="dropdown-item" data-cy="suggestion-item">
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
