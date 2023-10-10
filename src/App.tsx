import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { PeopleList } from './components/PeopleList';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export interface AppProps {
  delay: number;
}

export const App: React.FC<AppProps> = ({ delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay), [delay],
  );
  const [isVisible, setIsVisible] = useState(true);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (event.target.value === '') {
      setIsVisible(true);
    }
  };

  const handleSuggestionSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsVisible(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase().includes(
      appliedQuery.toLowerCase(),
    ));
  }, [appliedQuery]);

  const personField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (personField.current) {
      personField.current.focus();
    }
  }, [selectedPerson]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            ref={personField}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <PeopleList
          people={filteredPeople}
          selectedPersonId={selectedPerson?.name}
          onSelect={handleSuggestionSelect}
          isVisible={isVisible}
        />
      </div>
    </main>
  );
};
