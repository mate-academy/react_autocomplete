import { useCallback, useState } from 'react';
import './App.scss';
import { Autocomplete } from './Autocomplete/Autocomplete';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (callback: Function, delay: number) => {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const closeDropdown = useCallback(() => {
    setTimeout(() => {
      setIsFocus(false);
    }, 200);
  }, []);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handlerOnSelect = (selectedPerson: Person) => {
    setPerson(selectedPerson);
    setQuery(selectedPerson.name);
  };

  return (
    <main className="section">
      {person ? (
        <h1 className="title">
          {`${person.name} (${person.born} = ${person.died})`}
        </h1>
      ) : (
        <p className="title">No selected person</p>
      )}

      <div className="dropdown">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            applyQuery(event.target.value);
          }}
          onFocus={() => setIsFocus(true)}
          onBlur={closeDropdown}
        />

        <Autocomplete
          query={appliedQuery}
          isFocus={isFocus}
          onSelect={handlerOnSelect}
        />
      </div>
    </main>
  );
};
