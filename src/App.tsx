import {
  useState, useRef, useMemo, useCallback, useEffect,
} from 'react';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceQuery = useRef(
    debounce((search: string) => setSearchQuery(search), 200),
  ).current;

  const people = peopleFromServer;
  const filteredPeople = useMemo(
    () => people.filter((person) => person.name.toLowerCase()
      .includes(searchQuery.trim().toLowerCase())),
    [people, searchQuery],
  );

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const handleOnClick = useCallback((person: Person) => {
    setSelectedPerson(person);
    setSearchQuery(person.name);
    setIsMenuOpen(false);
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;

      setIsMenuOpen(!!search);
      setSearchQuery(search);
      debounceQuery(search);
    }, [debounceQuery],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <div className={`dropdown ${isMenuOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={searchQuery}
            onChange={handleInputChange}
            ref={inputRef}
          />
        </div>
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length
              ? filteredPeople.map((person) => (
                <button
                  type="button"
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => {
                    handleOnClick(person);
                    setIsMenuOpen(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </button>
              ))
              : <p>No matching suggestions</p>}
          </div>
        </div>
      </div>
    </main>
  );
};
