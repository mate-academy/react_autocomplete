import { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

// function debounce(callback: (query: string) => void, delay: number) {
//   let timerId = 0;

//   return (query: string) => {
//     window.clearTimeout(timerId);

//     timerId = window.setTimeout(() => callback(query), delay);
//   };
// }

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
          onChange={(event) => handleQueryChange(event)}
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
                className={`dropdown-item ${person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}
                onClick={(event) => handleItemChange(event, person)}
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
