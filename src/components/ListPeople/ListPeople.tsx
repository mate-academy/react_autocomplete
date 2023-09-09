import React, { useState } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  people: Person[]
  query: string,
  onQuery?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSelected?: (person: Person) => void
}

export const ListPeople: React.FC<Props> = React.memo(
  ({
    people,
    query,
    onQuery = () => { },
    onSelected = () => { },
  }) => {
    const [showPeople, setShowPeople] = useState(false);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={onQuery}
            onClick={() => setShowPeople(true)}
            onBlur={() => setTimeout(() => setShowPeople(false), 100)}
          />
        </div>

        {showPeople && (
          <div className="dropdown-menu" role="menu">
            {people.length
              ? (
                <div className="dropdown-content">
                  {people.map(person => (
                    <a
                      key={person.slug}
                      className={cn('dropdown-item', {
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                      href={`${person.slug}`}
                      onClick={(event) => {
                        event.preventDefault();

                        onSelected(person);
                      }}
                    >
                      {person.name}
                    </a>
                  ))}
                </div>
              )
              : (
                <p>No matching suggestions</p>
              )}
          </div>
        )}
      </div>
    );
  },
);
