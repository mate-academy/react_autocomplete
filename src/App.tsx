import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDownMenu } from './components/DropdownMenu';
import { PersonData } from './types/PersonData';

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPersonData, setSelectedPersonData] =
    useState<PersonData | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name
        .toLowerCase()
        .trim()
        .includes(appliedQuery.toLowerCase().trim()),
    );
  }, [appliedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSelectPerson(value);

    if (!value.trim()) {
      setAppliedQuery('');
      setSelectedPersonData(null);
    } else {
      applyQuery(value.trim());
    }
  };

  useEffect(() => {
    if (selectPerson.trim() && filteredPeople.length) {
      const { name, born, died } = filteredPeople[0];

      setSelectedPersonData({ name, born, died });
    } else {
      setSelectedPersonData(null);
    }
  }, [filteredPeople]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPersonData && selectPerson === appliedQuery
            ? `${selectedPersonData.name} (${selectedPersonData.born} - ${selectedPersonData.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleInputChange}
              value={selectPerson}
            />
          </div>

          <DropDownMenu people={filteredPeople} />
        </div>

        {filteredPeople.length === 0 && (
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
