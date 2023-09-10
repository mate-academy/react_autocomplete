import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const DELAY_PROP = 1000;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [listIsVisible, setListIsVisible] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, DELAY_PROP),
    [],
  );

  const handlSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setListIsVisible(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const preparedPeople = useMemo(() => {
    return [...peopleFromServer].filter(person => {
      return person.name
        .toLowerCase().includes(appliedQuery.toLowerCase().trim());
    });
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', {
        'is-active': listIsVisible,
      })}
      >
        <div className="dropdown-trigger">
          <input
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleQueryChange}
            onFocus={() => setListIsVisible(true)}
            onBlur={() => setListIsVisible(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {preparedPeople.length === 0
              ? (
                <div className="dropdown-item">
                  <p className="has-text-black">
                    No matching suggestions
                  </p>
                </div>
              ) : preparedPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onMouseDown={() => handlSelectedPerson(person)}
                  aria-hidden="true"
                  style={{ cursor: 'pointer' }}
                >
                  <p className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};
