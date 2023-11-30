import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const debounceDelay = 500;

  const applyQuery = useCallback(
    debounce(setAppliedQuery, debounceDelay),
    [query],
  );

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const people = useMemo(() => {
    return (peopleFromServer.filter((person) => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    }));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', {
        'is-active': isInputFocused,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder={selectedPerson ? selectedPerson.name
              : 'Enter a part of the name'}
            className="input"
            value={query}
            onChange={inputChangeHandler}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => {
              setIsInputFocused(false);
              if (selectedPerson) {
                setQuery(selectedPerson.name);
              }
            }}
          />
        </div>

        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <PeopleList
            people={people}
            setSelectedPerson={setSelectedPerson}
            selectedPerson={selectedPerson}
          />
        </div>
      </div>
    </main>
  );
};
