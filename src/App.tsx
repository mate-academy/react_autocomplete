import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(people =>
      people.name.includes(appliedQuery),
    );
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    applyQuery(newValue);
    setValue(newValue);
  };

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    setFocused(true);
  }, []);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!dropdownRef.current.contains(event.relatedTarget)) {
      setFocused(false);
    }
  };

  const onSelected = (person: Person) => {
    setSelectedPerson(person);
    setFocused(false);
  };

  const error = () => {
    if (filteredPeople.length === 0) {
      return true;
    }

    return false;
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson?.name === value
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': selectedPerson?.name !== value,
          })}
        >
          <div className="dropdown-trigger">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onClick={() => handleFocus()}
              onBlur={event => handleBlur(event)}
              onChange={event => {
                handleQueryChange(event);
              }}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {focused && (
              <div
                ref={dropdownRef}
                className={classNames({
                  'dropdown-content': !error(),
                })}
              >
                {filteredPeople.map(people => (
                  <div
                    key={people.name}
                    onMouseDown={() => {
                      onSelected(people);
                      setValue(people.name);
                    }}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                  >
                    <p
                      className={classNames({
                        'has-text-danger': people.sex === 'f',
                        'has-text-link': people.sex === 'm',
                      })}
                    >
                      {people.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error() && (
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
