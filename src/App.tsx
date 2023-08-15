import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList';

const DELAY = 300;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [applyedQuery, setApplyedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isListOpened, setIsListOpened] = useState(false);
  const selectionRef = useRef<HTMLDivElement>(null);

  const applyQuery = useCallback(debounce(setApplyedQuery, DELAY), []);

  const handleQueryChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  }, []);

  const handleSelectPerson = useCallback((
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setSelectedPerson(person);
    setQuery(person.name);
    setApplyedQuery(person.name);
    setIsListOpened(false);
  }, []);

  const filteredPeople = useMemo(() => {
    setIsListOpened(true);

    return peopleFromServer.filter(
      (person) => person.name
        .toLowerCase()
        .includes(applyedQuery.toLowerCase()),
    );
  }, [peopleFromServer, applyedQuery]);

  useEffect(() => {
    setIsListOpened(false);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectionRef.current
        && !selectionRef.current.contains(event.target as ChildNode)
      ) {
        setIsListOpened(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active" ref={selectionRef}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsListOpened(true)}
          />
        </div>

        {isListOpened && (
          <PeopleList people={filteredPeople} onSelect={handleSelectPerson} />
        )}
      </div>
    </main>
  );
};
