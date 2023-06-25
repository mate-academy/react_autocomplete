import React, { useState, useMemo } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';
import { SearchField } from './components/SearchField';

const findPersonBySlug = (personSlug: string): Person | null => {
  return peopleFromServer.find(person => person.slug === personSlug) || null;
};

const getPeopleByQuery = (people: Person[], query: string): Person[] => people
  .filter(person => {
    const personName = person.name.toLowerCase();

    return personName.includes(query.toLowerCase());
  });

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonSlug, setselectedPersonSlug] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  let selectedPerson = findPersonBySlug(selectedPersonSlug) || null;

  const onChange = (value: string) => {
    setSearchQuery(value);
    if (selectedPerson
        && selectedPerson.name.toLowerCase() !== value.toLowerCase()) {
      setselectedPersonSlug('');
      selectedPerson = null;
    }
  };

  const onApplyChange = (value: string) => {
    if (value !== appliedQuery) {
      setAppliedQuery(value);
    }
  };

  const visiblePersons = useMemo(() => {
    if (appliedQuery) {
      return getPeopleByQuery(peopleFromServer, searchQuery);
    }

    return peopleFromServer;
  }, [appliedQuery]);

  const onSelected = (event: React.MouseEvent, personSlug: string): void => {
    event.preventDefault();
    setselectedPersonSlug(personSlug);
    const selected = findPersonBySlug(personSlug) || null;

    if (selected) {
      setSearchQuery(selected.name);
    }
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': searchQuery && !selectedPersonSlug,
        })}
      >
        <SearchField
          searchQuery={searchQuery}
          onChange={onChange}
          onApplyChange={onApplyChange}
          currentDelay={500}
        />

        <PeopleList
          people={visiblePersons}
          onSelected={onSelected}
        />

      </div>
    </main>
  );
};
