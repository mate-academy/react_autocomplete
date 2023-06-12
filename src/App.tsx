import React, {
  useCallback,
  useEffect,
  useMemo, useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDownList } from './components/DropDownList';

const debounce = (f: (value: string) => void, delay: number) => {
  let timerId: NodeJS.Timeout;

  return (args: string) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, args);
  };
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [isListOpen, setIsListOpen] = useState<boolean>(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsListOpen(false);
  };

  useEffect(() => {
    setIsListOpen(true);
  }, [appliedQuery]);

  const suggestedPeople = useMemo(() => {
    if (appliedQuery) {
      const lowQuery = appliedQuery.toLowerCase();

      return peopleFromServer.filter(
        person => person.name.toLowerCase().includes(lowQuery),
      );
    }

    return [];
  }, [appliedQuery]);

  const handlePersonSelection = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      setIsListOpen(false);
    },
    [],
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name}
          (${selectedPerson.born} -
          ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleInputChange}
          />
        </div>

        {(appliedQuery && isListOpen) && (
          <DropDownList
            suggestedPeople={suggestedPeople}
            onSelected={handlePersonSelection}
          />
        )}
      </div>
    </main>
  );
};
