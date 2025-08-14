import React, { ReactElement } from 'react';
import { Person } from '../types/Person';

type Props = {
  peoples: Person[];
  delay: number;
  debounce: boolean;
};

export const Autocomplete: React.FC<Props> = ({
  peoples,
  delay,
  debounce,
  setDebounce,
  setSelected,
}): ReactElement => {
  setTimeout(() => {
    setDebounce(true);
  }, delay);

  return (
    <>
      {peoples.length > 0 && debounce && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {peoples.map((people: Person) => {
              return (
                <div
                  onClick={() => {
                    setSelected(people);
                  }}
                  className="dropdown-item"
                  key={people.born * Math.round(Math.random() * 10000000)}
                  data-cy="suggestion-item"
                >
                  <p className="has-text-link">{people.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
