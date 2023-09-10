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
  const [activeIndex, setActiveIndex] = useState(-1);

  const applyPerson = useCallback(
    debounce(setAppliedPerson, 1000),
    [],
  );

  const handlePersonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerson(event.target.value);
    applyPerson(event.target.value);
  };

  const filteredPerson = useMemo(() => {
    return peopleFromServer.filter((pers) => pers.name.toLowerCase()
      .includes(appliedPerson.toLowerCase()));
  }, [appliedPerson]);

  const handleSelectedPerson = useCallback(
    (pers: Person, index: number) => {
      setSelectedPerson(pers);
      setPerson(pers.name);
      setAppliedPerson(pers.name);
      setFocus(false);
      setActiveIndex(index);
    },
    [],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (filteredPerson.length > 0 && activeIndex >= 0) {
        handleSelectedPerson(filteredPerson[activeIndex], activeIndex);
      }
    } else if (e.key === 'ArrowDown') {
      if (activeIndex < filteredPerson.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
  };

  return (
    <main className="section">
      <h1 className="title">
        {!selectedPerson ? (
          'No selected person'
        ) : (
          `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        )}
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
            onKeyDown={handleKeyDown}
          />
        </div>

        {focus && (
          <div className="dropdown-menu" role="menu">
            {filteredPerson.length === 0 ? (
              <p>No matching suggestions</p>
            ) : (
              <div className="dropdown-content">
                {filteredPerson.map((pers, index) => (
                  <a
                    key={pers.slug}
                    className={classNames('dropdown-item', {
                      'has-text-danger': pers.sex === 'f',
                      'is-active': index === activeIndex,
                    })}
                    href={`${pers.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectedPerson(pers, index);
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
