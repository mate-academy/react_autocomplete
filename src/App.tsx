import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { PersonList } from './components/PersonList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isListVisible, setIsListVisible] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(query.toLowerCase())
    ));
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelectPerson = useCallback((
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsListVisible(false);
  }, []);

  useEffect(() => {
    setIsListVisible(false);
  }, [query]);

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
            onChange={handleQueryChange}
            onFocus={() => setIsListVisible(true)}
          />
        </div>

        {isListVisible && (
          <PersonList people={filteredPeople} onSelect={handleSelectPerson} />
        )}
      </div>
    </main>
  );
};
