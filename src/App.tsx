import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { SuggestionPeople } from './components/suggestionPeople';
import { Person } from './types/Person';
import { getSuggestedPeople } from './helpers/getSuggestedPeople';
import { QuerySuggestions } from './components/querySuggestions';

const debounce = (
  func: (value: string) => void,
  delay: number,
) => {
  let timerId: number;

  return (...args: string[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay, ...args);
  };
};

interface AppProps {
  delay?: number,
}

export const App: React.FC<AppProps> = ({ delay = 1000 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const suggestedPeople = useMemo(
    () => getSuggestedPeople(peopleFromServer, appliedQuery),
    [appliedQuery],
  );

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
  };

  return (
    <main className="section">
      <h1 className="title">
        { selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">

        <QuerySuggestions
          query={query}
          onChangeQuery={setQuery}
          onChangeApplyQuery={applyQuery}
        />

        {appliedQuery && (
          <SuggestionPeople
            suggestedPeople={suggestedPeople}
            onSelected={selectPerson}
          />
        )}

      </div>
    </main>
  );
};
