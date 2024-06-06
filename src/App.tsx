import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import { People } from './components/People';

type Props = {
  delay?: number;
};

export const App: React.FC<Props> = ({ delay = 500 }) => {
  const [isActive, setIsActive] = useState(false);
  const [inputField, setInputField] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visiableContent, setVisiableContent] = useState(peopleFromServer);

  const filterContent = useCallback((inputValue: string) => {
    const filtered = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(inputValue.toLowerCase().trim()),
    );

    setVisiableContent(filtered);
    setIsActive(filtered.length > 0);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilter = useCallback(debounce(filterContent, delay), [
    filterContent,
    delay,
  ]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputField(e.target.value);
    debounceFilter(e.target.value);
    setSelectedPerson(null);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setIsActive(false);
    setInputField(person.name);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : `No selected person`;

  const handleIsActive = () => {
    setIsActive(true);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': isActive && visiableContent.length,
          })}
          ref={dropdownRef}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputField}
              onChange={inputChange}
              onFocus={handleIsActive}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <People
              people={visiableContent}
              selectedPerson={selectedPerson}
              onSelect={handleSelect}
            />
          </div>
        </div>

        {!visiableContent.length && (
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
