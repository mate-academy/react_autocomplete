import React, {
  useState, useMemo, useCallback,
} from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './PeopleList';

function debounce(callback: (...args: any[]) => void, delay: number) {
  let timerId = 0;

  return (...args: any[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const delay = 1000;
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [dropdownFocused, setDropdownFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [delay],
  );

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery('');
    setDropdownFocused(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (event.target.value !== appliedQuery) {
      applyQuery(event.target.value);
      setAppliedQuery(event.target.value);
    }
  };

  const handleFocus = () => {
    if (selectedPerson) {
      setQuery('');
    }

    setDropdownFocused(true);
  };

  const handleBlur = () => {
    setDropdownFocused(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery, dropdownFocused]);

  return (
    <main className="section">
      <h1 className="title">
        { selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', { 'is-active': dropdownFocused })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            className="input"
            aria-haspopup="true"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search..."
          />
          <PeopleList people={filteredPeople} onSelect={handleSelectedPerson} />
        </div>
      </div>
    </main>
  );
};
