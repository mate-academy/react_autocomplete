import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  delay: number;
  onSelected: (person: Person) => void;
}

// function debounce(callback: Function, delay: number) {
//   let timerId = 0;

//   return (...args: any) => {
//     window.clearTimeout(timerId);

//     timerId = window.setTimeout(() => {
//       callback(...args);
//     }, delay);
//   };
// }

export const App: React.FC<AppProps> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [focusList, setFocusList] = useState(false);
  const [hasTitleError, setHasTitleError] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
    setHasTitleError(false);
  };

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    if (onSelected) {
      onSelected(person);
    }

    setFocusList(false);
    setHasTitleError(false);
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, []);

  const filteredPeople = useMemo(() => {
    if (appliedQuery.trim().length === 0) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.includes(appliedQuery),
    );
  }, [appliedQuery]);

  const inputBlurConditions = () => {
    setFocusList(false);
    if (!selectedPerson) {
      setHasTitleError(true);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              ref={inputField}
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setFocusList(true)}
              onBlur={() => inputBlurConditions()}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {focusList &&
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onMouseDown={() => handleSelectedPerson(person)}
                    style={{ cursor: 'pointer' }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && appliedQuery.trim().length > 0 && (
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
        {hasTitleError && filteredPeople.length > 0 && (
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
            <p className="has-text-danger">Please select a person</p>
          </div>
        )}
      </main>
    </div>
  );
};
