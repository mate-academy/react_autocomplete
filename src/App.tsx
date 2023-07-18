import React, {
  useState, useCallback, useMemo,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showList, setShowList] = useState(false);

  const handlePersonChange = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setShowList(false);
  };

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    if (!applyQuery) {
      setSelectedPerson(null);
      setShowList(false);
    }

    return peopleFromServer.filter(person => person.name.toLowerCase().trim()
      .includes(appliedQuery.toLowerCase().trim()));
  }, [appliedQuery, peopleFromServer]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})` : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', { 'is-active': showList })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onBlur={() => setShowList(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">

            {filteredPeople.length ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                >
                  <button
                    type="button"
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => handlePersonChange(person)}
                  >
                    {person.name}
                  </button>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">
                  No matching suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
