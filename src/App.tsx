import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [isDropedDown, setIsDropedDown] = React.useState(false);
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );

  const { name, born, died } = selectedPerson || {};

  const getFilterPeople = (): Person[] => {
    if (!query) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase().trim()),
    );
  };

  const handlerBlur = () => {
    setTimeout(() => {
      setIsDropedDown(false);
    }, 300);
  };

  const handlerOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setQuery(value);

    if (!value) {
      setSelectedPerson(null);
    }
  };

  const handlerClear = () => {
    setSelectedPerson(null);
    setQuery('');
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {name ? (
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
              onFocus={() => setIsDropedDown(true)}
              onBlur={handlerBlur}
              value={query}
              onChange={handlerOnChange}
            />
          </div>

          <div className="control">
            <button className="button is-info" onClick={handlerClear}>
              Clear
            </button>
          </div>

          <div
            className="dropdown-menu custom-dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            {isDropedDown &&
              getFilterPeople().map(person => (
                <div
                  className="
                  dropdown-content
                  custom-dropdown-item
                  "
                  key={person.name}
                  onClick={() => {
                    setQuery(person.name);
                    setIsDropedDown(false);
                    setSelectedPerson(person);
                  }}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <div className="dropdown-item" data-cy="suggestion-item">
                    <p className="has-text-link">{person.name}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {getFilterPeople().length === 0 && (
          <div
            className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}

        {selectedPerson && selectedPerson && getFilterPeople().length > 0 && (
          <div
            className="
                  notification
                  is-info
                  is-light
                  mt-3
                  is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-info">Person founded</p>
          </div>
        )}
      </main>
    </div>
  );
};
