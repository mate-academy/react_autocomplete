import debounce from 'lodash.debounce';
import {
  useMemo,
  useState,
  useEffect,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PersonName } from './components/Person/PersonName';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setApplyQuerry] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [noSuggestion, setNoSuggestions] = useState(false);

  const reset = () => {
    setSelectedPerson(null);
  };

  const handleSelected = (newPerson: Person) => {
    setSelectedPerson(newPerson);
  };

  const applyQuerry = useMemo(() => debounce(
    (value: string) => {
      setApplyQuerry(value);
      setNoSuggestions(false);
    }, 1000,
  ),
  [setApplyQuerry, setNoSuggestions]);

  const handlerQuery = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuerry(event.target.value);
    reset();
    setNoSuggestions(false);
  };

  const filteredPeople: Person[] = useMemo(() => {
    return [...peopleFromServer].filter(
      person => person.name.includes(appliedQuery.trim()),
    );
  },
  [appliedQuery]);

  useEffect(() => {
    if (!filteredPeople.length && query) {
      setNoSuggestions(true);
    }
  }, [filteredPeople, query]);

  return (
    <main
      className="section"
    >
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={selectedPerson ? selectedPerson.name : query}
            onChange={handlerQuery}
            onFocus={() => {
              setIsFocused(true);
              setNoSuggestions(false);
            }}
            onBlur={() => {
              setIsFocused(true);
              setNoSuggestions(false);
            }}
          />
        </div>
        <div className="dropdown-menu" role="menu">
          {(isFocused && !query && !selectedPerson)
                && peopleFromServer.map(person => (
                  <div
                    className="dropdown-content"
                    key={person.name}
                  >
                    <PersonName
                      person={person}
                      onSelected={handleSelected}
                    />
                  </div>
                ))}
          {(query && !selectedPerson) && filteredPeople.map((person) => (
            <div
              className="dropdown-content"
              key={person.name}
            >
              <PersonName
                person={person}
                onSelected={handleSelected}
              />
            </div>
          ))}

          {noSuggestion && <div>No matching suggestions</div>}
        </div>
      </div>
    </main>
  );
};
