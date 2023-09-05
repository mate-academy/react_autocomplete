import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components';
import { Person } from './types/Person';

const DELAY = 1000;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisibleList, setIsVisibleList] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const apllyQuery = useCallback(
    debounce(setAppliedQuery, DELAY),
    [],
  );

  const handlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    apllyQuery(event.target.value);
    setQuery(event.target.value);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setIsVisibleList(false);
    setQuery('');
    setAppliedQuery('');
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
            : 'No selected person'
        }
      </h1>

      <div className={cn('dropdown', {
        'is-active': isVisibleList,
      })}
      >
        <div className="dropdown-trigger">
          <input
            hidden
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onFocus={() => setIsVisibleList(true)}
            onChange={handlInputChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <PeopleList
              people={filterPeople}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
