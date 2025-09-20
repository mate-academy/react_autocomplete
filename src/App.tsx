import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import { Input } from './components/Input/Input';
import { PersonList } from './components/List/PersonList';
import { SelectedPerson } from './components/SelectedPerson/SelectedPerson';

interface Props {
  delay?: number;
}

export const App: React.FC<Props> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | string>('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson('');
    setQuery(e.target.value.trimStart());
    applyQuery(e.target.value.trimStart());
  };

  const handleInputClick = useCallback(
    debounce(() => setPeople(peopleFromServer), delay),
    [],
  );

  const handlePersonSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setSelectedPerson(person);
    setPeople([]);
  };

  const filteredPeople = useMemo(
    () =>
      people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      ),
    [people, appliedQuery],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <SelectedPerson selectedPerson={selectedPerson} />
        <div className="dropdown is-active">
          <Input
            query={query}
            onFocus={handleInputClick}
            onChange={handleQueryChange}
            setPeople={setPeople}
          />

          <PersonList
            filteredPeople={filteredPeople}
            onSelected={handlePersonSelect}
          />
        </div>
        {people.length !== 0 && filteredPeople.length === 0 && query && (
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
