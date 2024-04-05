//import React, { useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { useState, useMemo } from 'react';
import { Dropdown } from './components/dropdown_menu/Dropdown-menu';
//import { Dropdown } from './components/dropdown_menu/Dropdown-menu';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  //const [appliedQuery, setAppliedQuery] = useState('');

  //const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAppliedQuery(event.target.value);
    setQuery(event.target.value);
    //applyQuery(event.target.value);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${name} (${born} - ${died})`}
        </h1>
        <Dropdown
          filterPeople={filterPeople}
          query={query}
          handleQueryChange={handleQueryChange}
        />
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
      </main>
    </div>
  );
};
