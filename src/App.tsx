import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  debounceDelay?: number;
}

export const App: React.FC<AppProps> = ({ debounceDelay = 300 }) => {
  const people: Person[] = useMemo(
    () => [...peopleFromServer],
    [peopleFromServer],
  );
  const [isSelected, setIsSelected] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person>(people[0]);
  const [filterUserText, setFilterUserText] = useState('');
  const [debouncedText, setDebouncedText] = useState(filterUserText);
  const { name, born, died } = selectedPerson;

  const setUserText = (event: string) => {
    setFilterUserText(event);
    setIsSelected(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(filterUserText);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [filterUserText, debounceDelay]);

  const filterPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(debouncedText.toLowerCase()),
    );
  }, [debouncedText, people]);

  const handleUser = (person: Person) => {
    setSelectedPerson(person);
    setIsSelected(true);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {isSelected ? (
          <h1 className="title" data-cy="title">
            {`${name} (${born} - ${died})`}
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
              onChange={event => setUserText(event.target.value)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filterPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onClick={() => handleUser(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filterPeople.length === 0 && (
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
