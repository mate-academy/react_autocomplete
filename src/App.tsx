import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [choosenPerson, setChoosenPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setApliedQuery] = useState('');
  const [isInputFocus, setIsInputFocus] = useState(false);

  const applyQuery = useCallback(
    debounce(setApliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())
    ));
  }, [appliedQuery, peopleFromServer]);

  const handleKey = (
    event: React.KeyboardEvent<HTMLDivElement>,
    person: Person,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setChoosenPerson(person);
      setIsInputFocus(false);
    }
  };

  const handleClickItem = (person: Person) => {
    setChoosenPerson(person);
    setIsInputFocus(false);
    setQuery(person.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {choosenPerson !== null
          ? `${choosenPerson.name} (${choosenPerson.born} = ${choosenPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', { 'is-active': isInputFocus })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsInputFocus(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length !== 0
              ? filteredPeople.map(person => (
                <div
                  role="menuitem"
                  tabIndex={0}
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => handleClickItem(person)}
                  onKeyDown={(event) => handleKey(event, person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
              : <p>No matching suggestions</p>}
          </div>
        </div>
      </div>
    </main>
  );
};
