import {
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './DropdownMenu';
import { Person } from './types/Person';

const debounce = <T extends string[]>(
  f: (...args: T) => void,
  delay: number,
) => {
  let timerId: NodeJS.Timeout;

  return (...args: T) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, ...args);
  };
};

export const App = () => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setShowSuggestions(false);
    }
  }, [query]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    applyQuery(value);
    setShowSuggestions(false);
  };

  const onSelected = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setShowSuggestions(false);
  };

  const visiblePeople = useMemo(() => {
    setShowSuggestions(true);

    const normalizePersonName = (human: Person) => {
      return human.name.toLowerCase().trim();
    };

    return peopleFromServer.filter(
      person => normalizePersonName(person)
        .includes(appliedQuery.toLowerCase()),
    );
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryOnChange}
          />
        </div>

        {showSuggestions && (
          <DropdownMenu
            people={visiblePeople}
            onSelected={onSelected}
          />
        )}
      </div>
    </main>
  );
};
