import { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import cn from 'classnames';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [dropdownIsShown, setDropdownIsShown] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handlePersonClick = (person: Person) => {
    setDropdownIsShown(false);
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trimStart();

    setQuery(value);
    if (value.trim() === '') {
      setAppliedQuery('');
      setSelectedPerson(null);

      return;
    }

    applyQuery(value);
    setSelectedPerson(null);
  };

  const filteredPeople = peopleFromServer.filter(person => {
    return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
  });

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

        <div className={cn('dropdown', { 'is-active': dropdownIsShown })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setDropdownIsShown(true)}
            />
          </div>
          {dropdownIsShown && filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handlePersonClick(person)}
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
              </div>
            </div>
          )}
        </div>
        {filteredPeople.length === 0 && query.trim() !== '' && (
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
