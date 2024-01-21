import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { debounce } from 'lodash';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  const searchInput = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (searchInput.current) {
      searchInput.current.blur(); // removing focus
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), 1000),
    [],
  );

  const onHandleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setQuery(event.target.value);
  };

  const handlePersonSelect = useCallback((person: Person | null) => {
    setSelectedPerson(person);

    if (person) {
      setQuery(person.name);
      setIsVisible(false);
    }
  }, []);

  const reset = () => {
    setSelectedPerson(null);
    setQuery('');
    setIsVisible(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person?.name?.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1
        className="title"
      >
        {selectedPerson ? `${name} (${born} - ${died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger control has-icons-right">
          <input
            ref={handleFocus}
            type="text"
            placeholder="Enter a part of the name"
            name="input"
            className="input"
            value={query}
            onChange={onHandleInputChange}
            onFocus={() => setIsVisible(true)}
          />

          {selectedPerson && (
            <span className="icon is-small is-right">
              <button
                onClick={reset}
                type="button"
                className="delete is-small"
              >
                x
              </button>
            </span>
          )}
        </div>

        {isVisible && (
          <div
            className="dropdown-menu"
            role="menu"
          >
            <PeopleList
              onSelect={handlePersonSelect}
              persons={filteredPeople}
            />
          </div>
        )}
      </div>
    </main>
  );
};
