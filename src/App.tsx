import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList/PeopleList';

const DELAY = 1000;

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [applyedQuery, setApplyedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const applyQuery = useCallback(debounce(setApplyedQuery, DELAY), []);

  const filteredPeople = useMemo(() => {
    setShowSuggestions(true);

    return peopleFromServer.filter(
      (person) => person.name.toLowerCase()
        .includes(applyedQuery.toLowerCase()),
    );
  }, [applyedQuery, peopleFromServer]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;

      setInputText(text);
      applyQuery(text);
    },
    [],
  );

  const handleSelectPerson = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      person: Person,
    ) => {
      event.preventDefault();
      setSelectedPerson(person);
      setInputText(person.name);
      setApplyedQuery(person.name);
      setShowSuggestions(false);
    },
    [],
  );

  useEffect(() => {
    setShowSuggestions(false);
  }, [inputText]);

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
            value={inputText}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
          />
        </div>

        {showSuggestions && (
          <PeopleList people={filteredPeople} onSelect={handleSelectPerson} />
        )}
      </div>
    </main>
  );
};
