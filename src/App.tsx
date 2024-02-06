import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PersonList } from './components/PersonList';
import { Person } from './types/Person';
import { PersonContext } from './context/PersonContext';

const filterPeople = (people: Person[], name: string) => people
  .filter(person => person.name.toLocaleLowerCase()
    .includes(name.toLocaleLowerCase()));

export const App: React.FC = () => {
  const [nameFilter, setNameFilter] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [delay, setDelay] = useState(300);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!e.relatedTarget) {
      setIsOpen(false);
    }
  };

  const handlePersonSelect = (newPerson: Person) => {
    setSelectedPerson(newPerson);
    setNameFilter(newPerson.name);
    setAppliedFilter(newPerson.name);
    setIsOpen(false);
  };

  const handleAppliedFilterChange = (newValue: string) => {
    setAppliedFilter(newValue);
    setIsOpen(true);
  };

  const applyFilter
    = useCallback(debounce(handleAppliedFilterChange, delay), [delay]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(null);
    setIsOpen(false);
    setNameFilter(e.target.value);
    applyFilter(e.target.value);
  };

  const filteredPeople = useMemo(
    () => filterPeople(peopleFromServer, appliedFilter),
    [appliedFilter],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <label htmlFor="delay">Delay in ms:</label>
        <input
          type="number"
          className="app__input input is-primary"
          value={delay}
          id="delay"
          step="100"
          onChange={(e) => setDelay(+e.target.value)}
        />

        <div
          className={cn('dropdown', {
            'is-active': isOpen && filteredPeople.length > 0,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={nameFilter}
              onChange={handleFilterChange}
              onFocus={() => setIsOpen(true)}
              onBlur={handleBlur}
            />
          </div>
          <PersonContext.Provider value={handlePersonSelect}>
            <PersonList people={filteredPeople} />
          </PersonContext.Provider>
        </div>

        {filteredPeople.length === 0
          && (
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
          )}
      </main>
    </div>
  );
};
