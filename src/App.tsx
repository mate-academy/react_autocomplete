import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { Dropdown } from './components';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  delay: number,
};

export const App: React.FC<Props> = ({ delay }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [value, setValue] = useState('');
  const [appliedValue, setAppliedValue] = useState('');

  const preparedPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(appliedValue)
    )) || null;
  }, [appliedValue, peopleFromServer]);

  const applyValue = useCallback(
    debounce(setAppliedValue, delay),
    [delay],
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const normalisedEvent = event.target.value.toLowerCase();

    setValue(event.target.value);
    applyValue(normalisedEvent);
  };

  const handleClick = useCallback((
    person: Person,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();

    setValue(person.name);
    setSelectedPerson(person);
    setAppliedValue('');
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={value}
            onChange={handleChange}
          />
        </div>

        {appliedValue && (
          <Dropdown
            people={preparedPeople}
            handleClick={handleClick}
          />
        )}
      </div>
    </main>
  );
};
