import React, { useCallback, useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Autocomplete';
import { debounce } from 'lodash';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState<string>('');
  const [debounceQuery, setDebounceQuery] = useState<string>('');

  useEffect(() => {
    if (query !== '' && !selectedPerson) {
      setSelectedPerson(null);
    }
  }, [query, selectedPerson])


  const filteredPeople = query.trim() === '' ? peopleFromServer : peopleFromServer.filter(person => person.name.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setDebounceQuery('');
  };

  const delay = 300;

  const handleQueryChange = useCallback(
    debounce((value: string) => {
      setDebounceQuery(value);
    }, delay),
    [delay]
  );

  const noSuggestions = query && filteredPeople.length === 0;

  const { name, born, died } = selectedPerson || { name: 'No selected person', born: '', died: '' };


  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
        {selectedPerson ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <Autocomplete people={filteredPeople} query={query} setQuery={setQuery} onSelected={handleSelectPerson} onQueryChange={handleQueryChange} />

        {noSuggestions && (
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
