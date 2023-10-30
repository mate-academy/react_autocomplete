import cn from 'classnames';
import React, { useState } from 'react';

import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  delay?: number;
  selected?: Person | null;
  onSelected: (person: Person) => void;
  query: string;
  onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InnerDropdown: React.FC<Props> = ({
  people,
  delay = 150,
  selected,
  onSelected,
  query,
  onQueryChange,
}) => {
  const [reveal, setReveal] = useState(false);

  const revealDelay = (key: boolean) => {
    setTimeout(() => {
      setReveal(key);
    }, delay);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected) {
      onQueryChange(event);
    }

    if (event.target.value) {
      onQueryChange(event);
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        {query ? (
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleOnChange}
            onClick={() => revealDelay(true)}
          />
        ) : (
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={selected?.name || ''}
            onChange={handleOnChange}
            onClick={() => revealDelay(true)}
          />
        )}
      </div>
      {reveal && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {people.length ? (
              people.map((person, index) => (
                <div
                  role="menuitem"
                  tabIndex={index}
                  key={person.slug}
                  onKeyDown={() => {
                    onSelected(person);
                    revealDelay(false);
                  }}
                  onClick={() => {
                    onSelected(person);
                    revealDelay(false);
                  }}
                  className={cn('dropdown-item', {
                    'has-background-info-light': selected?.slug === person.slug,
                    '': selected?.slug !== person.slug,
                  })}
                >
                  <p
                    className={cn({
                      'has-text-danger': person?.sex === 'f',
                      'has-text-link': person?.sex === 'm',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-link">No selected person</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const Dropdown = React.memo(InnerDropdown);
