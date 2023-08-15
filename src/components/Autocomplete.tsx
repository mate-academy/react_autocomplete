import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';

type Props = {
  setIndex: (index: number) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({ setIndex, delay }) => {
  const [query, setQuery] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [isMatching, setIsMatching] = useState(true);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMatching(true);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSearch = (personName: string) => {
    setQuery(personName);
    setIndex(peopleFromServer.findIndex(person => person.name === personName));
    setIsMatching(false);
  };

  const filteredPeople = (
    [...peopleFromServer].filter(person => {
      const lowerQuery = appliedQuery.toLocaleLowerCase();
      const fullName = person.name.toLowerCase();

      return fullName.includes(lowerQuery) && fullName !== lowerQuery;
    })
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onClick={() => setIsClicked(true)}
        />
      </div>
      {(filteredPeople.length === 0 && isMatching)
      && 'No matching suggestions'}
      {(isClicked && isMatching) && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
                onClick={() => handleSearch(person.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(person.name);
                  }
                }}
              >
                <p className="has-text-link">
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
