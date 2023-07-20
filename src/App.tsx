import React, { useMemo, useState } from 'react';
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

export const App: React.FC = () => {
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

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}

      </h1>

      {appliedQuery && (
        <PeopleList
          people={filteredPeople}
          onSelected={handlePersonSelect}
          query={query}
          setQuery={setQuery}
          setAppliedQuery={setAppliedQuery}
          delay={1000}
        />
      )}
    </main>
  );
};
