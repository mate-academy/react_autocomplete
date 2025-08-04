import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

interface AppProps {
  delay?: number;
}

export const App: React.FC<AppProps> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selected, setSelected] = useState<Person | null>(null);
  const [dropDown, setDropDown] = useState(false);

  function updateSuggestions(newQuery: string) {
    setSuggestions(
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(newQuery.toLowerCase()),
      ),
    );
  }

  const applyQuery = useCallback(debounce(updateSuggestions, delay), [delay]);

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (selected && event.target.value !== selected.name) {
      setSelected(null);
    }

    setQuery(event.target.value);
    applyQuery(event.target.value);
  }

  function handleFocusInput(event: React.FocusEvent<HTMLInputElement>) {
    if (event.target.value === '') {
      setSuggestions(peopleFromServer);
      setDropDown(true);
    }
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>
        <Autocomplete
          handleFocusInput={handleFocusInput}
          handleQueryChange={handleQueryChange}
          query={query}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          setSelected={setSelected}
          dropDown={dropDown}
        />
      </main>
    </div>
  );
};
