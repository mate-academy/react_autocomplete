import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

type Person = {
  name: string;
  sex: string;
  born: number;
  died: number;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
};

function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timer = 0;

  return (input: string) => {
    window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      callback(input);
    }, delay);
  };
}

export const App: React.FC<number> = defaultDelay => {
  const [suggestion, setSuggestion] = useState('');
  const [appliedSuggestion, setAppliedSuggestion] = useState('');

  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [delay, setDelay] = useState(defaultDelay || 0);

  const applySuggestion = useCallback(debounce(setAppliedSuggestion, delay), [
    delay,
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSuggestion(event.target.value);
    applySuggestion(event.target.value);

    setSelectedPerson(null);
  };

  const filteredSuggestions = useMemo(() => {
    if (!appliedSuggestion.trim()) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person => {
      return person.name
        .toLowerCase()
        .includes(appliedSuggestion.trim().toLowerCase());
    });
  }, [appliedSuggestion]);

  const onSelected = (person: Person) => {
    setSuggestion(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <input
          type="number"
          placeholder="Enter a delay"
          className="input delay-input"
          value={delay}
          onChange={event => setDelay(Number(event.target.value))}
          step={25}
        />

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={suggestion}
              onChange={event => handleChange(event)}
              onFocus={event => {
                applySuggestion(event.target.value);

                setIsFocused(true);
              }}
            />
          </div>

          <Autocomplete
            isFocused={isFocused}
            filteredSuggestions={filteredSuggestions}
            onSelected={onSelected}
          />
        </div>

        {isFocused && filteredSuggestions.length <= 0 && (
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
