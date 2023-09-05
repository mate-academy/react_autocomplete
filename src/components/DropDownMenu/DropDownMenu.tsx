import React from 'react';
import './DropDownMenu.scss';
import { Person } from '../../types/Person';

type Props = {
  people: Person[] | string[];
  onSelect: (person: Person) => void;
  personName: string;
};

function getRandomKey(): string {
  return Math.random()
    .toFixed(16)
    .slice(2);
}

export const DropdownMenu: React.FC<Props> = React
  .memo(({ people, onSelect, personName }) => {
    const isPersonActive = (person: Person) => {
      return person.name === personName;
    };

    return (
      <div
        className="dropdown-menu"
        role="menu"
      >
        <div className="dropdown-content">
          {people.map(person => {
            if (typeof person === 'string') {
              return (
                <div className="dropdown-item" key={getRandomKey()}>
                  <p className="has-text-link">{person}</p>
                </div>
              );
            }

            return (
              <button
                type="button"
                key={getRandomKey()}
                className={`dropdown-item button has-icons-right ${isPersonActive(person)
                  ? 'is-light'
                  : ''}`}
                onMouseDown={() => onSelect(person)}
              >
                <p className={person.sex === 'm'
                  ? 'has-text-link'
                  : 'has-text-danger'}
                >
                  {person.name}
                </p>
                {isPersonActive(person) && (
                  <span className="icon is-small is-right">
                    <i className="fas fa-check" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  });
