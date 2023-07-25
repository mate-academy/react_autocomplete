import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { List } from './components/PeopleDropDownList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const copyPeople = [...peopleFromServer];
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [delayedSearch, setDelayedSearch] = useState('');

  const filteredPeople = useMemo(() => {
    return copyPeople.filter(
      person => person.name.toLowerCase().includes(
        delayedSearch.toLowerCase(),
      ),
    );
  }, [copyPeople]);
  const aplyDelayedSearch = useCallback(
    debounce(setDelayedSearch, 1000), [],
  );
  const aplySelectedPerson = useCallback(
    setSelectedPerson, [],
  );
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    aplyDelayedSearch(event.target.value);
  };

  const onClick = (person: Person) => {
    setQuery(person.name);
    aplySelectedPerson(person);
    setFocused(false);
  };

  const inputRef = useRef<HTMLElement>(null);

  useEffect(() => {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const handleOutsideInputClick = (event: any) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setFocused(false);
      }
    };

    document.addEventListener('click', handleOutsideInputClick);

    return () => {
      document.removeEventListener('click', handleOutsideInputClick);
    };
  }, []);

  return (
    <main className="section" ref={inputRef}>
      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={event => inputHandler(event)}
            onFocus={() => setFocused(true)}
          />
        </div>
        {focused && (
          <List
            people={filteredPeople}
            onClick={(person) => onClick(person)}
          />
        )}
      </div>
    </main>
  );
};
