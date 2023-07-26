import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import cn from 'classnames';

import { peopleFromServer } from './data/people';
import { DropDown } from './components/DropDown';
import { debounce } from './utils/debounce';

import './App.scss';

const DEBOUNCE_DELAY = 1000;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPersonSlug, setSelectedPersonSlug] = useState('');
  const [isSuggestionActive, setIsSuggestionActive] = useState(false);

  const people = useMemo(() => {
    const normalizedQuery = appliedQuery.toLowerCase().trim();

    if (appliedQuery) {
      setIsSuggestionActive(true);
    } else {
      setIsSuggestionActive(false);
      setSelectedPersonSlug('');
    }

    return peopleFromServer.filter((person) => person.name
      .toLowerCase()
      .includes(normalizedQuery));
  }, [appliedQuery, peopleFromServer]);

  const applyQuery = useCallback(debounce(setAppliedQuery, DEBOUNCE_DELAY), []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const selectedPerson = people.find(
    (person) => person.slug === selectedPersonSlug,
  );

  const handleSelect = useCallback((event, person) => {
    event.preventDefault();
    setSelectedPersonSlug(person.slug);
    setQuery(person.name);
    setIsSuggestionActive(false);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPersonSlug
          ? `${selectedPerson?.name} ${selectedPerson?.born} = ${selectedPerson?.died}`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': isSuggestionActive })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleInput}
          />
        </div>

        <DropDown people={people} onSelect={handleSelect} />
      </div>
    </main>
  );
};
