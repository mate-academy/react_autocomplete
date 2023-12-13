import { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

interface Props {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
}

export const Dropdown: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownShown, setIsDropdownShown] = useState(false);

  const applyQuery = useCallback(debounce((newQuery: string) => {
    setAppliedQuery(newQuery);
  }, delay), []);

  const filteredPeople = useMemo(() => {
    return people.filter(person => (
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())
    ));
  }, [appliedQuery]);

  const handleItemChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    onSelected(person);
    setIsDropdownShown(false);
    setQuery(person.name);
  };

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <div
      className={classNames(
        'dropdown',
        { 'is-active': isDropdownShown },
      )}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsDropdownShown(true)}
          onBlur={() => setIsDropdownShown(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length !== 0
            ? filteredPeople.map(person => (
              <a
                href="/"
                key={person.name}
                className={classNames(
                  'dropdown-item',
                  {
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  },
                )}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  handleItemChange(event, person);
                  setIsDropdownShown(false);
                }}
              >
                {person.name}
              </a>
            ))
            : (
              <p className="dropdown-item">No matching suggestions</p>
            )}
        </div>
      </div>
    </div>
  );
};
