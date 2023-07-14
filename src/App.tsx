import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/peopleList';

const filterPeople = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  return peopleFromServer.filter(person => {
    const normalizedName = person.name.trim().toLowerCase();

    return normalizedName.includes(normalizedQuery);
  });
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<null | Person>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const delay = 1000;

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery((event.target.value).trim());
    setIsDropdownActive(true);
  };

  const preparedPeople = useMemo(
    () => filterPeople(appliedQuery),
    [appliedQuery],
  );

  const handlePersonClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsDropdownActive(false);
    setAppliedQuery('');
  };

  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <div className={`dropdown ${isDropdownActive || isInputFocused ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            ref={inputRef}
          />
        </div>
        {appliedQuery && (
          <PeopleList
            people={preparedPeople}
            onClick={handlePersonClick}
          />
        )}
      </div>
    </main>
  );
};
