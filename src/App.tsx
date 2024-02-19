import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
// eslint-disable-next-line
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const initialPerson = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [showPeopleList, setShowPeopleList] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || initialPerson;

  const dropdownRef = useRef(null);

  const applyQuery = useCallback(() => {
    setShowPeopleList(true);
  }, []);
  const debouncedApplyQuery = debounce(applyQuery, 1000);

  const filteredPersons = useMemo(() => {
    return peopleFromServer
      .filter(person => person
        .name.toLocaleLowerCase()
        .includes(query.toLowerCase()));
  }, [query]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedApplyQuery();
    setSelectedPerson(null);
    setShowPeopleList(false);
    setQuery(event.target.value);
  };

  const handleClick = (chosenPerson: Person) => {
    setSelectedPerson(chosenPerson);
    setQuery(chosenPerson.name);
  };

  const showList = () => {
    if (!query) {
      setShowPeopleList(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowPeopleList(false);
    }, 300);
  };

  const chosenPersonData = selectedPerson ? `${name} (${born} - ${died})` : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPersonData}
        </h1>

        <div className={classNames('dropdown', {
          'is-active': showPeopleList,
        })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              ref={dropdownRef}
              name="name-field"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInput}
              onFocus={showList}
              onBlur={handleInputBlur}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {filteredPersons.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <input
                    type="radio"
                    id={person.slug}
                    name="field-name"
                    className="dropdown-radio"
                    value={person.name}
                    onClick={() => handleClick(person)}
                  />
                  <label
                    htmlFor={person.slug}
                    className="has-text-link"
                  >
                    {person.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        {filteredPersons.length === 0 && (
          <div
            className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start"
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
