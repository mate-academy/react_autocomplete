import React, { useState, memo } from 'react';
import cn from 'classnames';

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
              people.map((person) => (
                <a
                  role="button"
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => {
                    onSelected(person);
                    revealDelay(false);
                  }}
                >
                  <p
                    className={cn({
                      'has-text-danger': selected?.slug === person.slug,
                      'has-text-link': selected?.slug !== person.slug,
                    })}
                  >
                    {person.name}
                  </p>
                </a>
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

export const Dropdown = memo(InnerDropdown);
