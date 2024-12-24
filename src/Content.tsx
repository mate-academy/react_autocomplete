import React, { useMemo } from 'react';
import { Person } from './types/Person';
import classNames from 'classnames';
import { Dropdown } from './Dropdown';

interface ContentProps {
  debounce: (
    fn: (...args: string[]) => void,
    delay: number,
  ) => (...args: [string]) => void;
  delay: number;
  peopleFromServer: Person[];
}

export const Content: React.FC<ContentProps> = ({
  debounce,
  delay,
  peopleFromServer,
}) => {
  const [query, setQuery] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);
  // const [people, setPeople] = React.useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );

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
