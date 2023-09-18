import classNames from 'classnames';
import { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onPersonSelected: (person: Person) => void,
  delay: number;
};

function getFilteredfilteredPeople(people: Person[], query: string) {
  return people.filter(({ name }) => {
    const preparedName = name.toLowerCase();
    const preparedQuery = query.trim().toLowerCase();

    return preparedName.includes(preparedQuery);
  });
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onPersonSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const applyQuery = debounce(setAppliedQuery, delay);
  const handlePersonSelect = (
    event: React.MouseEvent,
    person: Person,
  ) => {
    event.preventDefault();
    onPersonSelected(person);
    setQuery(person.name);
    setIsDropdownVisible(false);
  };

  const filteredPeople = useMemo(
    () => getFilteredfilteredPeople(people, appliedQuery),
    [appliedQuery, people],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isDropdownVisible })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => {
            setTimeout(() => setIsDropdownVisible(false), 1);
          }}
          onChange={(e) => handleQueryChange(e)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person: Person) => {
              return (
                <a
                  href={`#${person.slug}`}
                  className="dropdown-item"
                  key={person.slug}
                  onClick={(event) => handlePersonSelect(event, person)}
                >
                  <p className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  >
                    {person.name}
                  </p>
                </a>
              );
            })
          ) : (
            <p>No matching suggestions</p>
          )}
        </div>
      </div>
    </div>
  );
};
