import React, { useCallback, useMemo, useState } from 'react';
import { peopleFromServer } from '../../data/people';
import './Autocomplete.scss';
import { Person } from '../../types/Person';

type Props = {
  selectedPerson: Person | null;
  onSelected: (person: Person) => void;
  delay: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [fullQuery, setFullQuery] = useState('');
  const [isSelectVisible, setIsSelectVisible] = useState(false);

  const applyQuery = useCallback(debounce(setFullQuery, delay), []);
  const applySelectVisibility = useCallback(debounce(setIsSelectVisible, delay),
    []);

  const suggestedPeople = useMemo(() => {
    return peopleFromServer
      .filter((person: Person) => {
        return person.name.toLowerCase().includes(fullQuery.toLowerCase());
      });
  }, [fullQuery]);

  const handleSelect = (personSelected: Person) => {
    onSelected(personSelected);
    setQuery(personSelected.name);
    setFullQuery(personSelected.name);
    setIsSelectVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    setIsSelectVisible(false);

    if (selectedPerson && e.target.value === selectedPerson.name) {
      return;
    }

    applySelectVisibility(true);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (selectedPerson && e.target.value === selectedPerson.name) {
      return;
    }

    setIsSelectVisible(true);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          className="input"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      </div>

      {isSelectVisible && (
        <div className="dropdown-menu" role="menu">
          <div className="container dropdown-content">
            {!!suggestedPeople.length
            && suggestedPeople.map(suggestedPerson => (
              <div
                className="dropdown-item"
                key={suggestedPerson.slug}
              >
                <button
                  type="button"
                  className="Button has-text-link"
                  onClick={() => handleSelect(suggestedPerson)}
                >
                  {suggestedPerson.name}
                </button>
              </div>
            ))}

            {!suggestedPeople.length && (
              <div className="dropdown-item">
                <p className="has-text-dark">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
