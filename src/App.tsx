import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import classNames from 'classnames';

type Props = {
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

export const App: React.FC<Props> = ({
  delay = 300,
  onSelected = () => {},
}) => {
  const [people] = useState(peopleFromServer);
  const [inputValue, setInputValue] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState<Person | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);
  const searchField = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    applyQuery(event.target.value);

    if (event.target.value !== selected?.name) {
      setSelected(null);
      onSelected(null);
    }

    setIsFocused(true);
  };

  const handleBlur = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const filteredPeople = useMemo(
    () =>
      people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
      ),
    [people, appliedQuery],
  );

  const handleSelectPerson = (person: Person) => {
    setSelected(person);
    onSelected(person);
    setInputValue(person.name);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              ref={searchField}
              value={inputValue}
              onChange={handleChangeInput}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
            />
          </div>

          {isFocused && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
              onMouseDown={e => e.preventDefault()}
            >
              <div
                className="dropdown-content"
                style={{
                  height: 300,
                  overflowY: 'auto',
                }}
              >
                {(appliedQuery === '' ? people : filteredPeople).map(person => (
                  <div
                    className="dropdown-item"
                    style={{
                      cursor: 'pointer',
                    }}
                    data-cy="suggestion-item"
                    key={person.slug}
                  >
                    <p
                      className={classNames('has-text-link', {
                        'has-text-danger': hoveredPerson === person.name,
                      })}
                      onMouseEnter={() => setHoveredPerson(person.name)}
                      onMouseLeave={() => setHoveredPerson(null)}
                      onClick={() => handleSelectPerson(person)}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isFocused && appliedQuery && filteredPeople.length === 0 && (
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
