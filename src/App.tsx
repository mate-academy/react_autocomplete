import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';

type Person = {
  name: string;
  sex: string;
  born: number;
  died: number;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
};

export const App: React.FC = () => {
  const people = [...peopleFromServer];
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelect = (item: Person) => {
    setSelectedPerson(item);
    setQuery('');
  };

  const handleKeyPress = (event: React.KeyboardEvent, item: Person) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleSelect(item);
    }
  };

  const handleFocused = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 300);
  };

  const applyQuery = debounce(setAppliedQuery, 300);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const getFilteredPeople = (): Person[] => {
    const filteredPeople: Person[] = people.filter(item => {
      return item.name.includes(appliedQuery);
    });

    return filteredPeople;
  };

  const preperedPeople: Person[] = getFilteredPeople();

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={handleFocused}
              onBlur={handleBlur}
              onChange={handleQueryChange}
            />
          </div>

          <div
            className={classNames('dropdown-menu', {
              'is-hidden': !isFocused || preperedPeople.length === 0,
            })}
            role="menu"
            data-cy="suggestions-list"
          >
            <div
              className={classNames('dropdown-content', {
                'is-hidden': !isFocused,
              })}
            >
              {preperedPeople.map((item, index) => {
                return (
                  <div
                    role="button"
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={item.slug}
                    tabIndex={index}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      handleKeyPress(event, item);
                    }}
                    onClick={() => {
                      handleSelect(item);
                    }}
                  >
                    <p
                      className={classNames('text', {
                        'has-text-link': item.sex === 'm',
                        'has-text-danger': item.sex === 'f',
                      })}
                    >
                      {item.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={classNames(
            'notification is-danger is-light mt-3 is-align-self-flex-start',
            {
              'is-hidden': preperedPeople.length !== 0,
            },
          )}
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      </main>
    </div>
  );
};
