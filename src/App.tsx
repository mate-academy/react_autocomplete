import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 500), []);

  const filteredPeople = useMemo(
    () => peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    ), [appliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleItemClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  return (
    <main className="section">
      {selectedPerson
        ? (
          <h1 className="title">
            {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
          </h1>
        )
        : (
          <h1 className="title">No selected person</h1>
        )}

      <br />

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowDropDownMenu(true)}
            onBlur={() => setShowDropDownMenu(false)}
          />
        </div>

        {showDropDownMenu && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length
                ? filteredPeople.map(person => (
                  <div className="dropdown-item" key={person.slug}>
                    <a
                      href={`#${person.slug}`}
                      onMouseDown={() => handleItemClick(person)}
                      className={classNames(
                        { 'has-text-link': person.sex === 'm' },
                        { 'has-text-danger': person.sex === 'f' },
                      )}
                    >
                      {person.name}
                    </a>
                  </div>
                ))
                : (
                  <div className="dropdown-item">
                    <p>
                      No matching suggestions
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">

            {suggestions.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
                onClick={() => handleItemClick(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}

          </div>
        </div> */}
      </div>
    </main>
  );
};
