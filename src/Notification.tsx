import React, { useMemo, useState } from 'react';
import { Dropdown } from './Dropdown';
import { Person } from './types/Person';
import classNames from 'classnames';

interface Props {
  debounce: (
    fn: (...args: string[]) => void,
    delay: number,
  ) => (...args: [string]) => void;
  delay: number;
  peopleFromServer: Person[];
}

export const Notification: React.FC<Props> = ({
  debounce,
  delay,
  peopleFromServer,
}) => {
  // #region state
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  // #endregionstate

  // #region handlers
  const handleFocus = () => {
    setIsActive(true);
  };

  const deboncedSetQuery = useMemo(
    () => debounce((value: string) => setAppliedQuery(value), delay),
    [debounce, delay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    deboncedSetQuery(event.target.value);
    setSelectedPerson(null);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, peopleFromServer]);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setIsActive(false);
  };

  // #endregion handlers

  return (
    <main className="section is-flex is-flex-direction-column">
      <h1 className="title" data-cy="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', { 'is-active': isActive })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onFocus={handleFocus}
            onChange={handleInputChange}
          />
        </div>

        <Dropdown people={filteredPeople} onSelected={handleSelectPerson} />
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
  );
};
