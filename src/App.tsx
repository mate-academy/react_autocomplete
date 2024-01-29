import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { debounce } from 'lodash';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/People';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState<string>('No selected person');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayQuery = useMemo(() => debounce((value: string) => {
    setAppliedQuery(value.trim());
  }, 1000), []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();

      setQuery(value);
      setTitle('No selected person');
      delayQuery(value);
    }, [delayQuery],
  );

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, 100);
  }, []);

  const handlePersonSelect = useCallback((person: Person | null) => {
    if (person) {
      setQuery(person.name);
      setIsVisible(false);
      setTitle(`${person.name} (${person.born} - ${person.died})`);
    } else {
      setQuery('');
      setIsVisible(false);
      setTitle('No selected person');
    }
  }, []);

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person?.name?.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  useEffect(() => {
    return () => {
      delayQuery.cancel();
    };
  }, [delayQuery]);

  return (
    <main className="section is-flex is-flex-direction-column">
      <h1 className="title" data-cy="title">
        {title}
      </h1>

      <div className="dropdown is-active">
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

        {isVisible && (
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
