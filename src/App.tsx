import React, {
  useState,
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
  const [delayedQuery, setQuerySearch] = useState('');
  const [trigger, setTrigger] = useState('');

  const filteredPeople = useMemo(() => {
    return copyPeople.filter(
      person => person.name.toLowerCase().includes(
        delayedQuery.toLowerCase(),
      ),
    );
  }, [copyPeople, query]);
  const aplydelayedQuery = useCallback(
    debounce(setQuerySearch, 1000), [],
  );

  const queryWatcher = useCallback(
    debounce(setTrigger, 1000), [query],
  );
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    aplydelayedQuery(event.target.value);
    queryWatcher(event.target.value);
  };

  const onClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setFocused(false);
  };

  const handleOnBlur = useCallback(debounce(setFocused, 100), []);
  const showSuggestions = focused && (query === trigger);
  const showPersonData = query === selectedPerson?.name;

  return (
    <main className="section">
      <h1 className="title">
        {showPersonData ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={inputHandler}
            onFocus={() => setFocused(true)}
            onBlur={() => handleOnBlur(false)}
          />
        </div>
        {showSuggestions && (
          <List
            people={filteredPeople}
            onClick={onClick}
          />
        )}
      </div>
    </main>
  );
};
