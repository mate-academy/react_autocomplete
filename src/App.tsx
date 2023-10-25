import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Input } from './components/Input/Input';
import { Dropdown } from './components/Dropdown/Dropdown';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocusedInput, setIsFocusedInput] = useState(false);
  const ref = useRef(true);

  const aplyQuery = useMemo(
    () => debounce(setAppliedQuery, 1000),
    [setAppliedQuery],
  );

  const handleQueryChange = ((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setIsFocusedInput(false);

    aplyQuery(event.target.value);

    if (event.target.value === appliedQuery) {
      aplyQuery.cancel();
      setIsFocusedInput(true);
    }

    setQuery(event.target.value);
  });

  const filteredPeople: Person[] = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()));
  }, [appliedQuery]);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsFocusedInput(false);
    setAppliedQuery(person.name);
  };

  useEffect(() => {
    if (!ref.current) {
      setIsFocusedInput(true);
    }

    if (ref) {
      ref.current = false;
    }
  }, [appliedQuery, ref]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn(
        'dropdown',
        { 'is-active': isFocusedInput },
      )}
      >
        <Input
          value={query}
          type="text"
          placeholder="Enter a part of the name"
          onChangeValue={handleQueryChange}
          focusChanger={setIsFocusedInput}
        />
        <Dropdown
          filteredPeople={filteredPeople}
          handlePersonSelect={handlePersonSelect}
        />
      </div>
    </main>
  );
};
