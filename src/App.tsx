import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownList } from './components/DropdownList/DropdownList';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

function getSuggestedPeople(people: Person[], query: string) {
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    return people.filter(person => person.name.includes(trimmedQuery));
  }

  return people;
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const suggestedPeople = useMemo(
    () => getSuggestedPeople(peopleFromServer, appliedQuery),
    [appliedQuery],
  );

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  const handleListClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsVisible(false);
  };

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(null);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const hasSuggestedPeople = suggestedPeople.length === 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setIsVisible(true)}
              onChange={handleInputChange}
            />
          </div>

          {isVisible && !hasSuggestedPeople && (
            <DropdownList
              handleListClick={handleListClick}
              people={suggestedPeople}
            />
          )}
        </div>

        {hasSuggestedPeople && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
