import classNames from 'classnames';
import React, {
  useMemo,
  useState,
  useCallback,
} from 'react';
import './App.scss';
import { PeopleList } from './components/PeopleLIst';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface Props {
  delay: number,
}

function debounce(callback: (...args: string[]) => void, delay: number) {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC<Props> = ({ delay }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
  };

  const handleSelect = useCallback((currentPerson: Person) => {
    setSelectedPerson(currentPerson);
    setAppliedQuery('');
  }, []);

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.trim().toLowerCase()));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})` : 'No selected person'}
      </h1>

      <div className={classNames('dropdown',
        {
          'is-active': appliedQuery,
        })}
      >
        <div className="dropdown-trigger">
          <input
            onChange={handleQueryChange}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        {appliedQuery && (
          <PeopleList
            people={filteredPeople}
            onSelect={handleSelect}
          />
        )}
      </div>
    </main>
  );
};
