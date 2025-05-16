import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [personDetail, setPersonDetail] = useState<Person | undefined>();
  const [query, setQuery] = useState('');
  const [sectionList, setSectionList] = useState(false);

  const searchQuery = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase().trim()),
  );

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setQuery(newValue);

    if (
      newValue === '' ||
      (personDetail && !newValue.includes(personDetail.name))
    ) {
      setPersonDetail(undefined);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {personDetail === undefined
            ? 'No selected person'
            : `${personDetail.name} (${personDetail.born} - ${personDetail.died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputOnChange}
              onFocus={() => {
                setSectionList(true);
              }}
              onBlur={() => {
                setSectionList(false);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {sectionList && (
              <div className="dropdown-content">
                {searchQuery.map((person, index) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={index}
                    onClick={() => setPersonDetail(person)}
                  >
                    <p
                      className={
                        person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {query.length > 0 && searchQuery.length === 0 && (
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
