import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';
import { useDebounce } from './hooks/useDebounce';

function filteredPerson(people: Person[], query: string): Person[] {
  const queryLowerCase = query.trim().toLowerCase();

  if (query !== '') {
    return people.filter(person =>
      person.name.toLowerCase().includes(queryLowerCase),
    );
  }

  return people;
}

export const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const debounceValue = useDebounce(search);
  const visiblePeople = useMemo(() => {
    return filteredPerson(peopleFromServer, debounceValue);
  }, [debounceValue]);
  const refDropDown = useRef<HTMLDivElement | null>(null);

  const handleChoosePerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setSearch(person.name);
    setVisibleDropdown(false);
  }, []);

  useEffect(() => {
    if (!visibleDropdown) {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (
        !refDropDown.current ||
        refDropDown.current.contains(event.target as Node)
      ) {
        return;
      }

      setVisibleDropdown(false);
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [visibleDropdown]);
  const personData = `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson ? personData : 'No selected person'}
        </h1>

        <div className="dropdown is-active" ref={refDropDown}>
          <div className="dropdown-trigger">
            <input
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (selectedPerson) {
                  setSelectedPerson(null);
                }
              }}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setVisibleDropdown(true)}
            />
          </div>
          <Dropdown
            visible={visibleDropdown}
            people={visiblePeople}
            onSelected={handleChoosePerson}
          />
        </div>
        {visibleDropdown && !visiblePeople.length && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
