import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { Person } from './types/Person';

type Props = {
  people: Person[];
  onSelect?: (person: Person) => void;
  // delay: number;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({
    people,
    onSelect = () => {},
    // delay,
  }) => {
    const [query, setQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    };

    const filteredPeople = useMemo(() => {
      if (!query) {
        return people;
      }

      return people.filter(
        person => {
          return person.name.toUpperCase().includes(query.trim().toUpperCase());
        },
      );
    }, [query, people]);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setIsDropdownOpen(false)}
          />
        </div>

        {isDropdownOpen && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">

              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'f',
                      'has-text-danger': person.sex === 'm',
                    })}

                    onClick={() => onSelect(person)}
                  >
                    {person.name}
                  </p>
                </div>
              ))}

              {!filteredPeople.length && 'No matching suggestions'}

            </div>
          </div>
        )}

      </div>
    );
  },
);

/*
          <div className="dropdown-item">
            <p className="has-text-link">Pieter Haverbeke</p>
          </div>

          <div className="dropdown-item">
            <p className="has-text-link">Pieter Bernard Haverbeke</p>
          </div>

          <div className="dropdown-item">
            <p className="has-text-link">Pieter Antone Haverbeke</p>
          </div>

          <div className="dropdown-item">
            <p className="has-text-danger">Elisabeth Haverbeke</p>
          </div>

          <div className="dropdown-item">
            <p className="has-text-link">Pieter de Decker</p>
          </div>

          <div className="dropdown-item">
            <p className="has-text-danger">Petronella de Decker</p>
          </div>

          <div className="dropdown-item">
            <p className="has-text-danger">Elisabeth Hercke</p>
          </div>
*/
