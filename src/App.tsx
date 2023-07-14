import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

interface AppProps {
  debounceDelay: number,
}

export const App: React.FC<AppProps> = ({ debounceDelay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, debounceDelay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    if (!newQuery.trim()) {
      setSelectedPerson(null);
    }

    applyQuery(newQuery);
  };

  const handleClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsDropdownActive(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        inputRef.current
        && !inputRef.current.contains(event.target as Node)
        && dropdownRef.current
        && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownActive(false);
      }
    };

    const handleInputClick = () => {
      if (query.trim() === '') {
        setIsDropdownActive(true);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    inputRef.current?.addEventListener('click', handleInputClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      inputRef.current?.removeEventListener('click', handleInputClick);
    };
  }, [query]);

  const visiblePeople = useMemo(() => {
    setIsDropdownActive(!!appliedQuery);

    if (!appliedQuery) {
      setSelectedPerson(null);
      setIsDropdownActive(false);
    } else {
      setIsDropdownActive(true);
    }

    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(
        appliedQuery.trim().toLowerCase(),
      ),
    );
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div
        className={cn('dropdown', {
          'is-active': isDropdownActive,
        })}
        ref={dropdownRef}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            ref={inputRef}
          />
        </div>
        <Dropdown
          people={visiblePeople}
          onSelect={handleClick}
        />
      </div>
    </main>
  );
};
