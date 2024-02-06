import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { debounce } from 'lodash';
import './App.scss';
import { Person } from './types/Person';
import { PeopleList } from './components/Autocomplete/Autocomplete';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('No selected person');
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person?.name?.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const delayQuery = useMemo(() => debounce((value: string) => {
    setAppliedQuery(value.trim());
  }, 1000), []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();

      setQuery(value);
      setTitle('No selected person');
      setLoading(true);
      delayQuery(value);
    }, [delayQuery],
  );

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      if (dropdownRef.current
        && !dropdownRef.current.contains(document.activeElement as Node)) {
        setIsVisible(false);
        setLoading(false);
      }
    }, 100);
  }, []);

  const handlePersonSelect = useCallback((person: Person | null) => {
    if (person) {
      setQuery(person.name);
      setTitle(`${person.name} (${person.born} - ${person.died})`);
    } else {
      setQuery('');
      setTitle('No selected person');
    }

    setIsVisible(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      delayQuery.cancel();
    };
  }, [delayQuery]);

  useEffect(() => {
    const fetchData = () => {
      setAppliedQuery(query);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [query]);

  return (
    <main className="section is-flex is-flex-direction-column">
      <h1 className="title" data-cy="title">
        {title}
      </h1>

      <div className="dropdown is-active" ref={dropdownRef}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsVisible(true)}
            onBlur={handleOnBlur}
          />
        </div>

        {isVisible && !loading && (
          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            <PeopleList
              onSelect={handlePersonSelect}
              people={filteredPeople}
            />
          </div>
        )}
      </div>
    </main>
  );
};
