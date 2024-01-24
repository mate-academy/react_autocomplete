import React, { useEffect, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { useDebounce } from './hooks';

const filteredList = (partOfName: string) => {
  return peopleFromServer.filter(man => man.name.toLowerCase()
    .includes(partOfName.toLowerCase()));
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState(peopleFromServer[0]);
  const [value, setValue] = useState('');
  const query = useDebounce(value, 500);
  const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
  const [visiblePeople, setVisiblePeople] = useState(
    filteredList(''),
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSelectMan = (man: Person) => () => {
    setSelectedPerson(man);
    setValue(man.name);
    setIsVisibleDropdown(false);
  };

  useEffect(() => {
    setVisiblePeople(filteredList(query));
  }, [query]);

  return (
    <main className="section">
      <h1 className="title">
        {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsVisibleDropdown(true)}
          />
        </div>

        {isVisibleDropdown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {
                visiblePeople.map(man => (
                  <div
                    className="dropdown-item"
                    key={man.name}
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => { }}
                    onClick={handleSelectMan(man)}
                  >
                    <p className={classNames({
                      'has-text-link': man.sex === 'm',
                      'has-text-danger': man.sex === 'f',
                    })}
                    >
                      {man.name}
                    </p>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
