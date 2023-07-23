import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import './App.scss';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu/DropdownMenu';
import { Person } from './types/Person';

const LIST_UPDATE_DELAY = 1000;

export const App: React.FC = () => {
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, LIST_UPDATE_DELAY), [],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, peopleFromServer]);

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    applyQuery(event.target.value);
    setQuery(event.target.value);
    setIsSelected(false);
  }

  const handleSelectedPerson = (person: Person) => {
    setAppliedQuery(person.name);
    setQuery(person.name);
    setSelectedPerson(person);
    setIsSelected(true);
  };

  return (
    <main className="section">
      <h1 className="title">
        {
          isSelected
            ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
            : 'No selected person'
        }
      </h1>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
              }, 150);
            }}
          />
        </div>

        {(isFocused)
          && (
            <DropdownMenu
              people={filteredPeople}
              handleSelectedPerson={handleSelectedPerson}
            />
          )}
      </div>
    </main>
  );
};
