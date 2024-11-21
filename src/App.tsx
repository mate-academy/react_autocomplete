import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList/PeopleList';
import { Person } from './types/Person';

type Props = {
  delay?: number;
};

export const App: React.FC<Props> = ({ delay = 300 }: Props) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [isListOpen, setIsListOpen] = useState(false);

  const applyQuery = React.useMemo(
    () => debounce(setAppliedQuery, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setQuery(event.target.value);

    if (selectedPerson) {
      setSelectedPerson('');
    }
  };

  const getPerson = (personSlug: string) => {
    return peopleFromServer.find(person => person.slug === personSlug);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person.slug);
    setQuery(person.name);
    setIsListOpen(false);
  };

  const person = getPerson(selectedPerson);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!!person
            ? `${person.name} (${person.born} - ${person.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              onChange={event => {
                handleQueryChange(event);
              }}
              onFocus={() => setIsListOpen(true)}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          {isListOpen && !!filteredPeople.length && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                <PeopleList
                  people={filteredPeople}
                  onSelected={handleSelectedPerson}
                />
              </div>
            </div>
          )}
        </div>

        {!filteredPeople.length && (
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
