import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [chosenPerson, setChosenPerson] = useState<Person | null>(null);
  const [isInputOnFocus, setIsInputOnFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const delay = useRef<number>(1000);

  const applyQuery = useCallback(
    debounce(setQuery, delay.current),
    [],
  );

  const handlePersonClick = (person: Person) => {
    setInputValue(person.name);
    setChosenPerson(person);
    setIsInputOnFocus(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => peopleFromServer.filter(
    person => person.slug.includes(query),
  ), [query]);

  return (
    <main className="section">
      <h1 className="title">
        {chosenPerson ? `${chosenPerson.name} (${chosenPerson.born} - ${chosenPerson.died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={inputValue}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onFocus={() => setIsInputOnFocus(true)}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {isInputOnFocus && (
              !filteredPeople.length ? (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              ) : (
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    key={person.slug}
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePersonClick(person)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handlePersonClick(person);
                      }
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
