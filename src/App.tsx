import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState('');
  const [appliedPerson, setAppliedPerson] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [focus, setFocus] = useState(false);

  const aplyPerson = useCallback(
    debounce(setAppliedPerson, 1000),
    [],
  );

  const handlePersonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerson(event.target.value);
    aplyPerson(event.target.value);
  };

  const filteredPerson = useMemo(() => {
    return peopleFromServer.filter(pers => pers.name.toLowerCase()
      .includes(appliedPerson.toLowerCase()));
  }, [person, appliedPerson]);

  const handleSelectedPerson = useCallback((pers: Person) => {
    setSelectedPerson(pers);
    setPerson(pers.name);
    setAppliedPerson(pers.name);
    setFocus(false);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {!selectedPerson ? (
          'No selected person'
        ) : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})` }
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={person}
            onChange={handlePersonChange}
            onFocus={() => setTimeout(() => setFocus(true), 300)}
            onBlur={() => setTimeout(() => setFocus(false), 300)}
          />
        </div>

        {focus && (
          <div className="dropdown-menu" role="menu">
            {filteredPerson.length === 0
              ? (
                <p>No matching suggestions</p>
              )
              : (
                <div className="dropdown-content">
                  {filteredPerson.map(pers => (
                    <a
                      key={pers.slug}
                      className={classNames('dropdown-item', {
                        'has-text-link': pers.sex === 'm',
                        'has-text-danger': pers.sex === 'f',
                      })}
                      href={`${pers.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectedPerson(pers);
                      }}
                    >
                      {pers.name}
                    </a>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </main>
  );
};
