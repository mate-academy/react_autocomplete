import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

type Props = {
  delay: number,
};

export const App: React.FC<Props> = ({ delay = 1000 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (event.target.value === '') {
      setIsVisible(true);
    }
  };

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsVisible(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase().includes(
      appliedQuery.toLowerCase(),
    ));
  }, [appliedQuery]);

  const personField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (personField.current) {
      personField.current.focus();
    }
  }, [selectedPerson]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            ref={personField}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <PeopleList
          people={filteredPeople}
          onSelect={handleSelectedPerson}
          isVisible={isVisible}
        />
      </div>
    </main>
  );
};
