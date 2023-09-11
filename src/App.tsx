import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import '@fortawesome/fontawesome-free/css/all.css';
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
  const [count, setCount] = useState(1);

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

  const handleButton = () => {
    setFocus(true);
    setCount(count + 1);
    if (count % 2 === 0) {
      setFocus(false);
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
          <div className="field">
            <p className="control is-expanded has-icons-right">
              <input
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                value={person}
                onKeyDown={handleKeyDown}
                onChange={handlePersonChange}
                onFocus={() => setTimeout(() => setFocus(true), 300)}
                onBlur={() => setTimeout(() => setFocus(false), 300)}
              />

              <span
                className="icon is-small is-right"
                onClick={handleButton}
                onKeyUp={() => {}}// лінтер без події на клаву не пустив чому?
                aria-hidden="true"
              >
                <i
                  className={
                    classNames('fas fa-angle-down is-clickable', {
                      'fas fa-angle-up is-clickable': focus,
                    })
                  }
                />
              </span>
            </p>
          </div>
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
