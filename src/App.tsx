import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';

import { DropdownList } from './components/DropdownList';
import { InputField } from './components/InputField';

import { Person } from './types/Person';

import './App.scss';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const filteredPeoples = useMemo(() => {
    const filtered = peopleFromServer.filter(person => {
      const { name } = person;

      return name.toLowerCase().includes(query.toLowerCase());
    });

    if (filtered.length === 0) {
      return null;
    }

    return filtered;
  }, [query]);

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery('');
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            `Person ${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No selected person')}
      </h1>

      <div className={classNames(
        'dropdown',
        { 'is-active': query },
      )}
      >
        <div className="dropdown-trigger">
          <InputField
            onQuery={(inputValue) => setQuery(inputValue)}
            delay={1000}
            selectedPerson={selectedPerson}
          />
        </div>
        <DropdownList
          peoples={filteredPeoples}
          onSelect={(person: Person) => selectPerson(person)}
        />
      </div>
    </main>
  );
};
