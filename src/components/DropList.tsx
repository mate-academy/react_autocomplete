import classNames from 'classnames';
import React from 'react';
import { Person } from '../types/Person';

type Props = {
  onSelected: (person: Person) => void
  suggestedPeople: Person[]
};

export const DrobList: React.FC<Props> = React.memo(
  ({ onSelected, suggestedPeople }) => {
    return (

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">

          {suggestedPeople.length
            ? (
              suggestedPeople.map((person: Person) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  key={person.slug}
                  className="dropdown-item"
                  onClick={() => onSelected(person)}
                >
                  <p className={classNames(
                    'suggestion-link',
                    'has-text-link',
                    { 'has-text-danger': person.sex === 'f' },
                  )}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            )
            : (
              <div
                className="dropdown-item"
              >
                <p>
                  No matching suggestions
                </p>
              </div>
            )}
        </div>
      </div>
    );
  },
);
