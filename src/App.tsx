import './App.scss';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';
import { peopleFromServer } from './data/people';
import { PersonList } from './components/list/PersonList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [inputOnFocus, setInputOnFocus] = useState(false);
  const delay = 1000;

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay), [],
  );

  const selectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery('');
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    const newQuery = query.toLocaleLowerCase().trim();

    return peopleFromServer.filter(
      person => person.name.toLocaleLowerCase().includes(newQuery),
    );
  }, [query]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})` : 'No person selected'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setInputOnFocus(true)}
            onBlur={() => setInputOnFocus(false)}
          />
        </div>

        {(inputOnFocus || appliedQuery)
          && (
            <div className="dropdown-menu" role="menu">
              <PersonList
                people={filteredPeople}
                onSelect={selectPerson}
              />
            </div>
          )}
      </div>
    </main>
  );
};
