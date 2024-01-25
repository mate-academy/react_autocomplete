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
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [value, setValue] = useState('');
  const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
  const [visiblePeople, setVisiblePeople] = useState(
    filteredList(''),
  );

  const query = useDebounce(value, 500);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsVisibleDropdown(false);
    }, 120);
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
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      {/* <div className="dropdown is-active"> */}
      <div
        className={classNames('dropdown',
          { 'is-active': isVisibleDropdown })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsVisibleDropdown(true)}
            onBlur={handleBlur}
          />
        </div>

        {isVisibleDropdown && (
          <div
            className="dropdown-menu"
            role="menu"
          >
            <div className="dropdown-content">
              {visiblePeople.length > 0
                ? visiblePeople.map(man => (
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
                : (
                  <div className="dropdown-item">
                    <p className="has-text-link">No matching suggestions</p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
