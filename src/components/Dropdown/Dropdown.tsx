import React, { useCallback, useState } from 'react';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

type Props = {
  delay: number;
  onClick: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = ({
  delay,
  onClick = () => {},
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectetPerson, setSelectedPerson] = useState<Person | null>(null);

  function debounce(callback: React.Dispatch<React.SetStateAction<string>>) {
    let timerId = 0;

    return (args: string) => {
      window.clearTimeout(timerId);

      timerId = window.setTimeout(() => {
        callback(args);
      }, delay);
    };
  }

  const applyQuery = useCallback(
    debounce(setAppliedQuery), [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = peopleFromServer.filter(persone => (
    persone.name.toLowerCase().includes(appliedQuery.toLowerCase())
  ));

  const handlePersonClick = (persone: Person) => {
    onClick(persone);
    setQuery(persone.name);
    setSelectedPerson(persone);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {appliedQuery !== '' && selectetPerson?.name !== query && (
          <div className="dropdown-content">
            {filteredPeople.length !== 0 ? (
              filteredPeople.map(persone => (
                <div
                  className="dropdown-item button is-light"
                  key={persone.slug}
                  onClick={() => handlePersonClick(persone)}
                  aria-hidden="true"
                >
                  <p className="has-text-link">
                    {persone.name}
                  </p>
                </div>
              ))
            ) : (
              'No matching suggestions'
            )}
          </div>
        )}
      </div>
    </div>
  );
};
