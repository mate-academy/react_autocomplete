import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import 'bulma';

import { useClickOutside } from './hooks';
import { peopleFromServer } from './data/people';
import { PersonList } from './PersonList/PersonList';
import { Person } from './types/Person';
import { Input } from './Input/Input';

export const App: React.FC = () => {
  const [showPeople, setShowPeople] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const ref = useRef(null);

  useClickOutside(ref, () => setShowPeople(false));

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => person.name
      .toLowerCase().includes(appliedQuery.trim().toLowerCase()));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div
        className={classNames('dropdown',
          { 'is-active': !selectedPerson })}
        ref={ref}
      >
        <Input
          appliedQuery={appliedQuery}
          handleQueryChange={handleQueryChange}
          setAppliedQuery={() => setAppliedQuery('')}
          setShowPeople={() => setShowPeople(true)}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          query={query}
          setQuery={setQuery}
        />
        <div className="dropdown-menu" role="menu">
          {showPeople && (filteredPeople.length ? (
            <div className="dropdown-content">
              <PersonList
                peoples={filteredPeople}
                onSelect={setSelectedPerson}
                selectedPersonId={selectedPerson?.slug}
              />
            </div>
          ) : (
            <div className="dropdown-content">
              No matching suggestions
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
