import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDownComponent } from './components/DropDownComponent';
import { Person } from './types/Person';

type Props = {
  delay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setAppliedQuery(query);
    }, delay);

    return () => clearTimeout(timerId);
  }, [query, delay]);

  const suggestions = useMemo(() => {
    const normalized = appliedQuery.trim().toLowerCase();

    if (!normalized) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(normalized),
    );
  }, [appliedQuery]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setIsMenuOpen(true);

    if (selectedPerson && newQuery !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  };

  const handleSelect = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      setIsMenuOpen(false);

      if (onSelected) {
        onSelected(person);
      }
    },
    [onSelected],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <DropDownComponent
          query={query}
          onQueryChange={handleQueryChange}
          suggestions={suggestions}
          onSelect={handleSelect}
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
        />
      </main>
    </div>
  );
};
