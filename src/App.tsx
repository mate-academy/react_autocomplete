import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDownItem } from './components/DropDownItem';
import { useDebounce } from './hooks/useDebounce';
import { searchedPeople } from './helpers';

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

  const onQuery = () => setQuery('');

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
            onChange={(element) => setQuery(element.target.value)}
          />
        </div>

        {query && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">

              {filteredPeople.length > 0 ? (
                filteredPeople.map((person: Person) => (
                  <DropDownItem
                    key={person.slug}
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
