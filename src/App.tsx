import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocompete';

export const App: React.FC = () => {
  const [selectedPersonSlug, setSelectedPersonSlug] = useState('');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const selectedPerson: Person | undefined = peopleFromServer
    .find(person => person.slug === selectedPersonSlug);

  const applyQuery = useCallback(
    debounce(setDebouncedQuery, 500),
    [],
  );

  const onSelect = useCallback((slug: string) => {
    setSelectedPersonSlug(slug);
  }, [debouncedQuery]);

  const applyTypingDelay = useCallback(
    debounce(setIsTyping, 500),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsTyping(true);
    applyQuery(event.target.value);
    applyTypingDelay(false);
  };

  useEffect(() => {
    setQuery('');
    setDebouncedQuery('');
    setIsTyping(false);
  }, [selectedPerson]);

  const dropDownList = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    ));
  }, [debouncedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`
            : 'No selected person'
        }
      </h1>

      <div className={cn(
        'dropdown',
        { 'is-active': debouncedQuery && !isTyping },
      )}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <Autocomplete dropDownList={dropDownList} onSelect={onSelect} />
        </div>
      </div>
    </main>
  );
};
