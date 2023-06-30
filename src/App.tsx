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

const getPeopleByQuery = (
  people: Person[],
  query: string,
): Person[] => (
  people.filter(person => (
    person.name.toLowerCase()
      .includes(query.toLowerCase())
  ))
);

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonSlug, setSelectedPersonSlug] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  let selectedPerson = findPersonBySlug(selectedPersonSlug) || null;

  const onChange = (value: string) => {
    setSearchQuery(value);
    const isNewSearchQuery = selectedPerson
      && selectedPerson.name.toLowerCase() !== value.toLowerCase();

    if (isNewSearchQuery) {
      setSelectedPersonSlug('');
      selectedPerson = null;
    }
  };

  const onApplyChange = (value: string) => {
    setAppliedQuery(value);
  };

  const visiblePersons = useMemo(() => {
    return appliedQuery
      ? getPeopleByQuery(peopleFromServer, searchQuery)
      : peopleFromServer;
  }, [appliedQuery]);

  const onPersonNameClick = (
    event: React.MouseEvent,
    personSlug: string,
  ): void => {
    event.preventDefault();
    setSelectedPersonSlug(personSlug);
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
          currentDelay={700}
        />

        <PeopleList
          people={visiblePersons}
          onPersonNameClick={onPersonNameClick}
        />

      </div>
    </main>
  );
};
