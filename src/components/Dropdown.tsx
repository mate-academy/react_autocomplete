import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

interface Props {
  people: Person[],
  query: string,
  selectedUser: Person | null,
  setQuery: (newValue: string) => void,
  setSelectedUser: (newPerson: Person) => void
  handleQueryChange: (personName: string) => void
  appliedQuery: string
  setAppliedQuery: (personName: string) => void
}

export const Dropdown: React.FC<Props> = ({
  people,
  query,
  selectedUser,
  setQuery,
  setSelectedUser,
  handleQueryChange,
  appliedQuery,
  setAppliedQuery,
}) => {
  const handleChoseUser = (person: Person) => {
    setSelectedUser(person);
    setAppliedQuery(person.name);
    setQuery(person.name);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': selectedUser?.name !== appliedQuery
        && appliedQuery === query,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
        />
      </div>

      {appliedQuery && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {people.length === 0 ? (
              <p>No matching suggestions</p>
            ) : (
              people.map(person => (
                <button
                  key={person.slug}
                  type="button"
                  className="dropdown-item hover"
                  onClick={() => handleChoseUser(person)}
                >
                  <p className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  >
                    {person.name}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
