import React, { useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './autocomplete';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

function getSuggestions(people: Person[], query: string) {
  let preparedSuggestions;
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery) {
    preparedSuggestions = people.filter(person =>
      person.name.toLowerCase().startsWith(normalizedQuery),
    );
  }

  return preparedSuggestions !== undefined ? preparedSuggestions : people;
}

type AppProps = {
  debounceDelay?: number;
};

export const App: React.FC<AppProps> = ({ debounceDelay = 300 }) => {
  const [query, setQuery] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );

  const suggestions =
    query.trim() || isInputFocused
      ? getSuggestions(peopleFromServer, query)
      : [];

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setInputValue(person.name);
  };

  const applyQueryDebounce = useCallback(
    debounce((value: string) => {
      setQuery(value);
      setSelectedPerson(null);
    }, debounceDelay),
    [debounceDelay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);
    applyQueryDebounce(value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!selectedPerson
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              value={inputValue}
              onChange={handleQueryChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              <Autocomplete
                people={suggestions}
                onSelect={handleSelectPerson}
                isFocused={isInputFocused}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
