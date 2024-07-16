import React, { useState, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

const filterList = (list: Person[], { appliedQuery }: { appliedQuery: string }) => {
  let filteredList = list;
  const newQuery = appliedQuery.toLowerCase().trim();

  if (appliedQuery) {
    filteredList = filteredList.filter(people => people.name.toLowerCase().includes(newQuery));
  }

  return filteredList;
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selected, setSelected] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const listOfPeople = useMemo(() => {
    return filterList(peopleFromServer, { appliedQuery });
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected ? (
            `${selected.name} (${selected.born} - ${selected.died})`
          ) : 'No selected person'}
        </h1>

        <Autocomplete
          peoples={listOfPeople}
          query={query}
          onQuery={setQuery}
          onApplyQuery={applyQuery}
          onSelected={setSelected}
        />

        {listOfPeople.length === 0 && (
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
