import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people, setPeople] = React.useState<Person[]>(peopleFromServer);
  const [query, setQuery] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const applyQuery = React.useMemo(() => debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  React.useEffect(() => {
    setPeople(peopleFromServer);
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
    if (!query) {
      setAppliedQuery('');
    }
  };

  const handleSelect = (person: Person) => {
    setIsOpen(false);
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const suggestedPeople = React.useMemo(
    () =>
      people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      ),
    [people, appliedQuery],
  );

  const showNoSuggestions =
    isOpen && appliedQuery !== '' && suggestedPeople.length === 0;

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

        <div className={'dropdown' + (isOpen ? ' is-active' : '')}>
          <div className="dropdown-trigger">
            <input
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          {isOpen && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestedPeople.map(person => (
                  <div
                    key={person.slug}
                    onClick={() => handleSelect(person)}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showNoSuggestions && (
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
