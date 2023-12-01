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

interface Props {
  deley: number;
}

export const App: React.FC<Props> = ({ deley = 1000 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setApplyQuerry] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [noMatches, setNoMatches] = useState(false);
  const [drobdownHide, setDropdownHide] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    setNoMatches(false);
  };

  const reset = () => {
    setSelectedPerson(null);
  };

  const handleSelected = (newPerson: Person) => {
    setSelectedPerson(newPerson);
  };

  const applyQuerry = useMemo(() => debounce(
    (value: string) => {
      setDropdownHide(false);
      setNoMatches(false);
      setApplyQuerry(value);
    }, deley,
  ),
  [setApplyQuerry, deley]);

  const handlerQuery = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuerry(event.target.value);
    setDropdownHide(true);
    reset();
    setNoMatches(false);
  };

  const filteredPeople: Person[] = useMemo(() => {
    return [...peopleFromServer].filter(
      person => person.name.includes(appliedQuery.trim()),
    );
  },
  [appliedQuery]);

  useEffect(() => {
    if (!filteredPeople.length && query) {
      setNoMatches(true);
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
            onFocus={handleFocus}
            onBlur={handleFocus}
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

          {(!selectedPerson && appliedQuery && !drobdownHide)
            && filteredPeople.map((person) => (
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
          {noMatches
          && (
            <div
              className="dropdown-content"
            >
              No matching suggestions
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
