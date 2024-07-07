import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dropDown, setDropDown] = useState(false);
  const [appliedInputValue, setAppliedInputValue] = useState('');

  const applyInputValue = useCallback(debounce(setAppliedInputValue, 300), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    applyInputValue(event.target.value);
    setSelectedPerson(null);
    setDropDown(true);
  };

  const handleSelectPerson = (person: Person) => {
    setInputValue(person?.name);
    setSelectedPerson(person);
    setDropDown(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      const normalazedName = person.name.trim().toLowerCase();
      const normalazedQuery = appliedInputValue.trim().toLowerCase();

      return normalazedName.includes(normalazedQuery);
    });
  }, [appliedInputValue]);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdownElement = container.current;

      if (dropdownElement && !dropdownElement.contains(target)) {
        setDropDown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active" ref={container}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => {
                setDropDown(true);
              }}
            />
          </div>

          {dropDown && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div
                className={
                  filteredPeople.length !== 0 ? 'dropdown-content' : ''
                }
              >
                {filteredPeople.map(person => (
                  <div
                    key={person.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelectPerson(person)}
                  >
                    <p
                      className={classNames('has-text-link', {
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredPeople.length === 0 && (
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
