import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplate } from './component/Autocomplete';
import { debounce } from './utils/debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const currentPerson = peopleFromServer.find(
    person => person.name === selectedPerson,
  );

  const handleQueryClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setQuery(event.currentTarget.textContent || '');
    setSelectedPerson(event.currentTarget.textContent || '');
    setIsInputFocused(true);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsInputFocused(true);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentPerson
            ? (
              `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
            ) : (
              'No selected person'
            )}
        </h1>

        <Autocomplate
          query={query}
          handleQueryChange={handleQueryChange}
          filteredPeople={filteredPeople}
          onSelected={handleQueryClick}
          focus={isInputFocused}
        />
      </main>
    </div>
  );
};
