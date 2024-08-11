import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import './App.scss';
import { getVisiblePeople } from './utils/getVisiblePeople';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownList } from './components/DropdownList';
import { Header } from './components/Header';
import { SearchInput } from './components/SearchInput';
import { Notification } from './components/Notification';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputFocus, setInputFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const visiblePeople = useMemo(
    () => getVisiblePeople(peopleFromServer, appliedQuery),
    [appliedQuery],
  );

  function handleOnInputFocus() {
    setInputFocus(true);
  }

  function handleOnItemClick(person: Person) {
    setSelectedPerson(person);
    setQuery(person.name);
    setInputFocus(false);
  }

  function handleOnInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedPerson(null);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <Header person={selectedPerson} />

        <div
          className={cn('dropdown', {
            'is-active': inputFocus && visiblePeople.length,
          })}
        >
          <SearchInput
            query={query}
            onInputFocus={handleOnInputFocus}
            onInputChange={handleOnInputChange}
          />

          <DropdownList
            people={visiblePeople}
            selectPerson={handleOnItemClick}
          />
        </div>

        {!visiblePeople.length && <Notification />}
      </main>
    </div>
  );
};
