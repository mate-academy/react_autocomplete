import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropDownActive, setIsDropDownActive] = useState(false);
  const delay = 1000;

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    applyQuery(value);
  };

  const handleClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsDropDownActive(false);
  };

  const filteredPeople = useMemo(() => {
    setIsDropDownActive(!!appliedQuery);

    if (!appliedQuery) {
      setSelectedPerson(null);
    }

    return peopleFromServer.filter((
      { name },
    ) => name
      .toLocaleLowerCase()
      .includes(appliedQuery.toLocaleLowerCase().trim()));
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name}  (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': isDropDownActive,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                >
                  <tr
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => handleClick(person)}
                  >
                    {person.name}
                  </tr>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">No matches</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
