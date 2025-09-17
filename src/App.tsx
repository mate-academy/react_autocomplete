// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash/debounce';
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type AppProps = {
  delay?: number; // debounce delay
  onSelected?: (person: Person) => void;
};

export const App: React.FC<AppProps> = ({ delay = 300, onSelected }) => {
  const [chosenPerson, setChosenPerson] = useState<Person | null>(null);
  const [rawInput, setRawInput] = useState<string>('');
  const [searchPerson, setSearchPerson] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const lastSearchRef = useRef<string>(''); // для пропуску дублюючих фільтрацій

  const { name, born, died } = chosenPerson || {};

  // debounced handler
  const debouncedUpdate = useMemo(() => {
    const handler = debounce((value: string) => {
      const trimmed = value.trim();

      if (trimmed !== '' && trimmed !== lastSearchRef.current) {
        setSearchPerson(trimmed);
        lastSearchRef.current = trimmed;
      } else if (trimmed === '') {
        setSearchPerson('');
        lastSearchRef.current = '';
      }
    }, delay);

    return handler;
  }, [delay]);

  useEffect(() => {
    // cleanup debounce при анмаунті
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  // фільтрація
  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(searchPerson.toLowerCase()),
    );
  }, [searchPerson]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setRawInput(value);

      if (chosenPerson) {
        setChosenPerson(null);
      }

      const trimmed = value.trim();

      if (trimmed === '') {
        debouncedUpdate.cancel();
        setSearchPerson('');
        lastSearchRef.current = '';
      } else {
        debouncedUpdate(value);
      }
    },
    [chosenPerson, debouncedUpdate],
  );

  const handleSelect = useCallback(
    (person: Person) => {
      setChosenPerson(person);
      setRawInput(person.name);
      setSearchPerson(person.name);
      setIsFocused(false);

      if (onSelected) {
        onSelected(person);
      }
    },
    [onSelected],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-qa="title">
          {chosenPerson ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <div
          className={isFocused ? 'dropdown is-active' : 'dropdown'}
          data-qa="search-dropdown"
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={rawInput}
              data-qa="search-input"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleInputChange}
            />
          </div>

          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content" data-qa="suggestions-list">
              {rawInput.trim() !== '' && filteredPeople.length === 0 && (
                <div
                  className="dropdown-item is-disabled has-text-grey"
                  data-qa="no-suggestions-message"
                >
                  No matching suggestions
                </div>
              )}

              {filteredPeople.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item has-text-link"
                  data-qa="suggestion-item"
                  onMouseDown={e => {
                    e.preventDefault(); // не дає onBlur закрити список раніше
                    handleSelect(person);
                  }}
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
