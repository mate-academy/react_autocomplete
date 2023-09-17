import classNames from 'classnames';
import React from 'react';

import { Person } from '../types/Person';

const SEX_MALE = 'm';
const SEX_FEMALE = 'f';

type Props = {
  listIsVisible: boolean;
  query: string;
  onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setListIsVisible: (v: boolean) => void;
  preparedPeople: Person[],
  onSelectedPerson: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = ({
  listIsVisible,
  query,
  onQueryChange,
  setListIsVisible,
  preparedPeople,
  onSelectedPerson,
}) => {
  return (
    <div className={classNames('dropdown', {
      'is-active': listIsVisible,
    })}
    >
      <div className="dropdown-trigger">
        <input
          value={query}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onChange={onQueryChange}
          onFocus={() => setListIsVisible(true)}
          onBlur={() => setListIsVisible(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {!preparedPeople.length
            ? (
              <div className="dropdown-item">
                <p className="has-text-black">
                  No matching suggestions
                </p>
              </div>
            ) : preparedPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
                onMouseDown={() => onSelectedPerson(person)}
                aria-hidden="true"
                style={{ cursor: 'pointer' }}
              >
                <p className={classNames({
                  'has-text-link': person.sex === SEX_MALE,
                  'has-text-danger': person.sex === SEX_FEMALE,
                })}
                >
                  {person.name}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
