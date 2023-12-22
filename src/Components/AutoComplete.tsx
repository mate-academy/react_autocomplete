import cn from 'classnames';
import debounce from 'lodash.debounce';
import './AutoComplete.scss';
import React, { useCallback, useMemo, useState } from 'react';
import { peopleFromServer } from '../data/people';

type Person = {
  name: string,
  sex: string,
  born: number,
  died: number,
  fatherName: string | null,
  motherName: string | null,
  slug: string,
};

type Props = {
  delay: number,
};

export const AutoComplete: React.FC<Props> = ({ delay }) => {
  const [query, setQuery] = useState('');

  const [appliedQuery, setAppliedQuery] = useState('');

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [isFocused, setIsFocused] = useState(false);

  const handleButtonClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(personFromServer => personFromServer
        .name.toLowerCase().includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  let isSelectedRightPerson;
  let title = 'No selected person';

  if (selectedPerson && query === selectedPerson.name) {
    isSelectedRightPerson = true;

    if (isSelectedRightPerson) {
      title = `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`;
    }
  }

  return (
    <main className="section">
      <h1 className="title">
        {title}
      </h1>
      <div className={cn('dropdown', {
        'is-active': query !== selectedPerson?.name && isFocused,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
          />
        </div>
        { query && !appliedQuery ? (
          <div />
        ) : (
          <div className="dropdown-menu" role="menu">
            <div
              className="dropdown-content"
            >
              {filteredPeople.length ? (
                filteredPeople.map((person) => (
                  <div
                    className="dropdown-item"
                    key={person.name}
                  >
                    <button
                      type="button"
                      className="has-text-link"
                      onClick={() => handleButtonClick(person)}
                    >
                      {person.name}
                    </button>
                  </div>
                )))
                : (
                  <div className="dropdown-item">
                    <p className="has-text-link">No matching suggestions</p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
