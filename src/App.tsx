import React, {
  useState, useMemo, useEffect, useCallback,
} from 'react';
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
  const [selectedPeople, setSelectedPeople] = useState<Person | null>(null);
  const [showList, setShowList] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>('No selected person');

  const applyQuery = useCallback(
    debounce((inputQuery: string) => setAppliedQuery(inputQuery), 1000),
    [setAppliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputQuery = event.target.value;

    setQuery(inputQuery);
    applyQuery(inputQuery);
  };

  useEffect(() => {
    if (!query) {
      setSelectedPeople(null);
    }
  }, [query]);

  useEffect(() => {
    setPageTitle(() => {
      return selectedPeople
        ? `${selectedPeople.name} (${selectedPeople.born} - ${selectedPeople.died})`
        : 'No selected person';
    });
  }, [selectedPeople]);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person) => person.name
      .toLowerCase().includes(appliedQuery.trim().toLowerCase()));
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
            showList={showList}
            setShowList={setShowList}
            setPageTitle={setPageTitle}
          />

          <div className="dropdown-menu" role="menu">
            {showList
              && (filteredPeople.length ? (
                <div className="dropdown-menu">
                  <PersonList
                    filteredPeople={filteredPeople}
                    setSelectedPeople={setSelectedPeople}
                  />
                </div>
              ) : (
                <div
                  className="dropdown-content notification is-danger is-light"
                  data-cy="no-suggestions-message"
                >
                  No matching suggestions
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};
