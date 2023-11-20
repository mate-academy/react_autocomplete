import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';
import { Gender } from '../../types/Gender';

type Props = {
  suggestedPeople: Person[];
  onSelected: (person: Person) => void;
};

export const DropDownList: React.FC<Props> = React.memo(
  ({ suggestedPeople, onSelected }) => {
    return (
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {suggestedPeople.length
            ? (
              suggestedPeople.map(suggestedPerson => (
                <a
                  key={suggestedPerson.slug}
                  href="/"
                  className={classNames('dropdown-item', {
                    'has-text-link': suggestedPerson.sex === Gender.Male,
                    'has-text-danger': suggestedPerson.sex === Gender.Female,
                  })}
                  onClick={ev => {
                    ev.preventDefault();
                    onSelected(suggestedPerson);
                  }}
                >
                  {suggestedPerson.name}
                </a>
              ))
            )
            : (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            )}
        </div>
      </div>
    );
  },
);
