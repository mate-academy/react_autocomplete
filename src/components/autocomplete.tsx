import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected?: (person: Person | string) => void;
};
export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected = () => {},
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filteredPeople = useMemo(() => {
    return people.filter(({ name }) => {
      return name.toLowerCase().includes(appliedQuery.toLowerCase().trim());
    });
  }, [appliedQuery, people]);

  const handlePersonSelect = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();

    const person = filteredPeople.find((personItem) => {
      return personItem.name === event.currentTarget.textContent || '';
    });

    if (person) {
      onSelected(person);
    }

    setQuery(event.currentTarget.textContent || '');
    applyQuery(event.currentTarget.textContent || '');

    setShowDropdown(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (event.target.value.length === 0) {
      onSelected('');
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
        />
      </div>

      {showDropdown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length ? (
              filteredPeople.map((person) => {
                const { slug, name, sex } = person;
                const isWoman = sex === 'f';

                return (
                  <div className="dropdown-item" key={slug}>
                    <a
                      className={classNames(
                        isWoman ? 'has-text-danger' : 'has-text-link',
                      )}
                      href="/"
                      onMouseDown={handlePersonSelect}
                    >
                      {name}
                    </a>
                  </div>
                );
              })
            ) : (
              <div className="dropdown-item">
                <p>No matching suggestion</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
