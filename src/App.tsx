import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { List } from './List';

export const App: React.FC = () => {
  const [isFocusedInput, setIsFocusedInput] = useState(false);
  const [query, setQuery] = useState('');
  const [apliedQuery, setApliedQuery] = useState('');
  const [sortedPeople] = useState<Person[]>(peopleFromServer);

  const applyQuery = useCallback(
    debounce(setApliedQuery, 1000), [],
  );

  const ref = useRef<Person | null>(null);

  const selectPerson = (person: Person) => {
    setQuery(person.name);
    ref.current = person;
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value.toLowerCase());
    ref.current = null;
  };

  const filteredPeople = useMemo(() => {
    return sortedPeople
      .filter(person => person.name.toLowerCase().includes(apliedQuery));
  }, [sortedPeople, apliedQuery]);

  const handleFocuse = () => {
    setIsFocusedInput(!isFocusedInput);
  };

  const handleBluer = () => {
    setTimeout(() => {
      setIsFocusedInput(!isFocusedInput);
    }, 100);
  };

  return (
    <main className="section">
      <h1 className="title">
        {ref.current ? (
          `${ref.current?.name} (${ref.current?.born} = ${ref.current?.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={query}
            onBlur={handleBluer}
            onFocus={handleFocuse}
            onChange={handleQuery}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        {(isFocusedInput) && (
          <List
            visiblePeople={filteredPeople}
            onSelectPerson={selectPerson}
          />
        )}
      </div>
    </main>
  );
};
