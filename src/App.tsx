import './App.scss';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showList, setShowList] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(value => {
    setAppliedQuery(value);
    setShowList(true);
  }, 1000), []);

  const filteredPeople = useMemo(() => peopleFromServer.filter(
    person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  ), [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowList(false);

    if (appliedQuery.length === 0) {
      setSelectedPerson(null);
    }

    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const onSelected = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            className="input"
            type="text"
            placeholder="Enter a part of the name"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowList(true)}
            onBlur={() => setShowList(false)}
          />
        </div>

        {showList && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length
                ? (
                  filteredPeople.map(person => (
                    <div className="dropdown-item-container" key={person.name}>
                      <a
                        href={`#${person.name}`}
                        className={classNames(
                          'dropdown-item',
                          { 'is-active': selectedPerson?.name === person.name },
                        )}
                        onMouseDown={() => onSelected(person)}
                      >
                        {person.name}
                      </a>
                    </div>
                  ))
                )
                : (
                  <div className="dropdown-item-container">
                    <p className="dropdown-item">No matching suggestions</p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
