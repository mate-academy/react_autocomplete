import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person;
  onSelect: (person: Person | null) => void;
  setQuery: (query: string) => void;
  setAppliedQuery: (query: string) => void;
  selectedPerson: Person | null;
};

export const DropDownItem: React.FC<Props> = React.memo(
  ({
    person,
    onSelect,
    setQuery,
    setAppliedQuery,
    selectedPerson,
  }) => {
    const resetQuery = () => {
      setQuery('');
      setAppliedQuery('');
      onSelect(null);
    };

    return (
      <div className="dropdown-item dropdown-item--container">
        <p
          role="presentation"
          onMouseDown={() => onSelect(person)}
          className={classNames('item', {
            'has-text-link': person.sex === 'm',
            'has-text-danger': person.sex === 'f',
          })}
        >
          {person.name}
        </p>
        {selectedPerson && (
          <button
            className="button button--uniq"
            type="button"
            onClick={resetQuery}
          >
            X
          </button>
        )}
      </div>
    );
  },
);
