import React, { useEffect, useState } from 'react';
import { Autocomplete } from './components/Autocomplete';
import { DropTownContent } from './components/DropTownContent';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [filtredPeople, setFilteredPeople] = useState<Person[]>([
    ...peopleFromServer,
  ]);
  const [menuVisability, setMenuVisability] = useState(false);

  useEffect(() => {
    if (selected) {
      setQuery(selected.name);
    }
  }, [selected]);

  const onSelect = (person: Person) => {
    setSelected(person);
    setMenuVisability(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-qa="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <Autocomplete
              delay={300}
              query={query}
              setMenuVisability={setMenuVisability}
              setQuery={setQuery}
              setFilteredPeople={setFilteredPeople}
              peopleFromServer={peopleFromServer}
            ></Autocomplete>
          </div>

          {menuVisability && (
            <div
              className="dropdown-menu"
              role="menu"
              data-qa="suggestions-list"
            >
              <DropTownContent
                onSelect={onSelect}
                people={filtredPeople}
              ></DropTownContent>
            </div>
          )}
        </div>
        {filtredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-qa="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
