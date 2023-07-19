import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList/PeopleList';

type FilterPeople = (
  people: Person[],
  { query }: { query: string },
) => Person[];

const filterPeople: FilterPeople = (people, { query }) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (query) {
    return people.filter(
      person => person.name.toLowerCase().includes(normalizedQuery),
    );
  }

  return people;
};

type Props = {
  delay: number,
};

export const App: React.FC<Props> = ({ delay }) => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const inputFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [selectedPerson]);

  const titleText = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
    : 'No selected person';

  const filteredPeople = useMemo(
    () => filterPeople(peopleFromServer, { query: appliedQuery }),
    [appliedQuery, peopleFromServer],
  );

  const selectPerson = useCallback(person => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
  }, []);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {titleText}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            ref={inputFieldRef}
            value={query}
            onChange={handleQueryChange}
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        {appliedQuery !== '' && (
          <PeopleList
            people={filteredPeople}
            onSelect={selectPerson}
          />
        )}
      </div>
    </main>
  );
};
