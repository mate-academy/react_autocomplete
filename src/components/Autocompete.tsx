import React from 'react';
import '../App.scss';
import { Person } from '../types/Person';

type Props = {
  dropDownList: Person[]
  onSelect: (slug: string) => void
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ dropDownList, onSelect }) => (
    <div className="dropdown-content">
      {
        dropDownList.length
          ? dropDownList.map((person: Person) => (
            <button
              type="button"
              className="dropdown-item button-normalize"
              key={person.slug}
              onClick={() => onSelect(person.slug)}
            >
              <p
                className={
                  person.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger'
                }
              >
                {person.name}
              </p>
            </button>
          ))
          : (
            <div className="dropdown-item">
              <p>
                No matching suggestions
              </p>
            </div>
          )
      }
    </div>
  ),
);
