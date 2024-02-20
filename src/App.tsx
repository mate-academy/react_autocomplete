import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { PersonList } from './components/PersonList/PersonList';
import { InputPeople } from './components/InputPeople/InputPeople';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPeople, setSelectedPeople] = useState(null as Person | null);
  const [isListShow, setIsListShow] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>('No selected person');

  const debounceQuery = useMemo(
    () => debounce((inputQuery: string) => setAppliedQuery(inputQuery), 1000),
    [setAppliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputQuery = event.target.value;

    setQuery(inputQuery);
    debounceQuery(inputQuery);
  };

  useEffect(() => {
    if (!query) {
      setSelectedPeople(null);
    }
  }, [query]);

  const filteredPeople = useMemo(() => {
    const lowerCaseQuery = appliedQuery.trim().toLowerCase();

    return peopleFromServer.filter((person) => {
      return person.name.toLowerCase().includes(lowerCaseQuery);
    });
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section">
        <h1 className="title" data-cy="title">
          {pageTitle}
        </h1>

        <div
          className={classNames('dropdown', { 'is-active': !selectedPeople })}
        >
          <InputPeople
            query={query}
            appliedQuery={appliedQuery}
            setAppliedQuery={setAppliedQuery}
            handleQueryChange={handleQueryChange}
            setQuery={setQuery}
            selectedPeople={selectedPeople}
            setSelectedPeople={setSelectedPeople}
            isListShow={isListShow}
            setIsListShow={setIsListShow}
            setPageTitle={setPageTitle}
          />

          <div className="dropdown-menu" role="menu">
            {isListShow && (
              <>
                {filteredPeople.length ? (
                  <PersonList
                    filteredPeople={filteredPeople}
                    setSelectedPeople={setSelectedPeople}
                    setPageTitle={setPageTitle}
                  />
                ) : (
                  <div
                    className="dropdown-content notification is-danger is-light"
                    data-cy="no-suggestions-message"
                  >
                    No matching suggestions
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
