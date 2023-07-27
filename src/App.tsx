import React, {
  useMemo,
  useState,
  useCallback,
} from 'react';
import './App.scss';
import { PeopleList } from './components/PeopleLIst';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface Props {
  delay: number,
}

function debounce(callback: (...args: string[]) => void, delay: number) {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC<Props> = ({ delay }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelect = useCallback((currentPerson: Person) => {
    setSelectedPerson(currentPerson);
    setQuery('');
    setAppliedQuery('');
  }, []);

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.trim().toLowerCase()));
  }, [appliedQuery, peopleFromServer]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={query}
            onChange={handleQueryChange}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>
        {appliedQuery && (
          <PeopleList
            people={filteredPeople}
            onSelect={handleSelect}
          />
        )}
      </div>
    </main>
  );
};
