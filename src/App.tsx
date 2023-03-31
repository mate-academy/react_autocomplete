import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDownItem } from './components/DropDownItem';

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay],
  );

  return debouncedValue;
};

const searchedPeople = (peopleData: Person[], searchQuery: string) => {
  const lowerQuery = searchQuery.trim().toLocaleLowerCase();

  return peopleData.filter(people => people.name
    .toLowerCase()
    .includes(lowerQuery));
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 1000);

  const onSelect = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
    },
    [debouncedQuery],
  );

  const onQuery = useCallback(() => setQuery(''), [debouncedQuery]);

  const filteredPeople = useMemo(() => {
    return searchedPeople(peopleFromServer, debouncedQuery);
  }, [debouncedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(element) => {
              setQuery(element.target.value);
            }}
          />
        </div>

        {query && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">

              {filteredPeople.length > 0 ? (
                filteredPeople.map((person: Person) => (
                  <DropDownItem
                    person={person}
                    onSelect={onSelect}
                    onQuery={onQuery}
                  />
                ))
              ) : (
                <p className="no-match">No matching suggestions</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
