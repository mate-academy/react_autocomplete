import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList';

function filterPeople(people: Person[], query: string) {
  let preparedPeople = [...people];
  const clearQuery = query.trim().toLowerCase();

  if (query) {
    preparedPeople = preparedPeople.filter(
      person => {
        const clearPersonName = person.name.trim().toLowerCase();

        return clearPersonName.includes(clearQuery);
      },
    );
  }

  return preparedPeople;
}

type Props = {
  delay: number;
};

export const App: React.FC<Props> = ({ delay }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return filterPeople(peopleFromServer, query);
  }, [appliedQuery]);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
  };

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay), [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}

      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => {
              handleQueryChange(event);
              setAppliedQuery('');
            }}
          />
        </div>

        {appliedQuery && (
          <PeopleList
            people={filteredPeople}
            onSelected={handlePersonSelect}
          />
        )}
      </div>
    </main>
  );
};
