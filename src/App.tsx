import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [comparator, setComparator] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyComparator = useCallback(debounce(setComparator, 300), []);
  const [selected, setSelected] = useState<Person | null>(null);
  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => person.name.includes(comparator));
  }, [comparator]);

  const handleApplyQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyComparator(event.target.value);
    setSelected(null);
  };

  const selectedPerson = selected
    ? `${selected.name} (${selected.born} - ${selected.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson}
        </h1>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleApplyQuery}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map((person, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => setSelected(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!filteredPeople[0] && (
          <div
            className=" notification is-danger is-light mt-3
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
