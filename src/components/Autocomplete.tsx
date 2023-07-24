import { useCallback, useMemo, useState } from 'react';

import debounce from 'lodash.debounce';

import '../App.scss';

import { Person } from '../types/Person';
import { ListOfPeople } from './ListOfPeople';
import { peopleFromServer } from '../data/people';

interface Props{
  delay: number,
}

const filterPeople = (people: Person[], currentQuery: string) => {
  const query = currentQuery.toLowerCase();

  return [...people].filter((person) => {
    const name = person.name.toLowerCase();

    return name.includes(query);
  });
};

export const Autocomplete: React.FC<Props> = ({ delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelect = useCallback((currentPerson: Person) => {
    setSelectedPerson(currentPerson);
    setQuery('');
    setAppliedQuery('');
  }, []);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [delay],
  );

  const setQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => (
    filterPeople(peopleFromServer, query)
  ), [query]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (born ${selectedPerson.born} - died ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            onChange={setQueryChange}
          />
        </div>

        {query && query === appliedQuery && (
          <ListOfPeople
            people={filteredPeople}
            onSelected={handleSelect}
          />
        )}
      </div>
    </main>
  );
};
