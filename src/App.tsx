import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import cn from 'classnames';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const [listIsVisible, setListIsVisible] = useState(false);

  const [newPeople, setNewPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return newPeople.filter(people =>
      people.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
    );
  }, [appliedQuery, newPeople]);

  const hideListOnBlur = useCallback(debounce(setListIsVisible, 300), []);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleOnQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  const handleOnFocus = () => {
    setNewPeople(peopleFromServer);
    setListIsVisible(true);
  };

  const handleMouseEnter = (itemName: string) => {
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleOnSelected = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setListIsVisible(false);
  };

  return (
    <div className="container">
      <main className="dropdown section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleOnQuery}
              onFocus={handleOnFocus}
              onBlur={() => hideListOnBlur(false)}
            />
          </div>

          {listIsVisible && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    key={person.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onMouseEnter={() => handleMouseEnter(person.name)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      backgroundColor:
                        hoveredItem === person.name ? 'lightblue' : 'white',
                    }}
                    onClick={() => handleOnSelected(person)}
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
                {filteredPeople.length === 0 && (
                  <div
                    className="
                      dropdown-item
                      notification
                      is-danger
                      is-light
                      is-align-self-flex-start
                      "
                    role="alert"
                    data-cy="no-suggestions-message"
                  >
                    <p className="has-text-danger">No matching suggestions</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
