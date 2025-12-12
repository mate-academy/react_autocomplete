import debounce from 'lodash.debounce';
import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  inputDelay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({
  inputDelay = 300,
  onSelected = () => {},
}) => {
  const [immediateQuery, setImmediateQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isListShown, setIsListShown] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const debouncedApplyQuery = useMemo(() => {
    const fn = debounce((value: string) => {
      setAppliedQuery(value);
    }, inputDelay);

    return fn;
  }, [inputDelay]);

  useEffect(() => {
    return () => {
      debouncedApplyQuery.cancel();
    };
  }, [debouncedApplyQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(null);
    setImmediateQuery(event.target.value);
    debouncedApplyQuery(event.target.value);
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setImmediateQuery(person.name);
    setIsListShown(false);
    onSelected(person);
  };

  const handleInputFocus = () => {
    setIsListShown(true);
  };

  const filteredPeople = useMemo(() => {
    if (isListShown && appliedQuery.trim() === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person => {
      return Object.values(person).some(value =>
        String(value).toLowerCase().includes(appliedQuery.toLowerCase()),
      );
    });
  }, [appliedQuery, isListShown]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isListShown ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              onChange={handleQueryChange}
              onFocus={handleInputFocus}
              value={immediateQuery}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => handlePersonSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isListShown && filteredPeople.length === 0 && (
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
